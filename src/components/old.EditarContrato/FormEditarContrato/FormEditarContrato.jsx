//import React, { useState, useRef } from 'react';
//import { 
//    Box, 
//    Button,
//} from '@mui/material';
//import BoxDadosContrato from '../../BoxDadosContrato';
//import BoxContatoEmpresa from '../../BoxContatoEmpresa';
//import BoxOutrasInformacoes from '../../BoxOutrasInformacoes';
//import CheckIcon from '@mui/icons-material/Check';
//import CloseIcon from '@mui/icons-material/Close';
//import * as EmailValidator from 'email-validator';
//import '../../FormNovoContrato/estilo.css';
//
//const FormEditarContrato = (props) => {
//    const { 
//        formContrato, 
//        setFormContrato, 
//        error, 
//        setError, 
//        setOpenConfirm, 
//        setOpenConfirmSair,
//        errors,
//        setErrors
//    } = props;
//
//    const processo_sei = useRef(formContrato.processo_sei);
//    const credor = useRef(formContrato.credor);
//    const [tipo_objeto, setTipo_objeto] = useState(formContrato.tipo_objeto);
//    const objeto = useRef(formContrato.objeto);
//    const numero_contrato = useRef(formContrato.numero_contrato);
//    const condicao_pagamento = useRef(formContrato.condicao_pagamento);
//    const prazo_a_partir_de = useRef(formContrato.prazo_a_partir_de);
//    const numero_nota_reserva = useRef(formContrato.numero_nota_reserva);
//    const nome_empresa = useRef(formContrato.nome_empresa);
//    const email_empresa = useRef(formContrato.email_empresa);
//    const outras_informacoes = useRef(formContrato.outras_informacoes);
//    
//    const handleClickOpenConfirm = () => {
//        setOpenConfirm(true);
//    }
//
//    const handleClickOpenConfirmSair = () => {
//        setOpenConfirmSair(true);
//    }
//
//    const handleChange = (event, form, setForm) => {
//        setForm({
//            ...form,
//            [event.target.name]: event.target.value
//        });
//    }
//
//    const checaErrosEmail = (event) => {
//        if (EmailValidator.validate(event.target.value) === true) {
//            const errorsTemp = {...errors};
//            delete errorsTemp.email_empresa;
//            setErrors(errorsTemp);
//            setError(false);
//        } else {
//            setErrors({
//                ...errors,
//                email_empresa: "Insira um e-mail válido"
//            });
//            setError(true);
//        }
//    }
//
//    const salvaFormulario = () => {
//        setFormContrato({
//            ...formContrato,
//            processo_sei: processo_sei.current.value,
//            credor: credor.current.value,
//            tipo_objeto: tipo_objeto,
//            objeto: objeto.current.value,
//            numero_contrato: numero_contrato.current.value,
//            condicao_pagamento: condicao_pagamento.current.value,
//            prazo_a_partir_de: prazo_a_partir_de.current.value,
//            numero_nota_reserva: numero_nota_reserva.current.value,
//            nome_empresa: nome_empresa.current.value,
//            email_empresa: email_empresa.current.value,
//            outras_informacoes: outras_informacoes.current.value
//        });
//    }
//
//    return (
//        <Box className="form">
//            <Box className="form_formulario" component="form">
//                <BoxDadosContrato 
//                    errors={errors}
//                    setErrors={setErrors}
//                    error={error}
//                    setError={setError}
//                    formContrato={formContrato}
//                    setFormContrato={setFormContrato}
//                    handleChange={handleChange}
//                    processo_sei={processo_sei}
//                    credor={credor}
//                    tipo_objeto={tipo_objeto}
//                    setTipo_objeto={setTipo_objeto}
//                    objeto={objeto}
//                    numero_contrato={numero_contrato}
//                    condicao_pagamento={condicao_pagamento}
//                    prazo_a_partir_de={prazo_a_partir_de}
//                    numero_nota_reserva={numero_nota_reserva}
//                />
//               
//                <BoxContatoEmpresa 
//                    errors={errors}
//                    formContrato={formContrato}
//                    setFormContrato={setFormContrato}
//                    nome_empresa={nome_empresa}
//                    email_empresa={email_empresa}
//                    checaErrosEmail={checaErrosEmail}
//                />
//                
//                <BoxOutrasInformacoes 
//                    errors={errors}
//                    outras_informacoes={outras_informacoes}
//                    formContrato={formContrato}
//                />
//            </Box>
//
//            <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '2rem 0', mt: '0' }}>
//                <Button 
//                    sx={{ textTransform: 'none', mr: '2rem', color: (theme) => theme.palette.error.main }} 
//                    onClick={handleClickOpenConfirmSair}
//                >
//                    <CloseIcon fontSize="small" sx={{ mr: '0.5rem' }} /> Cancelar e voltar
//                </Button>
//                <Button 
//                    variant="contained" 
//                    sx={{ color: (theme) => theme.palette.color.main, textTransform: 'none' }} 
//                    disabled={error}
//                    onMouseDown={salvaFormulario}
//                    onMouseUp={handleClickOpenConfirm}
//                >
//                    <CheckIcon fontSize="small" sx={{ mr: '0.5rem' }} /> Salvar
//                </Button>
//            </Box>
//        </Box> 
//    );
//}
//
//export default FormEditarContrato;