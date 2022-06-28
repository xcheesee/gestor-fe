import React, { useEffect, useState } from 'react';
import { 
    Paper, 
    Box, 
    Fade
} from '@mui/material';
import HeaderFormulario from '../HeaderFormulario';
import FormEditarContrato from './FormEditarContrato';
import DialogConfirm from '../DialogConfirm';
import DialogConfirmSair from '../DialogConfirmSair';
import DialogErroEnvio from '../DialogErroEnvio';
import { useParams, useNavigate } from 'react-router-dom';

const EditarContrato = ({ setSnackbar }) => {
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState({});
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openConfirmSair, setOpenConfirmSair] = useState(false);
    const [openErro, setOpenErro] = useState({
        status: '',
        open: false
    });
    const [carregando, setCarregando] = useState(false);
    const [contrato, setContrato] = useState({
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
    const [tipoContratacoes, setTipoContratacoes] = useState([]);
    const { numContrato } = useParams();
    
    const navigate = useNavigate();

    useEffect(() => {
        const urlContrato = `${process.env.REACT_APP_API_URL}/contrato/${numContrato}`;
        const urlTiposContratacoes = `${process.env.REACT_APP_API_URL}/tipocontratacoes`
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(urlContrato, options)
            .then(res => {
                if (res.status === 404) {
                    navigate('../404', { replace: true });
                } else {
                    return res.json();
                }
            })
            .then(data => {
                setContrato(data.data);
            })

        fetch(urlTiposContratacoes, options)
            .then(res => res.json())
            .then(data => {
                setTipoContratacoes(data.data); 
            });
    }, [])

    const handleCloseConfirm = (e, reason) => {
        if (reason === 'backdropClick') {
            return;
        } else {
            setOpenConfirm(false);
        }
    }

    const handleClickEnviarFormulario = () => {
        setCarregando(true);

        if (!error) {
            const url = `${process.env.REACT_APP_API_URL}/contrato/${numContrato}`;
            const token = localStorage.getItem('access_token');
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(contrato)
            };

            fetch(url, options)
                .then(res => {
                    if (res.ok) {
                        setCarregando(false);
                        handleCloseConfirm();
                        setSnackbar({
                            open: true,
                            severity: 'success',
                            text: 'Contrato editado com sucesso!',
                            color: 'success'
                        });
                        return res.json()
                            .then(data => {
                                navigate(`../contrato/${numContrato}`, { replace: true });
                                window.scrollTo(0, 0);
                            });
                    } else if (res.status === 422) {
                        handleCloseConfirm();
                        setCarregando(false);
                        setOpenErro({ status: res.status, open: true });
                        setSnackbar({
                            open: false,
                            severity: 'error',
                            text: 'Não foi possível editar o contrato',
                            color: 'error'
                        });
                        return res.json()
                            .then(data => setErrors(data.errors));
                    } else {
                        handleCloseConfirm();
                        setCarregando(false);
                        setOpenErro({ status: res.status, open: true });
                        setSnackbar({
                            open: false,
                            severity: 'error',
                            text: 'Não foi possível editar o contrato',
                            color: 'error'
                        });
                    }
                })
        }
    }

    const ConteudoPrincipal = () => {
        if (carregando) {
            return (
                <FormEditarContrato 
                    formContrato={contrato}
                    setFormContrato={setContrato}
                    error={error}
                    setError={setError}
                    setOpenConfirm={setOpenConfirm}
                    setOpenConfirmSair={setOpenConfirmSair}
                    carregando={carregando}
                    tipoContratacoes={tipoContratacoes}
                    setTipoContratacoes={setTipoContratacoes}
                    errors={errors}
                    setErrors={setErrors}
                />
            );
        } else {
            return (
                <FormEditarContrato 
                    formContrato={contrato}
                    setFormContrato={setContrato}
                    error={error}
                    setError={setError}
                    setOpenConfirm={setOpenConfirm}
                    setOpenConfirmSair={setOpenConfirmSair}
                    carregando={carregando}
                    tipoContratacoes={tipoContratacoes}
                    setTipoContratacoes={setTipoContratacoes}
                    errors={errors}
                    setErrors={setErrors}
                />
            );
        }
    }
    
    return (
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
                    {`Editar contrato # ${numContrato}`}
                </HeaderFormulario>
                
                <ConteudoPrincipal />

                <DialogConfirm 
                    openConfirm={openConfirm} 
                    handleCloseConfirm={handleCloseConfirm}
                    handleClickEnviarFormulario={handleClickEnviarFormulario}
                    acao="editar"
                    carregando={carregando}
                    numContrato={numContrato}
                />

                <DialogConfirmSair 
                    openConfirmSair={openConfirmSair}
                    setOpenConfirmSair={setOpenConfirmSair}
                    acao="editar"
                    numContrato={numContrato}
                />

                <DialogErroEnvio 
                    openErro={openErro}
                    setOpenErro={setOpenErro}
                    acao="editar"
                />
            </Box>
        </Box>
    );
}

export default EditarContrato;