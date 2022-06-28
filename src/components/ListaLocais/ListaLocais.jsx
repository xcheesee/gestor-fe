import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper
} from '@mui/material';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import FormLocais from './FormLocais';

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
        "Distrito",
        "Unidade"
    ];

    const valores = [
        dicionarioRegioes[props.regiao],
        props.subprefeitura,
        props.distrito,
        props.unidade
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}


const ListaLocais = (props) => {
    const {
        locais,
        estaCarregado,
        retornaCampoValor,
        numContrato,
        setSnackbar
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
        distrito_id: '',
        unidade: ''
    });
    const [errors, setErrors] = useState({});

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiLocal = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/servicolocal/${id}`;
        const token = localStorage.getItem('access_token');
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

    const handleClickEditar = (e, local) => {
        setFormLocal({
            id: local.id,
            contrato_id: local.contrato_id,
            regiao: local.regiao,
            subprefeitura_id: local.subprefeitura_id,
            distrito_id: local.distrito_id,
            unidade: local.unidade
        });
        setOpenFormLocal({
            open: true,
            acao: 'editar'
        });
        setAcao('editar');
    }

    const editaLocal = (id, formLocalEdit) => {
        const url = `${process.env.REACT_APP_API_URL}/servicolocal/${id}`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formLocalEdit)
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Local de serviço editado com sucesso!',
                        color: 'success'
                    });
                    setOpenFormLocal({
                        open: false,
                        acao: 'adicionar'
                    });
                    setFormLocal({
                        ...formLocal,
                        regiao: '',
                        subprefeitura_id: '',
                        distrito_id: '',
                        unidade: ''
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar o local`,
                        color: 'error'
                    });
                }
            });
    }

    const handleClickAdicionar = () => {
        setOpenFormLocal({
            open: true,
            acao: 'adicionar'
        });
        setAcao('adicionar');
    }

    const enviaLocal = (form) => {
        const url = `${process.env.REACT_APP_API_URL}/servicolocal`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Local de serviço enviado com sucesso!',
                        color: 'success'
                    });
                    setOpenFormLocal({
                        open: false,
                        acao: 'adicionar'
                    });
                    setFormLocal({
                        ...formLocal,
                        regiao: '',
                        subprefeitura_id: '',
                        distrito_id: '',
                        unidade: ''
                    });
                    return res.json();
                } else if (res.status === 422) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível enviar o local`,
                        color: 'error'
                    });
                    return res.json()
                        .then(data => {
                            setErrors(data.errors);
                        });
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível enviar o local`,
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
                                unidade={local.unidade}
                                estaCarregado={estaCarregado}
                                retornaCampoValor={retornaCampoValor}
                            />

                            <BotoesTab 
                                editar={(e) => { handleClickEditar(e, local); }}
                                excluir={() => { handleClickExcluir(local.id); }}
                            />
                        </Box>
                    </Box>
                )
            })}

            <FormLocais 
                formLocal={formLocal}
                setFormLocal={setFormLocal}
                openFormLocal={openFormLocal}
                setOpenFormLocal={setOpenFormLocal}
                enviaLocal={enviaLocal}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                errors={errors}
                setErrors={setErrors}
            />

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar local"
            />

            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao} 
                fnExcluir={excluiLocal}
                fnEditar={editaLocal}
                formInterno={formLocal}
                carregando={carregando}
                texto="local de serviço"
            />
        </Box>
    );
}

export default ListaLocais;