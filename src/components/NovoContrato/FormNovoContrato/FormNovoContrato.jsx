import React, { useEffect, useState, useRef } from 'react';
import { 
    Box, 
    Button,
} from '@mui/material';
import BoxProcessoContratacao from './BoxProcessoContratacao';
import BoxDadosContrato from './BoxDadosContrato';
import BoxContatoEmpresa from './BoxContatoEmpresa';
import BoxOutrasInformacoes from './BoxOutrasInformacoes';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import * as EmailValidator from 'email-validator';
import './estilo.css';

const FormNovoContrato = (props) => {
    const {
        formContrato, 
        setFormContrato, 
        error, 
        setError, 
        setOpenConfirm, 
        setOpenConfirmSair, 
        errors, 
        setErrors
    } = props;

    const [modelosLicitacao, setModelosLicitacao] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [processoContratacao, setProcessoContratacao] = useState({
        licitacao_modelo_id: formContrato.licitacao_modelo_id,
        licitacao_modelo: formContrato.licitacao_modelo,
        envio_material_tecnico: formContrato.envio_material_tecnico,
        minuta_edital: formContrato.minuta_edital,
        abertura_certame: formContrato.abertura_certame,
        homologacao: formContrato.homologacao
    });
    const processo_sei = useRef(formContrato.processo_sei);
    const dotacao_orcamentaria = useRef(formContrato.dotacao_orcamentaria);
    const credor = useRef(formContrato.credor);
    const [tipo_objeto, setTipo_objeto] = useState("");
    const objeto = useRef(formContrato.objeto);
    const numero_contrato = useRef(formContrato.numero_contrato);
    const condicao_pagamento = useRef(formContrato.condicao_pagamento);
    const prazo_a_partir_de = useRef(formContrato.prazo_a_partir_de);
    const numero_nota_reserva = useRef(formContrato.numero_nota_reserva);
    const nome_empresa = useRef(formContrato.nome_empresa);
    const email_empresa = useRef(formContrato.email_empresa);
    const outras_informacoes = useRef(formContrato.outras_informacoes);
    
    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/licitacaomodelos`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        setErrors({});

        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                setCarregando(false);
                setModelosLicitacao(data.data);
            });
    }, [setErrors])

    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    }

    const handleClickOpenConfirmSair = () => {
        setOpenConfirmSair(true);
    }

    const handleChange = (event, form, setForm) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    const handleChangeModeloLicitacao = (event, form, setForm) => {
        modelosLicitacao.forEach((modeloLicitacao, index) => {
            if (modeloLicitacao.id === event.target.value) {
                setForm({
                    ...form,
                    licitacao_modelo_id: event.target.value,
                    licitacao_modelo: modelosLicitacao[index].nome
                });
            }
        });
    }

    const checaErrosEmail = (event) => {
        if (EmailValidator.validate(event.target.value) === true) {
            const errorsTemp = {...errors};
            delete errorsTemp.email_empresa;
            setErrors(errorsTemp);
            setError(false);
        } else {
            setErrors({
                ...errors,
                email_empresa: "Insira um e-mail válido"
            });
            setError(true);
        }
    }

    const retornaValue = (ref) => {
        return ref.current.childNodes[1].firstChild.value;
    }
    
    const salvaFormulario = () => {
        setFormContrato({
            ...formContrato,
            ...processoContratacao,
            processo_sei: retornaValue(processo_sei),
            dotacao_orcamentaria: retornaValue(dotacao_orcamentaria),
            credor: retornaValue(credor),
            tipo_objeto: tipo_objeto,
            objeto: retornaValue(objeto),
            numero_contrato: retornaValue(numero_contrato),
            condicao_pagamento: retornaValue(condicao_pagamento),
            prazo_a_partir_de: retornaValue(prazo_a_partir_de),
            numero_nota_reserva: retornaValue(numero_nota_reserva),
            nome_empresa: retornaValue(nome_empresa),
            email_empresa: retornaValue(email_empresa),
            outras_informacoes: retornaValue(outras_informacoes)
        });
    }

    return (
        <Box className="form">
            <Box className="form_formulario" component="form">
                <BoxProcessoContratacao 
                    errors={errors}
                    processoContratacao={processoContratacao}
                    setProcessoContratacao={setProcessoContratacao}
                    handleChangeModeloLicitacao={handleChangeModeloLicitacao}
                    modelosLicitacao={modelosLicitacao}
                    carregando={carregando}
                    handleChange={handleChange}
                />
                
                <BoxDadosContrato 
                    errors={errors}
                    setErrors={setErrors}
                    error={error}
                    setError={setError}
                    formContrato={formContrato}
                    setFormContrato={setFormContrato}
                    handleChange={handleChange}
                    processo_sei={processo_sei}
                    dotacao_orcamentaria={dotacao_orcamentaria}
                    credor={credor}
                    tipo_objeto={tipo_objeto}
                    setTipo_objeto={setTipo_objeto}
                    objeto={objeto}
                    numero_contrato={numero_contrato}
                    condicao_pagamento={condicao_pagamento}
                    prazo_a_partir_de={prazo_a_partir_de}
                    numero_nota_reserva={numero_nota_reserva}
                />
               
                <BoxContatoEmpresa 
                    errors={errors}
                    formContrato={formContrato}
                    setFormContrato={setFormContrato}
                    nome_empresa={nome_empresa}
                    email_empresa={email_empresa}
                    checaErrosEmail={checaErrosEmail}
                />
                
                <BoxOutrasInformacoes 
                    errors={errors}
                    outras_informacoes={outras_informacoes}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '2rem 0', mt: '0' }}>
                <Button 
                    sx={{ textTransform: 'none', mr: '2rem', color: (theme) => theme.palette.error.main }} 
                    onClick={handleClickOpenConfirmSair}
                >
                    <CloseIcon fontSize="small" sx={{ mr: '0.5rem' }} /> Cancelar e voltar
                </Button>
                <Button 
                    variant="contained" 
                    sx={{ color: (theme) => theme.palette.color.main, textTransform: 'none' }} 
                    disabled={error}
                    onMouseDown={salvaFormulario}
                    onMouseUp={handleClickOpenConfirm}
                >
                    <CheckIcon fontSize="small" sx={{ mr: '0.5rem' }} /> Salvar
                </Button>
            </Box>
        </Box>
    );
}

export default FormNovoContrato;