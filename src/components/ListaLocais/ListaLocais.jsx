import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper
} from '@mui/material';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';

const dicionarioRegioes = {
    "CO": "Centro-Oeste",
    "L": "Leste",
    "N": "Norte",
    "S": "Sul"
}

const TabLocaisServico = (props) => {
    const campos = [
        "Região",
        "Subprefeitura",
        "Distrito"
    ];

    const valores = [
        dicionarioRegioes[props.regiao],
        props.subprefeitura,
        props.distrito
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}


const ListaLocais = (props) => {
    const {
        locais,
        estaCarregado,
        retornaCampoValor,
        numContrato,
        setSnackbar,
        ...other
    } = props;

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormLocal, setOpenFormLocal] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formLocal, setFormLocal] = useState({
        contrato_id: numContrato,
        regiao: '',
        subprefeitura_id: '',
        distrito_id: ''
    });

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiLocal = (id) => {
        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api/servicolocal/${id}`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setOpenConfirmacao({ open: false, id: '' });
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Local de serviço excluído com sucesso!',
                        color: 'success'
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível excluir o local`,
                        color: 'error'
                    });
                }
            })
    }

    return (
        <Box>
            {locais.map((local, index) => {
                return (
                    <Box
                        key={index}
                        elevation={3}
                        component={Paper}
                        sx={{ padding: '1rem', mb: '2rem' }}
                    >
                        <Divider
                            textAlign='right'
                            sx={{
                                fontWeight: 'light',
                                fontSize: '1.25rem'
                            }}
                        >
                            Local de serviço # {local.id}
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TabLocaisServico 
                                regiao={local.regiao}
                                subprefeitura={local.subprefeitura}
                                distrito={local.distrito}
                                estaCarregado={estaCarregado}
                                retornaCampoValor={retornaCampoValor}
                            />

                            <BotoesTab 
                                // editar={(e) => { handleClickEditar(e, aditamento, aditamento.id); }}
                                excluir={() => { handleClickExcluir(local.id); }}
                            />
                        </Box>
                    </Box>
                )
            })}

            <BotaoAdicionar 
                // fnAdicionar={handleClickAdicionar}
                texto="Adicionar local"
            />

            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao} 
                fnExcluir={excluiLocal}
                //fnEditar={editaLocal}
                formInterno={formLocal}
                carregando={carregando}
                texto="local de serviço"
            />
        </Box>
    );
}

export default ListaLocais;