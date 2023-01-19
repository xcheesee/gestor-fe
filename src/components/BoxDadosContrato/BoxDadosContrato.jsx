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
    FormHelperText,
} from '@mui/material';
import CampoCpfCnpj from '../CampoCpfCnpj';
import CampoData from '../CampoData';
import CampoValores from '../CampoValores';
import CampoProcessoSei from '../CampoProcessoSei';
import CampoNumContrato from '../CampoNumContrato';
import MaxPrazoInput from '../MaxPrazoInput';
import { contratoLabels } from '../utils/constants';

const BoxDadosContrato = (props) => {
    const {
        errors,
        setErrors,
        error,
        setError,
        formContrato,
        setFormContrato,
        handleChange,
        departamentos,
        departamento_id,
        setDepartamento_id,
        credor,
        tipo_objeto,
        setTipo_objeto,
        objeto,
        condicao_pagamento,
        prazo_a_partir_de,
        numero_nota_reserva,
        acao
    } = props;

    return (
        <Box>
            {
            acao === "editar"
            ?
                ""
            :
                <Divider sx={{ mt: '1.5rem', mb: '1.25rem' }} textAlign="left"> 
                    <Typography variant="h5" sx={{ fontWeight: 'light' }}>Dados do contrato</Typography> 
                </Divider>
            }

            <FormControl 
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('departamento_id')}
                fullWidth 
            >
                <InputLabel id="departamento_id-label">{contratoLabels.departamento}</InputLabel>
                <Select
                    labelId="departamento_id-label"
                    id="departamento_id"
                    label={contratoLabels.departamento}
                    value={departamento_id}
                    name="departamento_id"
                    onChange={(e) => { setDepartamento_id(e.target.value); }}
                    fullWidth
                >
                    { departamentos !== undefined
                        ? Object.entries(departamentos)?.map((departamento, index) => {
                            console.log(departamento)
                            return (
                                <MenuItem value={departamento[0]} key={index}>{departamento[1]}</MenuItem>
                            );
                        })
                        : <MenuItem value={0} key={0}></MenuItem>
                    }
                </Select>
                <FormHelperText>
                    {errors?.hasOwnProperty('departamento_id') ? errors?.departamento_id : " "}
                </FormHelperText>
            </FormControl>

            <CampoProcessoSei 
                formContrato={formContrato}
                setFormContrato={setFormContrato}
                error={errors.hasOwnProperty('processo_sei')}
                helperText={errors.hasOwnProperty('processo_sei') ? errors.processo_sei : " "}
                label={contratoLabels.processo_sei}
                name="processo_sei"
            />
            
            <TextField
                variant="outlined"
                inputRef={credor}
                defaultValue={formContrato.credor}
                name="credor"
                className="form__campo"
                label={contratoLabels.credor}
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
                label={contratoLabels.cnpj_cpf}
                fullWidth
            />

            <FormControl 
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('tipo_contratacao')}
                fullWidth 
            >
                <InputLabel id="tipo_objeto-label">{contratoLabels.tipo_objeto}</InputLabel>
                <Select
                    labelId="tipo_objeto-label"
                    id="tipo_objeto"
                    label={contratoLabels.tipo_objeto}
                    value={tipo_objeto}
                    name="tipo_objeto"
                    onChange={(e) => { setTipo_objeto(e.target.value); }}
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
                inputRef={objeto}
                defaultValue={formContrato.objeto}
                name="objeto"
                className="form__campo"
                label={contratoLabels.objeto}
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('objeto')}
                helperText={errors.hasOwnProperty('objeto') ? errors.objeto : " "}
                required
                fullWidth
            />
            {/* TODO: MOSTRAR HELPER TEXT E ERROR BORDER EM NUMERO_CONTRATO */}
            <CampoNumContrato 
                formContrato={formContrato}
                setFormContrato={setFormContrato}
                error={error.hasOwnProperty('numero_contrato')}
                helperText={error.hasOwnProperty('numero_contrato') ? errors.numero_contrato : " "}
                label={contratoLabels.numero_contrato}
                required
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.data_assinatura}
                value={formContrato.data_assinatura}
                name="data_assinatura"
                onChange={(e) => { handleChange(e, formContrato, setFormContrato) }}
                margin="1rem 0"
                error={errors.hasOwnProperty('data_assinatura')}
                helperText={errors.hasOwnProperty('data_assinatura') ? errors.data_assinatura : " "}
                fullWidth
            />
            {/* TODO: MOSTRAR HELPER TEXT E ERROR BORDER EM NUMERO_CONTRATO */}
            <CampoValores
                index=""
                className="form__campo"
                label={contratoLabels.valor_contrato}
                value={formContrato.valor_contrato}
                state={formContrato}
                setState={setFormContrato}
                name="valor_contrato"
                checaErros={() => {}}
                error={errors.hasOwnProperty('valor_contrato.error')}
                helperText={errors.hasOwnProperty('valor_contrato.error') ? errors.valor_contrato : " "}
                required
                fullWidth
            />

            <CampoValores
                index=""
                className="form__campo"
                label={contratoLabels.valor_mensal_estimativo}
                value={formContrato.valor_mensal_estimativo}
                state={formContrato}
                setState={setFormContrato}
                name="valor_mensal_estimativo"
                checaErros={() => {}}
                error={errors.hasOwnProperty('valor_mensal_estimativo')}
                helperText={errors.hasOwnProperty('valor_mensal_estimativo') ? errors.valor_mensal_estimativo : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.data_inicio_vigencia}
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
                label={contratoLabels.data_vencimento}
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
                inputRef={condicao_pagamento}
                defaultValue={formContrato.condicao_pagamento}
                name="condicao_pagamento"
                className="form__campo"
                label={contratoLabels.condicao_pagamento}
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('condicao_pagamento')}
                helperText={errors.hasOwnProperty('condicao_pagamento') ? errors.condicao_pagamento : "Ex: Em até 30 dias após o adimplemento."}
                required
                fullWidth
            />
            {/* <TextField
                variant="outlined"
                inputRef={prazo_a_partir_de}
                defaultValue={formContrato.prazo_a_partir_de}
                name="prazo_a_partir_de"
                className="form__campo"
                label="Prazo a partir de"
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('prazo_a_partir_de')}
                helperText={errors.hasOwnProperty('prazo_a_partir_de') ? errors.prazo_a_partir_de : "Ex: A contar da ordem de início; A partir da assinatura; A partir da ordem de fornecimento..."}
                fullWidth
            /> */}

            <MaxPrazoInput 
                helperText="Ex: A contar da ordem de início; A partir da assinatura; A partir da ordem de fornecimento..."
                validade={formContrato.data_vencimento}
                label={contratoLabels.prazo_a_partir_de}
                disabled={formContrato.data_vencimento === ""}
            />

            {/* <CampoData
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
            /> */}

            <TextField
                variant="outlined"
                inputRef={numero_nota_reserva}
                defaultValue={formContrato.numero_nota_reserva}
                name="numero_nota_reserva"
                className="form__campo"
                label={contratoLabels.numero_nota_reserva}
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('numero_nota_reserva')}
                helperText={errors.hasOwnProperty('numero_nota_reserva') ? errors.numero_nota_reserva : " "}
                fullWidth
            />

            <CampoValores
                index=""
                className="form__campo"
                label={contratoLabels.valor_reserva}
                value={formContrato.valor_reserva}
                state={formContrato}
                setState={setFormContrato}
                name="valor_reserva"
                checaErros={() => {}}
                error={errors.hasOwnProperty('valor_reserva')}
                helperText={errors.hasOwnProperty('valor_reserva') ? errors.valor_reserva : " "}
                fullWidth 
            />
        </Box>
    );
}

export default BoxDadosContrato;