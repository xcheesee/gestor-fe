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

    const [tipoContratacoes, setTipoContratacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    
    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/tipocontratacoes`;
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
                        value={formContrato.tipo_contratacao_id === undefined ? "" : formContrato.tipo_contratacao_id}
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

                    {carregando === true
                        ? 
                        <CircularProgress 
                            size={20} 
                            sx={{ 
                                margin: '1rem auto',
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
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('processo_sei')}
                    helperText={errors.hasOwnProperty('processo_sei') ? errors.processo_sei : " "}
                    required
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={formContrato.dotacao_orcamentaria}
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
                    value={formContrato.credor}
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
                    formContrato={formContrato}
                    setFormContrato={setFormContrato}
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
                        value={formContrato.tipo_objeto}
                        name="tipo_objeto"
                        onChange={handleInputChange}
                        fullWidth
                    >
                        <MenuItem value={""}>---</MenuItem>
                        <MenuItem value={"Obra"}>Obra</MenuItem>
                        <MenuItem value={"Projeto"}>Projeto</MenuItem>
                        <MenuItem value={"Serviço"}>Serviço</MenuItem>
                        <MenuItem value={"Aquisição"}>Aquisição</MenuItem>
                    </Select>
                    <FormHelperText>
                        {errors.hasOwnProperty('tipo_contratacao') ? errors.tipo_objeto : " "}
                    </FormHelperText>
                </FormControl>

                <TextField
                    variant="outlined"
                    value={formContrato.objeto}
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
                    value={formContrato.numero_contrato}
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
                    value={formContrato.data_assinatura}
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
                    value={formContrato.valor_contrato}
                    state={formContrato}
                    setState={setFormContrato}
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
                    value={formContrato.valor_mensal_estimativo}
                    state={formContrato}
                    setState={setFormContrato}
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
                    value={formContrato.data_inicio_vigencia}
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
                    value={formContrato.data_vencimento}
                    name="data_vencimento"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    error={errors.hasOwnProperty('data_vencimento')}
                    helperText={errors.hasOwnProperty('data_vencimento') ? errors.data_vencimento : " "}
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={formContrato.condicao_pagamento}
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
                    value={formContrato.prazo_a_partir_de}
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
                    value={formContrato.data_prazo_maximo}
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
                    value={formContrato.nome_empresa}
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
                    formContrato={formContrato}
                    setFormContrato={setFormContrato}
                    error={errors.hasOwnProperty('telefone_empresa')}
                    helperText={errors.hasOwnProperty('telefone_empresa') ? errors.telefone_empresa : " "}
                    name="telefone_empresa"
                />

                <TextField
                    variant="outlined"
                    className="form__campo"
                    label="E-mail da empresa"
                    value={formContrato.email_empresa}
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
                    value={formContrato.outras_informacoes}
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
                    value={formContrato.envio_material_tecnico}
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
                    value={formContrato.minuta_edital}
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
                    value={formContrato.abertura_certame}
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
                    value={formContrato.homologacao}
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
                    value={formContrato.fonte_recurso}
                    name="fonte_recurso"
                    onChange={handleInputChange}
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('fonte_recurso')}
                    helperText={errors.hasOwnProperty('fonte_recurso') ? errors.fonte_recurso : " "}
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

export default FormNovoContrato;