import React, { useState } from 'react';
import { 
    Paper, 
    Box, 
    Fade
} from '@mui/material';
import FormNovoContrato from '../../components/FormNovoContrato'
import HeaderFormulario from '../../components/HeaderFormulario';
import DialogConfirm from '../../components/DialogConfirm';
import DialogConfirmSair from '../../components/DialogConfirmSair';
import DialogErroEnvio from '../../components/DialogErroEnvio';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NovoContrato = ({ setSnackbar }) => {
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState({});
    const [focusError, setFocusError] = useState('')
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openConfirmSair, setOpenConfirmSair] = useState(false);
    const [openErro, setOpenErro] = useState({
        status: '',
        open: false
    });
    const [carregando, setCarregando] = useState(false);
    const [novoContrato, setNovoContrato] = useState({
        licitacao_modelo_id: "",
        licitacao_modelo: "",
        envio_material_tecnico: "",
        minuta_edital: "",
        abertura_certame: "",
        homologacao: "",
        processo_sei: "",
        credor: "",
        dotacao_orcamentaria: "",
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
        numero_nota_reserva: "",
        valor_reserva: "",
        nome_empresa: "",
        telefone_empresa: "",
        email_empresa: "",
        outras_informacoes: "",
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

    const handleCloseConfirm = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        } else {
            setOpenConfirm(false);
        }
    }

    const handleClickEnviarFormulario = () => {
        setCarregando(true);
        setFocusError('')

        if (!error) {
            const url = `${process.env.REACT_APP_API_URL}/contrato`
            const token = localStorage.getItem('access_token');
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
                        return res.json()
                            .then(data => {
                                navigate(`../contrato/${data.data.id}`, { replace: true });
                                window.scrollTo(0, 0);
                            });
                    } else if (res.status === 422) {
                        handleCloseConfirm();
                        setCarregando(false);
                        setOpenErro({ status: res.status, open: true });
                        return res.json()
                            .then(data => setErrors(data.errors));
                    } else {
                        handleCloseConfirm();
                        setCarregando(false);
                        setOpenErro({ ...openErro, open: true });
                    }
                });
        }
    }

    useEffect(() => {
        if(focusError === "") return
        document.querySelector(`input[name=${focusError}]`)?.scrollIntoView({behavior: 'smooth', block: 'center'})
    },[focusError])

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
                maxWidth: '80rem' 
            }}
        >
            <Box component={Paper} elevation={5}>
                <HeaderFormulario>
                    Novo contrato
                </HeaderFormulario>
                
                <FormNovoContrato 
                    formContrato={novoContrato} 
                    setFormContrato={setNovoContrato} 
                    error={error}
                    setError={setError} 
                    setOpenConfirm={setOpenConfirm}
                    setOpenConfirmSair={setOpenConfirmSair}
                    errors={errors}
                    setErrors={setErrors}
                />

                <DialogConfirm 
                    openConfirm={openConfirm}
                    handleCloseConfirm={handleCloseConfirm}
                    handleClickEnviarFormulario={handleClickEnviarFormulario}
                    acao="enviar"
                    carregando={carregando}
                />

                <DialogConfirmSair 
                    openConfirmSair={openConfirmSair}
                    setOpenConfirmSair={setOpenConfirmSair}
                    acao="enviar"
                />

                <DialogErroEnvio 
                    openErro={openErro}
                    setOpenErro={setOpenErro}
                    errors={errors}
                    setFocusError={setFocusError}
                    acao="enviar"
                />
            </Box>
        </Box>
    );
}

export default NovoContrato;