import React from 'react';
import { 
    Box,
    Divider,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';
import CampoCpfCnpj from '../../../CampoCpfCnpj';
import CampoData from '../../../CampoData';
import CampoValores from '../../../CampoValores';

const BoxDadosContrato = (props) => {
    const {
        errors,
        setErrors,
        error,
        setError,
        formContrato,
        setFormContrato,
        handleChange,
        processo_sei,
        dotacao_orcamentaria,
        credor,
        tipo_objeto,
        setTipo_objeto,
        objeto,
        numero_contrato,
        condicao_pagamento,
        prazo_a_partir_de,
        numero_nota_reserva,
    } = props;

    return (
        <Box>
            <Divider sx={{ mt: '1.5rem', mb: '1.25rem' }} textAlign="left"> 
                <Typography variant="h5" sx={{ fontWeight: 'light' }}>Dados do contrato</Typography> 
            </Divider>

            <TextField
                variant="outlined"
                ref={processo_sei}
                name="processo_sei"
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
                ref={dotacao_orcamentaria}
                name="dotacao_orcamentaria"
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
                ref={credor}
                name="credor"
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
                    value={tipo_objeto}
                    name="tipo_objeto"
                    onChange={(e) => { setTipo_objeto(e.target.value); }}
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
                ref={objeto}
                name="objeto"
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
                ref={numero_contrato}
                name="numero_contrato"
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
                onChange={(e) => { handleChange(e, formContrato, setFormContrato) }}
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
                onChange={(e) => { handleChange(e, formContrato, setFormContrato) }}
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
                onChange={(e) => { handleChange(e, formContrato, setFormContrato) }}
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
                onChange={(e) => { handleChange(e, formContrato, setFormContrato) }}
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
                onChange={(e) => { handleChange(e, formContrato, setFormContrato) }}
                margin="1rem 0"
                error={errors.hasOwnProperty('data_vencimento')}
                helperText={errors.hasOwnProperty('data_vencimento') ? errors.data_vencimento : " "}
                fullWidth
            />

            <TextField
                variant="outlined"
                ref={condicao_pagamento}
                name="condicao_pagamento"
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
                ref={prazo_a_partir_de}
                name="prazo_a_partir_de"
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
                onChange={(e) => { handleChange(e, formContrato, setFormContrato) }}
                margin="1rem 0"
                error={errors.hasOwnProperty('data_prazo_maximo')}
                helperText={errors.hasOwnProperty('data_prazo_maximo') ? errors.data_prazo_maximo : " "}
                required
                fullWidth
            />

            <TextField
                variant="outlined"
                ref={numero_nota_reserva}
                name="numero_nota_reserva"
                className="form__campo"
                label="Número nota reserva"
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('numero_nota_reserva')}
                helperText={errors.hasOwnProperty('numero_nota_reserva') ? errors.numero_nota_reserva : " "}
                fullWidth
            />

            <CampoValores
                index=""
                className="form__campo"
                label="Valor reserva"
                value={formContrato.valor_reserva}
                state={formContrato}
                setState={setFormContrato}
                name="valor_reserva"
                onChange={(e) => { handleChange(e, formContrato, setFormContrato) }}
                checaErros={() => {}}
                error={errors.hasOwnProperty('valor_reserva')}
                helperText={errors.hasOwnProperty('valor_reserva') ? errors.valor_reserva : " "}
                fullWidth 
            />
        </Box>
    );
}

export default BoxDadosContrato;