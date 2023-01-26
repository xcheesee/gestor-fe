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
import { contratoLabels } from '../../commom/utils/constants';

const BoxDadosContrato = (props) => {
    const {
        errors,
        setErrors,
        error,
        setError,
        dados,
        enviaDadosContrato,
        departamentos,
        numContrato,
        acao
    } = props;

    return (
        <Box
            component="form"
            id="contrato-form"
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                enviaDadosContrato(e, formData, numContrato)
            }}
        >
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
                    defaultValue={dados?.departamento_id}
                    name="departamento_id"
                    // onChange={(e) => { setDepartamento_id(e.target.value); }}
                    fullWidth
                >
                    { departamentos !== undefined
                        ? Object.entries(departamentos)?.map((departamento, index) => (
                            <MenuItem value={departamento[0]} key={index}>{departamento[1]}</MenuItem>
                        ))
                        : <MenuItem value="" key={0}></MenuItem>
                    }
                </Select>
                <FormHelperText>
                    {errors?.hasOwnProperty('departamento_id') ? errors?.departamento_id : " "}
                </FormHelperText>
            </FormControl>

            <CampoProcessoSei 
                defaultValue={dados.processo_sei}
                error={errors.hasOwnProperty('processo_sei')}
                helperText={errors.hasOwnProperty('processo_sei') ? errors.processo_sei : " "}
                label={contratoLabels.processo_sei}
                name="processo_sei"
            />
            
            <TextField
                variant="outlined"
                defaultValue={dados.credor}
                name="credor"
                className="form__campo"
                label={contratoLabels.credor}
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('credor')}
                helperText={errors.hasOwnProperty('credor') ? errors.credor : " "}
                fullWidth
            />
            <CampoCpfCnpj
                className="form__campo"
                defaultValue={dados?.cnpj_cpf}
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
                    defaultValue={dados?.tipo_objeto}
                    name="tipo_objeto"
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
                defaultValue={dados.objeto ?? ""}
                name="objeto"
                className="form__campo"
                label={contratoLabels.objeto}
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('objeto')}
                helperText={errors.hasOwnProperty('objeto') ? errors.objeto : " "}
                fullWidth
            />
            {/* TODO: MOSTRAR HELPER TEXT E ERROR BORDER EM NUMERO_CONTRATO */}
            <CampoNumContrato 
                defaultValue={dados.numero_contrato ?? ""}
                error={error.hasOwnProperty('numero_contrato')}
                helperText={error.hasOwnProperty('numero_contrato') ? errors.numero_contrato : " "}
                label={contratoLabels.numero_contrato}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.data_assinatura}
                defaultValue={dados?.data_assinatura}
                name="data_assinatura"
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
                defaultValue={dados?.valor_contrato}
                name="valor_contrato"
                checaErros={() => {}}
                error={errors.hasOwnProperty('valor_contrato.error')}
                helperText={errors.hasOwnProperty('valor_contrato.error') ? errors.valor_contrato : " "}
                fullWidth
            />

            <CampoValores
                index=""
                className="form__campo"
                label={contratoLabels.valor_mensal_estimativo}
                defaultValue={dados?.valor_mensal_estimativo}
                name="valor_mensal_estimativo"
                checaErros={() => {}}
                error={errors.hasOwnProperty('valor_mensal_estimativo')}
                helperText={errors.hasOwnProperty('valor_mensal_estimativo') ? errors.valor_mensal_estimativo : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.data_inicio_vigencia}
                defaultValue={dados?.data_inicio_vigencia}
                name="data_inicio_vigencia"
                margin="1rem 0"
                error={errors.hasOwnProperty('data_inicio_vigencia')}
                helperText={errors.hasOwnProperty('data_inicio_vigencia') ? errors.data_inicio_vigencia : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.data_vencimento}
                defaultValue={dados?.data_vencimento}
                name="data_vencimento"
                margin="1rem 0"
                error={errors.hasOwnProperty('data_vencimento')}
                helperText={errors.hasOwnProperty('data_vencimento') ? errors.data_vencimento : " "}
                fullWidth
            />

            <TextField
                variant="outlined"
                defaultValue={dados?.condicao_pagamento}
                name="condicao_pagamento"
                className="form__campo"
                label={contratoLabels.condicao_pagamento}
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('condicao_pagamento')}
                helperText={errors.hasOwnProperty('condicao_pagamento') ? errors.condicao_pagamento : "Ex: Em até 30 dias após o adimplemento."}
                fullWidth
            />

            <MaxPrazoInput 
                helperText="A contar da data de vencimento..."
                validade={dados?.data_vencimento}
                defaultValue={dados?.data_prazo_maximo}
                label={contratoLabels.prazo_a_partir_de}
                disabled={dados?.data_vencimento === ""}
            />

            <TextField
                variant="outlined"
                defaultValue={dados?.numero_nota_reserva}
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
                defaultValue={dados?.valor_reserva}
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