import React, { useEffect, useState } from 'react';
import { 
    TextField, 
    Typography, 
    Box, 
    Divider, 
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CircularProgress
} from '@mui/material';
import CampoCpfCnpj from '../../CampoCpfCnpj';
import CampoValores from '../../CampoValores';
import CampoData from '../../CampoData';
import CampoTelefone from '../../CampoTelefone';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import * as EmailValidator from 'email-validator';
import './estilo.css';

const FormNovoContrato = ({ formContrato, setFormContrato, error, setError, setOpenConfirm, setOpenConfirmSair }) => {
    const [errosContrato, setErrosContrato] = useState({
        tipo_contratacao: {
            error: false,
            helperText: " ",
        },
        processo_sei: {
            error: false,
            helperText: " ",
        },
        dotacao_orcamentaria: {
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
        tipo_objeto: {
            error: false,
            helperText: " ",
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
        valor_mensal_estimativo: {
            error: false,
            helperText: " "
        },
        data_inicio_vigencia: {
            error: false,
            helperText: " ",
        },
        data_vencimento: {
            error: false,
            helperText: " ",
        },
        condicao_pagamento: {
            error: false,
            helperText: "Ex: Em até 30 dias após o adimplemento.",
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
        },
        envio_material_tecnico: {
            error: false,
            helperText: " "
        },
        minuta_edital: {
            error: false,
            helperText: " "
        },
        abertura_certame: {
            error: false,
            helperText: " "
        },
        homologacao: {
            error: false,
            helperText: " "
        },
        fonte_recurso: {
            error: false,
            helperText: " "
        }
    });
    const [tipoContratacoes, setTipoContratacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    
    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/tipocontratacoes`;
        const token = sessionStorage.getItem('access_token');
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
                setCarregando(false);
                setTipoContratacoes(data.data); 
            });
    }, [])

    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    }

    const handleClickOpenConfirmSair = () => {
        setOpenConfirmSair(true);
    }

    const handleInputChange = (event) => {
        setFormContrato({
            ...formContrato,
            [event.target.name]: event.target.value
        });
    }

    const handleChangeTipoContrato = (event) => {
        tipoContratacoes.map((tipoContratacao, index) => {
            if (tipoContratacao.id === event.target.value) {
                setFormContrato({
                    ...formContrato,
                    tipo_contratacao_id: event.target.value,
                    tipo_contratacao: tipoContratacoes[index].nome
                });
            }
        });

    }

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
        }
    }

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
        }
    }

    const checaErroRequired = () => {
        const form = document.querySelector(".form_formulario").elements;
        const inputArr = [];
        for (let i = 0; i < form.length; i++) {
            if (form[i].tagName === 'INPUT') {
                inputArr.push(form[i]);
            }
        }

        let formErrosTemp = {};

        inputArr.forEach((input) => {
            if (input.required && input.value === "") {
                formErrosTemp = {
                    ...formErrosTemp,
                    [input.name]: {
                        error: true,
                        helperText: "Campo obrigatório"
                    }
                }

                setError(true);
            } else {
                formErrosTemp = {
                    ...formErrosTemp,
                    [input.name]: {
                        error: false,
                        helperText: " "
                    }
                };
            }
        });
        
        setErrosContrato(formErrosTemp);
    }

    return (
        <Box className="form">
            <Box className="form_formulario" component="form">
                <Divider sx={{ mt: '1.5rem', mb: '1.25rem' }} textAlign="left"> 
                    <Typography variant="h5" sx={{ fontWeight: 'light' }}>Dados do contrato</Typography> 
                </Divider>

                <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                    <InputLabel id="tipo_contratacao-label">Tipo de contratação</InputLabel>
                    <Select
                        labelId="tipo_contratacao-label"
                        id="tipo_contratacao"
                        label="Tipo de contratação"
                        value={formContrato.tipo_contratacao_id === undefined ? "" : formContrato.tipo_contratacao_id}
                        name="tipo_contratacao"
                        onChange={handleChangeTipoContrato}
                        disabled={tipoContratacoes.length === 0}
                        error={errosContrato.tipo_contratacao.error}
                        onBlur={checaErros}
                        fullWidth
                    >
                        <MenuItem value={""}>---</MenuItem>
                        {tipoContratacoes.map((tipoContratacao, index) => {
                            return (
                                <MenuItem key={index} value={tipoContratacao.id}>{tipoContratacao.nome}</MenuItem>
                            );
                        })}
                    </Select>
                    <FormHelperText>{errosContrato.tipo_contratacao.helperText}</FormHelperText>

                    {carregando === true
                        ? 
                        <CircularProgress 
                            size={20} 
                            sx={{ 
                                margin: '1rem',
                                position: 'absolute',
                                left: '50%',
                                top: '3%'
                            }} 
                        />
                        : ""
                    }
                </FormControl>

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
                    value={formContrato.dotacao_orcamentaria}
                    name="dotacao_orcamentaria"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Dotação orçamentária"
                    helperText={errosContrato.dotacao_orcamentaria.helperText}
                    error={errosContrato.dotacao_orcamentaria.error}
                    onBlur={checaErros}
                    sx={{ margin: '1rem 0' }}
                    required
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

                <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                    <InputLabel id="tipo_objeto-label">Tipo de objeto</InputLabel>
                    <Select
                        labelId="tipo_objeto-label"
                        id="tipo_objeto"
                        label="Tipo de objeto"
                        value={formContrato.tipo_objeto}
                        name="tipo_objeto"
                        onChange={handleInputChange}
                        error={errosContrato.tipo_contratacao.error}
                        onBlur={checaErros}
                        fullWidth
                    >
                        <MenuItem value={""}>---</MenuItem>
                        <MenuItem value={"Obra"}>Obra</MenuItem>
                        <MenuItem value={"Projeto"}>Projeto</MenuItem>
                        <MenuItem value={"Serviço"}>Serviço</MenuItem>
                        <MenuItem value={"Aquisição"}>Aquisição</MenuItem>
                    </Select>
                    <FormHelperText>{errosContrato.tipo_objeto.helperText}</FormHelperText>
                </FormControl>

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

                <CampoValores
                    index=""
                    className="form__campo"
                    label="Valor mensal estimativo"
                    value={formContrato.valor_mensal_estimativo}
                    state={formContrato}
                    setState={setFormContrato}
                    name="valor_mensal_estimativo"
                    onChange={(e) => { handleInputChange(e); }}
                    checaErros={checaErros}
                    helperText={errosContrato.valor_mensal_estimativo.helperText}
                    error={errosContrato.valor_mensal_estimativo.error}
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
                    label="Data de vencimento"
                    value={formContrato.data_vencimento}
                    name="data_vencimento"
                    onChange={handleInputChange}
                    helperText={errosContrato.data_vencimento.helperText}
                    error={errosContrato.data_vencimento.error}
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

                <CampoData
                    className="form__campo"
                    label="Envio material técnico"
                    value={formContrato.envio_material_tecnico}
                    name="envio_material_tecnico"
                    onChange={handleInputChange}
                    helperText={errosContrato.envio_material_tecnico.helperText}
                    error={errosContrato.envio_material_tecnico.error}
                    onBlur={checaErros}
                    margin="1rem 0"
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Minuta edital"
                    value={formContrato.minuta_edital}
                    name="minuta_edital"
                    onChange={handleInputChange}
                    helperText={errosContrato.minuta_edital.helperText}
                    error={errosContrato.minuta_edital.error}
                    onBlur={checaErros}
                    margin="1rem 0"
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Abertura certame"
                    value={formContrato.abertura_certame}
                    name="abertura_certame"
                    onChange={handleInputChange}
                    helperText={errosContrato.abertura_certame.helperText}
                    error={errosContrato.abertura_certame.error}
                    onBlur={checaErros}
                    margin="1rem 0"
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Homolagação"
                    value={formContrato.homologacao}
                    name="homologacao"
                    onChange={handleInputChange}
                    helperText={errosContrato.homologacao.helperText}
                    error={errosContrato.homologacao.error}
                    onBlur={checaErros}
                    margin="1rem 0"
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    className="form__campo"
                    label="Fonte de recurso"
                    value={formContrato.fonte_recurso}
                    name="fonte_recurso"
                    onChange={handleInputChange}
                    onBlur={checaErros}
                    helperText={errosContrato.fonte_recurso.helperText}
                    error={errosContrato.fonte_recurso.error}
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
}

export default FormNovoContrato;