import React, { useState } from 'react';
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
    FormHelperText
} from '@mui/material';
import CampoCpfCnpj from '../../CampoCpfCnpj';
import CampoValores from '../../CampoValores';
import CampoData from '../../CampoData';
import CampoTelefone from '../../CampoTelefone';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import * as EmailValidator from 'email-validator';
import '../../NovoContrato/FormNovoContrato/estilo.css';

const FormEditarContrato = (props) => {
    const { 
        formContrato, 
        setFormContrato, 
        error, 
        setError, 
        setOpenConfirm, 
        setOpenConfirmSair,
        tipoContratacoes
    } = props;

    const [contratoEditado, setContratoEditado] = useState(formContrato);
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

    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
        setFormContrato(contratoEditado);
    }

    const handleClickOpenConfirmSair = () => {
        setOpenConfirmSair(true);
    }

    const handleInputChange = (event) => {
        setContratoEditado({
            ...contratoEditado,
            [event.target.name]: event.target.value
        });
    }

    const handleChangeTipoContrato = (event) => {
        tipoContratacoes.map((tipoContratacao, index) => {
            if (tipoContratacao.id === event.target.value) {
                setContratoEditado({
                    ...contratoEditado,
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
                        value={contratoEditado.tipo_contratacao_id === undefined || contratoEditado.tipo_contratacao_id === null ? "" : contratoEditado.tipo_contratacao_id}
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
                </FormControl>

                <TextField
                    variant="outlined"
                    value={contratoEditado.processo_sei}
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
                    value={contratoEditado.dotacao_orcamentaria}
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
                    value={contratoEditado.credor}
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
                    formContrato={contratoEditado}
                    setFormContrato={setContratoEditado}
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
                        value={contratoEditado.tipo_objeto}
                        name="tipo_objeto"
                        onChange={handleInputChange}
                        error={errosContrato.tipo_contratacao.error}
                        onBlur={checaErros}
                        fullWidth
                    >
                        <MenuItem value={""}>---</MenuItem>
                        <MenuItem value={"obra"}>Obra</MenuItem>
                        <MenuItem value={"projeto"}>Projeto</MenuItem>
                        <MenuItem value={"serviço"}>Serviço</MenuItem>
                        <MenuItem value={"aquisição"}>Aquisição</MenuItem>
                    </Select>
                    <FormHelperText>{errosContrato.tipo_objeto.helperText}</FormHelperText>
                </FormControl>

                <TextField
                    variant="outlined"
                    value={contratoEditado.objeto}
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
                    value={contratoEditado.numero_contrato}
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
                    value={contratoEditado.data_assinatura}
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
                    value={contratoEditado.valor_contrato}
                    state={contratoEditado}
                    setState={setContratoEditado}
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
                    value={contratoEditado.valor_mensal_estimativo}
                    state={contratoEditado}
                    setState={setContratoEditado}
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
                    value={contratoEditado.data_inicio_vigencia}
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
                    value={contratoEditado.data_vencimento}
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
                    value={contratoEditado.condicao_pagamento}
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
                    value={contratoEditado.prazo_a_partir_de}
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
                    value={contratoEditado.data_prazo_maximo}
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
                    value={contratoEditado.nome_empresa}
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
                    formContrato={contratoEditado}
                    setFormContrato={setContratoEditado}
                    onBlur={checaErros}
                    helperText={errosContrato.telefone_empresa.helperText}
                    error={errosContrato.telefone_empresa.error}
                    name="telefone_empresa"
                />

                <TextField
                    variant="outlined"
                    className="form__campo"
                    label="E-mail da empresa"
                    value={contratoEditado.email_empresa}
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
                    value={
                        contratoEditado.outras_informacoes !== null 
                        ? contratoEditado.outras_informacoes
                        : ""
                    }
                    name="outras_informacoes"
                    onChange={handleInputChange}
                    helperText=" "
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Envio material técnico"
                    value={contratoEditado.envio_material_tecnico}
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
                    value={contratoEditado.minuta_edital}
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
                    value={contratoEditado.abertura_certame}
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
                    value={contratoEditado.homologacao}
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
                    value={contratoEditado.fonte_recurso}
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

export default FormEditarContrato;