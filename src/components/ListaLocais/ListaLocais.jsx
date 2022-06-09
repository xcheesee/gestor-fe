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
                                // excluir={() => { handleClickExcluir(aditamento.id); }}
                            />
                        </Box>
                    </Box>
                )
            })}

            <BotaoAdicionar 
                // fnAdicionar={handleClickAdicionar}
                texto="Adicionar local"
            />

        </Box>
    );
}

export default ListaLocais;