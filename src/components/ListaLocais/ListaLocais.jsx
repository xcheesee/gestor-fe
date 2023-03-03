import React, { useState, useEffect } from 'react';
import { 
    Box,
    Divider,
    Paper,
    CircularProgress,
    Fade
} from '@mui/material';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import FormLocais from './FormLocais';
import { postFormData, putFormData, sendLocalEdit, sendNewLocal } from '../../commom/utils/api';
import { TabValues } from '../../commom/utils/utils';
import { locaisLabels } from '../../commom/utils/constants';

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

    const valores = {
        ...props,
        regiao: dicionarioRegioes[props.regiao],
    }

    return <TabValues entry={valores} labels={locaisLabels} label='locais' />
}

const ListaLocais = (props) => {
    const {
        locais,
        setLocais,
        mudancaLocais,
        setMudancaLocais,
        carregandoLocais,
        setCarregandoLocais,
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
    
    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/servicoslocais/${numContrato}`
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                setLocais(data.data);
                setCarregandoLocais(false);
            })
    }, [mudancaLocais, numContrato, setLocais, setCarregandoLocais]);

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
                setMudancaLocais(!mudancaLocais);
                if (res.ok) {
                    setOpenConfirmacao({ open: false, id: '' });
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Regionalização excluída com sucesso!',
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

    const editaLocal = async (id, formLocalEdit) => {
        setCarregando(true);
        const res = await putFormData(id, formLocalEdit, "servicolocal")

        if (res.status === 200) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Regionalização editado com sucesso!',
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
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível editar o local`,
                color: 'error'
            });
        }
        setCarregando(false);
        setMudancaLocais(!mudancaLocais);
    }

    const handleClickAdicionar = () => {
        setOpenFormLocal({
            open: true,
            acao: 'adicionar'
        });
        setAcao('adicionar');
    }

    const enviaLocal = async (form) => {
        setCarregando(true);
        const res = await postFormData(form, "servicolocal")
        if (res.status === 201) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Regionalização enviado com sucesso!',
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
        } else if (res.status === 422) {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar o local`,
                color: 'error'
            });
            setErrors(res.errors);
        } else {
            setCarregando(false);
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar o local`,
                color: 'error'
            });
        }
        setCarregando(false);
        setMudancaLocais(!mudancaLocais);
    }

    return (
        <Box>
            {locais.map((local, index) => {
                return (
                    <Fade in={true} timeout={400} key={index}>
                        <Box
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
                                Regionalização # {local.id}
                            </Divider>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TabLocaisServico 
                                    regiao={local.regiao}
                                    subprefeitura={local.subprefeitura}
                                    distrito={local.distrito}
                                    unidade={local.unidade}
                                />

                                <BotoesTab 
                                    editar={(e) => { handleClickEditar(e, local); }}
                                    excluir={() => { handleClickExcluir(local.id); }}
                                />
                            </Box>
                        </Box>
                    </Fade>
                )
            })}

            <FormLocais 
                formLocal={formLocal}
                setFormLocal={setFormLocal}
                openFormLocal={openFormLocal}
                setOpenFormLocal={setOpenFormLocal}
                enviaLocal={enviaLocal}
                editaLocal={editaLocal}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                errors={errors}
                setErrors={setErrors}
            />

            {
                carregandoLocais
                ? 
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                        <CircularProgress size={30} />
                    </Box>
                : 
                    ""
            }   

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar local"
            />

            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                form="local_form"
                fnExcluir={excluiLocal}
                fnEditar={editaLocal}
                formInterno={formLocal}
                carregando={carregando}
                texto="regionalização"
            />
        </Box>
    );
}

export default ListaLocais;