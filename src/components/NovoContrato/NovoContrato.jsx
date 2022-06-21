import React, { useState } from 'react';
import { 
    Paper, 
    Box, 
    Typography, 
    Button, 
    Fade, 
    Dialog, 
    DialogContent, 
    DialogActions,
    DialogContentText,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import FormNovoContrato from './FormNovoContrato';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, Link } from 'react-router-dom';

const NovoContrato = ({ setSnackbar }) => {
    const [error, setError] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openConfirmSair, setOpenConfirmSair] = useState(false);
    const [openErro, setOpenErro] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [novoContrato, setNovoContrato] = useState({
        tipo_contratacao: "",
        processo_sei: "",
        dotacao_orcamentaria: "",
        credor: "",
        cnpj_cpf: "",
        tipo_objeto: "",
        objeto: "",
        numero_contrato: "",
        data_assinatura: "",
        valor_contrato: "",
        valor_mensal_estimativo: "",
        data_inicio_vigencia: "",
        data_vencimento: "",
        condicao_pagamento: "",
        prazo_a_partir_de: "",
        data_prazo_maximo: "",
        nome_empresa: "",
        telefone_empresa: "",
        email_empresa: "",
        outras_informacoes: "",
        envio_material_tecnico: "",
        minuta_edital: "",
        abertura_certame: "",
        homologacao: "",
        fonte_recurso: "",
    });

    const navigate = useNavigate();

    const limpaFormulario = () => {
        setNovoContrato({
            tipo_contratacao: "",
            processo_sei: "",
            dotacao_orcamentaria: "",
            credor: "",
            cnpj_cpf: "",
            tipo_objeto: "",
            objeto: "",
            numero_contrato: "",
            data_assinatura: "",
            valor_contrato: "",
            valor_mensal_estimativo: "",
            data_inicio_vigencia: "",
            data_vencimento: "",
            condicao_pagamento: "",
            prazo_a_partir_de: "",
            data_prazo_maximo: "",
            nome_empresa: "",
            telefone_empresa: "",
            email_empresa: "",
            outras_informacoes: "",
            envio_material_tecnico: "",
            minuta_edital: "",
            abertura_certame: "",
            homologacao: "",
            fonte_recurso: "",
        });
    }

    const handleClickEnviarFormulario = () => {
        setCarregando(true);

        if (!error) {
            const url = `${process.env.REACT_APP_API_URL}/contrato`
            const token = sessionStorage.getItem('access_token');
            const options = {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novoContrato)
            }

            fetch(url, options)
                .then(res => {
                    if (res.ok) {
                        setCarregando(false);
                        limpaFormulario();
                        handleCloseConfirm();
                        setSnackbar({
                            open: true,
                            severity: 'success',
                            text: 'Contrato enviado com sucesso!',
                            color: 'success'
                        });
                    } else {
                        handleCloseConfirm();
                        setCarregando(false);
                        setOpenErro(true);
                    }

                    return res.json();
                })
                .then(data => {
                    navigate(`../contrato/${data.data.id}`, { replace: true });
                    window.scrollTo(0, 0);
                })
        }
    }

    const handleCloseConfirm = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        } else {
            setOpenConfirm(false);
        }
    }

    const handleCloseConfirmSair = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        } else {
            setOpenConfirmSair(false);
        }
    }

    return(
        <Box
            component={Fade}
            in={true} 
            timeout={850} 
            sx={{ 
                alignSelf: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                margin: '2rem 1rem', 
                maxWidth: '1280px' 
            }}
        >
            <Box component={Paper} elevation={5}>
                <Typography 
                    variant="h5" 
                    component="h1" 
                    sx={{ 
                        padding: '1rem', 
                        background: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.color.main,
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        fontWeight: 'light',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Link to="/principal">
                        <Tooltip title="Voltar" arrow>
                            <IconButton sx={{ mr: '0.5rem' }}>
                                <ArrowBackIosNewIcon sx={{ color: (theme) => theme.palette.color.main }} />
                            </IconButton>
                        </Tooltip>
                    </Link>
                    Novo contrato
                </Typography>
                
                <FormNovoContrato 
                    formContrato={novoContrato} 
                    setFormContrato={setNovoContrato} 
                    error={error}
                    setError={setError} 
                    setOpenConfirm={setOpenConfirm}
                    setOpenConfirmSair={setOpenConfirmSair}
                />

                <Dialog open={openConfirm} onClose={handleCloseConfirm} fullWidth>
                    <DialogContent>
                        <DialogContentText sx={{ mt: '1rem' }}>Confirma o envio do novo contrato?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{ textTransform: 'none', color: (theme) => theme.palette.error.main }} onClick={handleCloseConfirm}>
                            <CloseIcon fontSize="small" sx={{ mr: '0.2rem' }} /> Não
                        </Button>
                        <Button sx={{ textTransform: 'none', color: (theme) => theme.palette.success.main }} onClick={handleClickEnviarFormulario}>
                            {carregando
                                ? <CircularProgress size={16} sx={{ mr: '0.4rem' }} />
                                : <CheckIcon fontSize="small" sx={{ mr: '0.2rem' }} />
                            }
                            Sim
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openConfirmSair} onClose={handleCloseConfirmSair} fullWidth>
                    <DialogContent>
                        <DialogContentText sx={{ mt: '1rem' }}>Tem certeza que deseja cancelar o envio do novo contrato e voltar à página principal?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{ textTransform: 'none', color: (theme) => theme.palette.error.main }} onClick={handleCloseConfirmSair}>
                            <CloseIcon fontSize="small" sx={{ mr: '0.2rem' }} /> Não
                        </Button>
                        <Link to="../principal">
                            <Button sx={{ textTransform: 'none', color: (theme) => theme.palette.success.main }}>
                                <CheckIcon fontSize="small" sx={{ mr: '0.2rem' }} /> Sim
                            </Button>
                        </Link>
                    </DialogActions>
                </Dialog>

                <Dialog open={openErro} onClose={() => { setOpenErro(false); }}>
                    <DialogContent>
                        <DialogContentText sx={{ mt: '1rem' }}>Não foi possível enviar o contrato, tente novamente.</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setOpenErro(false); }} >Ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default NovoContrato;