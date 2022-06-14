import React, { useState } from 'react';
import { TextField, Typography, Box, Divider, Button } from '@mui/material';
import CampoCpfCnpj from '../../CampoCpfCnpj';
import CampoValores from '../../CampoValores';
import CampoData from '../../CampoData';
import CampoTelefone from '../../CampoTelefone';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import * as EmailValidator from 'email-validator';
import './estilo.css';

const FormNovoContrato = ({ formContrato, setFormContrato, error, setError, setOpenConfirm, setOpenConfirmSair }) => {
    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleClickOpenConfirmSair = () => {
        setOpenConfirmSair(true);
    };

    const [errosContrato, setErrosContrato] = useState({
        processo_sei: {
            error: false,
            helperText: " ",
        },
        credor: {
            error: false,
            helperText: " ",
        },
        cnpj_cpf: {
            error: false,
            helperText: "Somente números",
        },
        objeto: {
            error: false,
            helperText: " ",
        },
        numero_contrato: {
            error: false,
            helperText: " ",
        },
        data_assinatura: {
            error: false,
            helperText: " ",
        },
        valor_contrato: {
            error: false,
            helperText: " ",
        },
        data_inicio_vigencia: {
            error: false,
            helperText: " ",
        },
        data_fim_vigencia: {
            error: false,
            helperText: " ",
        },
        condicao_pagamento: {
            error: false,
            helperText: "Ex: Em até 30 dias após o adimplemento.",
        },
        prazo_contrato_meses: {
            error: false,
            helperText: "Valor em meses. Ex: 5, 6, 12, etc.",
        },
        prazo_a_partir_de: {
            error: false,
            helperText: "Ex: A contar da ordem de início; A partir da assinatura; A partir da ordem de fornecimento...",
        },
        data_prazo_maximo: {
            error: false,
            helperText: " ",
        },
        nome_empresa: {
            error: false,
            helperText: " ",
        },
        telefone_empresa: {
            error: false,
            helperText: " ",
        },
        email_empresa: {
            error: false,
            helperText: " ",
        },
        outras_informacoes: {
            error: false,
            helperText: " "
        }
    });
    
    const handleInputChange = (event) => {
        setFormContrato({
            ...formContrato,
            [event.target.name]: event.target.value
        });
    };

    const checaErros = (event) => {
        if (event.target.required && event.target.value === "") {
            setErrosContrato({
                ...errosContrato,
                [event.target.name]: {
                    error: true,
                    helperText: "Campo obrigatório"
                }
            });
            setError(true);
        } else {
            setErrosContrato({
                ...errosContrato,
                [event.target.name]: {
                    error: false,
                    helperText: " "
                }
            });
            setError(false);
        };
    };

    const checaErrosEmail = (event) => {
        if (EmailValidator.validate(event.target.value) === true) {
            setErrosContrato({
                ...errosContrato,
                [event.target.name]: {
                    error: false,
                    helperText: " "
                }
            });
            setError(false);
        } else {
            setErrosContrato({
                ...errosContrato,
                [event.target.name]: {
                    error: true,
                    helperText: "Insira um e-mail válido"
                }
            });
            setError(true);
        };
    };

    const checaErroRequired = () => {
        const form = document.querySelector(".form_formulario").elements;
        const inputArr = [];
        for (let i = 0; i < form.length; i++) {
            if (form[i].tagName === 'INPUT') {
                inputArr.push(form[i]);
            };
        };

        let formErrosTemp = {};

        inputArr.forEach((input) => {
            if (input.required && input.value === "") {
                formErrosTemp = {
                    ...formErrosTemp,
                    [input.name]: {
                        error: true,
                        helperText: "Campo obrigatório"
                    }
                };

                setError(true);
            } else {
                formErrosTemp = {
                    ...formErrosTemp,
                    [input.name]: {
                        error: false,
                        helperText: " "
                    }
                };
            };
        });
        
        setErrosContrato(formErrosTemp);
    };

    return (
        <Box className="form">
            <Box className="form_formulario" component="form">
                <Divider sx={{ mt: '1.5rem', mb: '1.25rem' }} textAlign="left"> 
                    <Typography variant="h5" sx={{ fontWeight: 'light' }}>Dados do contrato</Typography> 
                </Divider>

                <TextField
                    variant="outlined"
                    value={formContrato.processo_sei}
                    name="processo_sei"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Processo SEI"
                    helperText={errosContrato.processo_sei.helperText}
                    error={errosContrato.processo_sei.error}
                    onBlur={checaErros}
                    required
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={formContrato.credor}
                    name="credor"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Credor"
                    helperText={errosContrato.credor.helperText}
                    error={errosContrato.credor.error}
                    onBlur={checaErros}
                    required
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <CampoCpfCnpj
                    className="form__campo"
                    formContrato={formContrato}
                    setFormContrato={setFormContrato}
                    error={errosContrato.cnpj_cpf.error}
                    setError={setError}
                    errosContrato={errosContrato}
                    setErrosContrato={setErrosContrato}
                    checaErros={checaErros}
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={formContrato.objeto}
                    name="objeto"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Objeto"
                    helperText={errosContrato.objeto.helperText}
                    error={errosContrato.objeto.error}
                    onBlur={checaErros}
                    required
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={formContrato.numero_contrato}
                    name="numero_contrato"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Nº Contrato / Nota de Empenho Inicial"
                    helperText={errosContrato.numero_contrato.helperText}
                    error={errosContrato.numero_contrato.error}
                    onBlur={checaErros}
                    required
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Data de assinatura"
                    value={formContrato.data_assinatura}
                    name="data_assinatura"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    helperText={errosContrato.data_assinatura.helperText}
                    error={errosContrato.data_assinatura.error}
                    onBlur={checaErros}
                    fullWidth
                />

                <CampoValores
                    index=""
                    className="form__campo"
                    label="Valor"
                    value={formContrato.valor_contrato}
                    state={formContrato}
                    setState={setFormContrato}
                    name="valor_contrato"
                    onChange={(e) => { handleInputChange(e); }}
                    checaErros={checaErros}
                    helperText={errosContrato.valor_contrato.helperText}
                    error={errosContrato.valor_contrato.error}
                    required
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Início da Vigência"
                    value={formContrato.data_inicio_vigencia}
                    name="data_inicio_vigencia"
                    onChange={handleInputChange}
                    helperText={errosContrato.data_inicio_vigencia.helperText}
                    error={errosContrato.data_inicio_vigencia.error}
                    onBlur={checaErros}
                    margin="1rem 0"
                    required
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Fim da Vigência"
                    value={formContrato.data_fim_vigencia}
                    name="data_fim_vigencia"
                    onChange={handleInputChange}
                    helperText={errosContrato.data_fim_vigencia.helperText}
                    error={errosContrato.data_fim_vigencia.error}
                    onBlur={checaErros}
                    margin="1rem 0"
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={formContrato.condicao_pagamento}
                    name="condicao_pagamento"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Condição de Pagamento"
                    helperText={errosContrato.condicao_pagamento.helperText}
                    error={errosContrato.condicao_pagamento.error}
                    onBlur={checaErros}
                    required
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={formContrato.prazo_contrato_meses.replace(/[^\d]+/g,'')}
                    name="prazo_contrato_meses"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Prazo em meses"
                    helperText={errosContrato.prazo_contrato_meses.helperText}
                    error={errosContrato.prazo_contrato_meses.error}
                    onBlur={checaErros}
                    required
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={formContrato.prazo_a_partir_de}
                    name="prazo_a_partir_de"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Prazo a partir de"
                    helperText={errosContrato.prazo_a_partir_de.helperText}
                    error={errosContrato.prazo_a_partir_de.error}
                    onBlur={checaErros}
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Prazo Máximo Prorrogável"
                    value={formContrato.data_prazo_maximo}
                    name="data_prazo_maximo"
                    onChange={handleInputChange}
                    helperText={errosContrato.data_prazo_maximo.helperText}
                    error={errosContrato.data_prazo_maximo.error}
                    onBlur={checaErros}
                    margin="1rem 0"
                    required
                    fullWidth
                />

                <Divider sx={{ mb: '1.25rem' }} textAlign="left"> 
                    <Typography variant="h5" sx={{ fontWeight: 'light' }}>Contato da empresa</Typography> 
                </Divider>

                <TextField
                    variant="outlined"
                    className="form__campo"
                    label="Nome da empresa"
                    value={formContrato.nome_empresa}
                    name="nome_empresa"
                    onChange={handleInputChange}
                    onBlur={checaErros}
                    helperText={errosContrato.nome_empresa.helperText}
                    error={errosContrato.nome_empresa.error}
                    required
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <CampoTelefone 
                    className="contrato-empresa__campo"
                    formContrato={formContrato}
                    setFormContrato={setFormContrato}
                    onBlur={checaErros}
                    helperText={errosContrato.telefone_empresa.helperText}
                    error={errosContrato.telefone_empresa.error}
                    name="telefone_empresa"
                />

                <TextField
                    variant="outlined"
                    className="form__campo"
                    label="E-mail da empresa"
                    value={formContrato.email_empresa}
                    name="email_empresa"
                    onChange={handleInputChange}
                    onBlur={(e) => { e.target.value === "" ? checaErros(e) : checaErrosEmail(e) }}
                    helperText={errosContrato.email_empresa.helperText}
                    error={errosContrato.email_empresa.error}
                    type="email"
                    required
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <Divider sx={{ mb: '1.25rem' }} textAlign="left"> 
                    <Typography variant="h5" sx={{ fontWeight: 'light' }}>
                        Outras informações
                    </Typography> 
                </Divider>

                <TextField
                    variant="outlined"
                    multiline
                    minRows={6}
                    className="form__campo"
                    label="Informações adicionais"
                    value={formContrato.outras_informacoes}
                    name="outras_informacoes"
                    onChange={handleInputChange}
                    helperText=" "
                    sx={{ margin: '1rem 0' }}
                    fullWidth
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
                    onMouseDown={checaErroRequired}
                    onMouseUp={handleClickOpenConfirm} 
                >
                    <CheckIcon fontSize="small" sx={{ mr: '0.5rem' }} /> Salvar
                </Button>
            </Box>
        </Box>
    );
};

export default FormNovoContrato;