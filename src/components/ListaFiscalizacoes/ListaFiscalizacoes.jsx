import React, { useEffect, useState } from 'react';
import { 
    Box,
    Divider,
    Paper,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import FormGestaoFiscalizacao from './FormGestaoFiscalizacao';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import { postFormData, putFormData, sendFiscalizacaoEdit, sendNewFiscalizacao } from '../../commom/utils/api';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';

const TabFiscalizacao = (props) => {
    const campos = [
        "Gestor",
        "E-mail Gestor",
        "Fiscal",
        "E-mail Fiscal",
        "Suplente",
        "E-mail Suplente"
    ];

    const valores = [
        props.nome_gestor,
        props.email_gestor,
        props.nome_fiscal,
        props.email_fiscal,
        props.nome_suplente,
        props.email_suplente
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaFiscalizacoes = (props) => {
    const {
        fiscalizacoes,
        setFiscalizacoes,
        mudancaFiscalizacoes,
        setMudancaFiscalizacoes,
        carregandoFiscalizacoes,
        setCarregandoFiscalizacoes,
        estaCarregado,
        retornaCampoValor,
        setSnackbar,
        numContrato
    } = props;

    const handleClickConfirmar = () => {
        if (openFormFiscalizacao.acao === 'adicionar') {
            enviaFiscalizacao();
        } else if (openFormFiscalizacao.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formFiscalizacao.id
            });
        }
    }
    
    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormFiscalizacao, setOpenFormFiscalizacao] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formFiscalizacao, setFormFiscalizacao] = useState({
        contrato_id: numContrato,
        nome_gestor: '',
        email_gestor: '',
        nome_fiscal: '',
        email_fiscal: '',
        nome_suplente: '',
        email_suplente: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/gestaofiscalizacoes/${numContrato}`;
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
                setFiscalizacoes(data.data);
                setCarregandoFiscalizacoes(false);
            })
    }, [mudancaFiscalizacoes, numContrato, setFiscalizacoes, setCarregandoFiscalizacoes])

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiFiscalizacao = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/gestaofiscalizacao/${id}`
        const token = localStorage.getItem('access_token');
        const option = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        setCarregando(true);

        fetch(url, option)
            .then(res => {
                setMudancaFiscalizacoes(!mudancaFiscalizacoes);
                if (res.ok) {
                    setOpenConfirmacao({ open: false, id: ''});
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Gestão/fiscalização excluída com sucesso!',
                        color: 'success'
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível excluir`,
                        color: 'error'
                    });
                }
            });
    }

    const handleClickEditar = (e, fiscalizacao) => {
        setFormFiscalizacao({
            id: fiscalizacao.id,
            contrato_id: fiscalizacao.contrato_id,
            nome_gestor: fiscalizacao.nome_gestor,
            email_gestor: fiscalizacao.email_gestor,
            nome_fiscal: fiscalizacao.nome_fiscal,
            email_fiscal: fiscalizacao.email_fiscal,
            nome_suplente: fiscalizacao.nome_suplente,
            email_suplente: fiscalizacao.email_suplente
        });
        setOpenFormFiscalizacao({
            open: true,
            acao: 'editar'
        });
        setAcao('editar');
    }

    const editaFiscalizacao = async (id, formFiscalizacaoEdit) => {
        setCarregando(true);
        const res = await putFormData( id, formFiscalizacaoEdit, "gestaofiscalizacao")
        if(res.status === 200) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Gestão/fiscalização editada com sucesso!',
                color: 'success'
            });
            setOpenFormFiscalizacao({
                open: false,
                acao: 'adicionar'
            });
            setFormFiscalizacao({
                ...formFiscalizacao,
                nome_gestor: '',
                email_gestor: '',
                nome_fiscal: '',
                email_fiscal: '',
                nome_suplente: '',
                email_suplente: ''
            });
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível editar a gestão/fiscalização`,
                color: 'error'
            });
        }
        setMudancaFiscalizacoes(!mudancaFiscalizacoes);
        setCarregando(false);
    }

    const handleClickAdicionar = () => {
        setOpenFormFiscalizacao({
            open: true,
            acao: 'adicionar'
        });
        setFormFiscalizacao({
            contrato_id: numContrato,
            nome_gestor: '',
            email_gestor: '',
            nome_fiscal: '',
            email_fiscal: '',
            nome_suplente: '',
            email_suplente: ''
        });
    }

    const enviaFiscalizacao = async (formFisc) => {
        setCarregando(true);
        const res = await postFormData(formFisc, "gestaofiscalizacao")
        if (res.status === 201) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Gestão/fiscalização enviada com sucesso!',
                color: 'success'
            });
            setOpenFormFiscalizacao({
                open: false,
                acao: 'adicionar'
            });
            setFormFiscalizacao({
                ...formFiscalizacao,
                nome_gestor: '',
                email_gestor: '',
                nome_fiscal: '',
                email_fiscal: '',
                nome_suplente: '',
                email_suplente: ''
            });
        } else if (res.status === 422) {
            setCarregando(false);
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar a gestão/fiscalização`,
                color: 'error'
            });
            setErrors(res.errors);
        } else {
            setCarregando(false);
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar a gestão/fiscalização`,
                color: 'error'
            });
        }
        setCarregando(false);
        setMudancaFiscalizacoes(!mudancaFiscalizacoes);
        }

    return (
        <Box>
            {fiscalizacoes.map((fiscalizacao, index) => {
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
                                Gestão/fiscalização # {fiscalizacao.id}
                            </Divider>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TabFiscalizacao 
                                    nome_gestor={fiscalizacao.nome_gestor}
                                    email_gestor={fiscalizacao.email_gestor}
                                    nome_fiscal={fiscalizacao.nome_fiscal}
                                    email_fiscal={fiscalizacao.email_fiscal}
                                    nome_suplente={fiscalizacao.nome_suplente}
                                    email_suplente={fiscalizacao.email_suplente}
                                    retornaCampoValor={retornaCampoValor}
                                    estaCarregado={estaCarregado}
                                />

                                <BotoesTab 
                                    excluir={(e) => { handleClickExcluir(fiscalizacao.id); }}
                                    editar={(e) => { handleClickEditar(e, fiscalizacao, fiscalizacao.id); }}
                                />
                            </Box>
                        </Box>
                    </Fade>
                );
            })}

            <Dialog open={openFormFiscalizacao.open} fullWidth>
                <DialogTitle>
                    {openFormFiscalizacao.acao === 'adicionar'
                        ? "Nova gestão/fiscalização"
                        : "Editar gestão/fiscalização"
                    }
                </DialogTitle>
                <DialogContent>
                    <FormGestaoFiscalizacao 
                        formFiscalizacao={formFiscalizacao}
                        // setFormFiscalizacao={setFormFiscalizacao}
                        enviaFiscalizacao={enviaFiscalizacao}
                        editaFiscalizacao={editaFiscalizacao}
                        // carregando={carregando}
                        openFormFiscalizacao={openFormFiscalizacao}
                        // setOpenFormFiscalizacao={setOpenFormFiscalizacao}
                        // setOpenConfirmacao={setOpenConfirmacao}
                        errors={errors}
                        setErrors={setErrors}
                    />
                </DialogContent>
                <DialogActions sx={{ margin: '1rem' }}>
                    <Button
                        onClick={() => { setOpenFormFiscalizacao({ ...openFormFiscalizacao, open: false }); }}
                        sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                    >
                        <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                    </Button>
                    <Button
                        sx={{ textTransform: 'none' }}
                        variant="contained"
                        onClick={handleClickConfirmar}
                        type={openFormFiscalizacao.acao === 'adicionar' ? "submit" : ""}
                        form={openFormFiscalizacao.acao === 'adicionar' ? "fisc_form" : ""}
                    >
                        {carregando
                            ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                            : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" />
                        }
            
                        {openFormFiscalizacao.acao === 'adicionar'
                            ? "Enviar"
                            : "Editar"
                        }
                    </Button>
                </DialogActions>
            </Dialog>

            {
                carregandoFiscalizacoes
                ? 
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                        <CircularProgress size={30} />
                    </Box>
                : 
                    ""
            }  

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar gestão/fiscalização"
            />

            <DialogConfirmacao 
                openConfirmacao={openConfirmacao}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                form="fisc_form"
                fnExcluir={excluiFiscalizacao}
                fnEditar={editaFiscalizacao}
                formInterno={formFiscalizacao}
                carregando={carregando}
                texto="gestão/fiscalização"
            />
        </Box>
    );
}

export default ListaFiscalizacoes;