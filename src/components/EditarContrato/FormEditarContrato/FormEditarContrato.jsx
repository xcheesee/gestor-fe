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
        tipoContratacoes,
        errors,
        setErrors
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

    return (
        <Box className="form">
            <Box className="form_formulario" component="form">
                <Divider sx={{ mt: '1.5rem', mb: '1.25rem' }} textAlign="left"> 
                    <Typography variant="h5" sx={{ fontWeight: 'light' }}>Dados do contrato</Typography> 
                </Divider>

                <FormControl 
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('tipo_contratacao')}    
                    fullWidth 
                >
                    <InputLabel id="tipo_contratacao-label">Tipo de contratação</InputLabel>
                    <Select
                        labelId="tipo_contratacao-label"
                        id="tipo_contratacao"
                        label="Tipo de contratação"
                        value={contratoEditado.tipo_contratacao_id === undefined || contratoEditado.tipo_contratacao_id === null ? "" : contratoEditado.tipo_contratacao_id}
                        name="tipo_contratacao"
                        onChange={handleChangeTipoContrato}
                        disabled={tipoContratacoes.length === 0}
                        fullWidth
                    >
                        <MenuItem value={""}>---</MenuItem>
                        {tipoContratacoes.map((tipoContratacao, index) => {
                            return (
                                <MenuItem key={index} value={tipoContratacao.id}>{tipoContratacao.nome}</MenuItem>
                            );
                        })}
                    </Select>
                    <FormHelperText>
                        {errors.hasOwnProperty('tipo_contratacao') ? errors.tipo_contratacao : " "}
                    </FormHelperText>
                </FormControl>

                <TextField
                    variant="outlined"
                    value={contratoEditado.processo_sei}
                    name="processo_sei"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Processo SEI"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('processo_sei')}
                    helperText={errors.hasOwnProperty('processo_sei') ? errors.processo_sei : " "}
                    required
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={contratoEditado.dotacao_orcamentaria}
                    name="dotacao_orcamentaria"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Dotação orçamentária"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('dotacao_orcamentaria')}
                    helperText={errors.hasOwnProperty('dotacao_orcamentaria') ? errors.dotacao_orcamentaria : " "}
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
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('credor')}
                    helperText={errors.hasOwnProperty('credor') ? errors.credor : " "}
                    required
                    fullWidth
                />

                <CampoCpfCnpj
                    className="form__campo"
                    formContrato={contratoEditado}
                    setFormContrato={setContratoEditado}
                    setError={setError}
                    error={errors.hasOwnProperty('cnpj_cpf')}
                    errors={errors}
                    setErrors={setErrors}
                    fullWidth
                />

                <FormControl 
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('tipo_contratacao')}
                    fullWidth 
                >
                    <InputLabel id="tipo_objeto-label">Tipo de objeto</InputLabel>
                    <Select
                        labelId="tipo_objeto-label"
                        id="tipo_objeto"
                        label="Tipo de objeto"
                        value={contratoEditado.tipo_objeto}
                        name="tipo_objeto"
                        onChange={handleInputChange}
                        fullWidth
                    >
                        <MenuItem value={""}>---</MenuItem>
                        <MenuItem value={"obra"}>Obra</MenuItem>
                        <MenuItem value={"projeto"}>Projeto</MenuItem>
                        <MenuItem value={"serviço"}>Serviço</MenuItem>
                        <MenuItem value={"aquisição"}>Aquisição</MenuItem>
                    </Select>
                    <FormHelperText>
                        {errors.hasOwnProperty('tipo_contratacao') ? errors.tipo_objeto : " "}
                    </FormHelperText>
                </FormControl>

                <TextField
                    variant="outlined"
                    value={contratoEditado.objeto}
                    name="objeto"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Objeto"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('objeto')}
                    helperText={errors.hasOwnProperty('objeto') ? errors.objeto : " "}
                    required
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={contratoEditado.numero_contrato}
                    name="numero_contrato"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Nº Contrato / Nota de Empenho Inicial"
                    sx={{ margin: '1rem 0' }}
                    error={error.hasOwnProperty('numero_contrato')}
                    helperText={error.hasOwnProperty('numero_contrato') ? errors.numero_contrato : " "}
                    required
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Data de assinatura"
                    value={contratoEditado.data_assinatura}
                    name="data_assinatura"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    error={errors.hasOwnProperty('data_assinatura')}
                    helperText={errors.hasOwnProperty('data_assinatura') ? errors.data_assinatura : " "}
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
                    checaErros={() => {}}
                    error={errors.hasOwnProperty('valor_contrato.error')}
                    helperText={errors.hasOwnProperty('valor_contrato.error') ? errors.valor_contrato : " "}
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
                    checaErros={() => {}}
                    error={errors.hasOwnProperty('valor_mensal_estimativo')}
                    helperText={errors.hasOwnProperty('valor_mensal_estimativo') ? errors.valor_mensal_estimativo : " "}
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Início da Vigência"
                    value={contratoEditado.data_inicio_vigencia}
                    name="data_inicio_vigencia"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    error={errors.hasOwnProperty('data_inicio_vigencia')}
                    helperText={errors.hasOwnProperty('data_inicio_vigencia') ? errors.data_inicio_vigencia : " "}
                    required
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Data de vencimento"
                    value={contratoEditado.data_vencimento}
                    name="data_vencimento"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    error={errors.hasOwnProperty('data_vencimento')}
                    helperText={errors.hasOwnProperty('data_vencimento') ? errors.data_vencimento : " "}
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={contratoEditado.condicao_pagamento}
                    name="condicao_pagamento"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Condição de Pagamento"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('condicao_pagamento')}
                    helperText={errors.hasOwnProperty('condicao_pagamento') ? errors.condicao_pagamento : "Ex: Em até 30 dias após o adimplemento."}
                    required
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={contratoEditado.prazo_a_partir_de}
                    name="prazo_a_partir_de"
                    onChange={handleInputChange}
                    className="form__campo"
                    label="Prazo a partir de"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('prazo_a_partir_de')}
                    helperText={errors.hasOwnProperty('prazo_a_partir_de') ? errors.prazo_a_partir_de : "Ex: A contar da ordem de início; A partir da assinatura; A partir da ordem de fornecimento..."}
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Prazo Máximo Prorrogável"
                    value={contratoEditado.data_prazo_maximo}
                    name="data_prazo_maximo"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    error={errors.hasOwnProperty('data_prazo_maximo')}
                    helperText={errors.hasOwnProperty('data_prazo_maximo') ? errors.data_prazo_maximo : " "}
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
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('nome_empresa')}
                    helperText={errors.hasOwnProperty('nome_empresa') ? errors.nome_empresa : " "}
                    required
                    fullWidth
                />

                <CampoTelefone 
                    className="contrato-empresa__campo"
                    formContrato={contratoEditado}
                    setFormContrato={setContratoEditado}
                    error={errors.hasOwnProperty('telefone_empresa')}
                    helperText={errors.hasOwnProperty('telefone_empresa') ? errors.telefone_empresa : " "}
                    name="telefone_empresa"
                />

                <TextField
                    variant="outlined"
                    className="form__campo"
                    label="E-mail da empresa"
                    value={contratoEditado.email_empresa}
                    name="email_empresa"
                    onChange={handleInputChange}
                    onBlur={checaErrosEmail}
                    type="email"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('email_empresa')}
                    helperText={errors.hasOwnProperty('email_empresa') ? errors.email_empresa : " "}
                    required
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
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('outras_informacoes')}
                    helperText={errors.hasOwnProperty('outras_informacoes') ? errors.outras_informacoes : " "}
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Envio material técnico"
                    value={contratoEditado.envio_material_tecnico}
                    name="envio_material_tecnico"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    error={errors.hasOwnProperty('envio_material_tecnico')}
                    helperText={errors.hasOwnProperty('envio_material_tecnico') ? errors.envio_material_tecnico : " "}
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Minuta edital"
                    value={contratoEditado.minuta_edital}
                    name="minuta_edital"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    error={errors.hasOwnProperty('minuta_edital')}
                    helperText={errors.hasOwnProperty('minuta_edital') ? errors.minuta_edital : " "}
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Abertura certame"
                    value={contratoEditado.abertura_certame}
                    name="abertura_certame"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    error={errors.hasOwnProperty('abertura_certame')}
                    helperText={errors.hasOwnProperty('abertura_certame') ? errors.abertura_certame : " "}
                    fullWidth
                />

                <CampoData
                    className="form__campo"
                    label="Homolagação"
                    value={contratoEditado.homologacao}
                    name="homologacao"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    error={errors.hasOwnProperty('homologacao')}
                    helperText={errors.hasOwnProperty('homologacao') ? errors.homologacao : " "}
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    className="form__campo"
                    label="Fonte de recurso"
                    value={contratoEditado.fonte_recurso}
                    name="fonte_recurso"
                    onChange={handleInputChange}
                    error={errors.hasOwnProperty('fonte_recurso')}
                    helperText={errors.hasOwnProperty('fonte_recurso') ? errors.fonte_recurso : " "}
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
                    onClick={handleClickOpenConfirm} 
                >
                    <CheckIcon fontSize="small" sx={{ mr: '0.5rem' }} /> Salvar
                </Button>
            </Box>
        </Box> 
    );
}

export default FormEditarContrato;