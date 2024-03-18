import React, { useEffect, useRef } from 'react';
import { 
    Box,
    Divider,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from '@mui/material';
import CampoValores from '../CampoValores';
import CampoProcessoSei from '../CampoProcessoSei';
import CampoNumContrato from '../CampoNumContrato';
import { contratoLabels } from '../../commom/utils/constants';
import CampoEmpresa from '../CampoEmpresa';
import { formataCpfCnpj } from '../../commom/utils/utils';
import CampoTexto from '../CampoTexto';
import CampoCatSubcat from '../CampoCategoria';

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
        acao,
        focusError,
        //setFocusError,
    } = props;
    const empresaRef = useRef({
        id: dados.empresa_id, 
        nome: dados.empresa, 
        telefone: dados.empresa_telefone,
        email: dados.empresa_email, 
        cnpj: dados.empresa_cnpj,
        cnpj_formatado: formataCpfCnpj(dados.empresa_cnpj)
    })

    useEffect(() => {
        if(focusError === "") return
        document.querySelector(`input[name=${focusError}]`)?.scrollIntoView({behavior: 'smooth', block: 'center'})
    },[focusError])

    return (
        <Box
            component="form"
            id="contrato-form"
            className="flex flex-col gap-4 py-2"
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                formData.append('empresa_id', empresaRef.current.id)
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
                error={errors.hasOwnProperty('departamento_id')}
                fullWidth 
                required
            >
                <InputLabel id="departamento_id-label">{contratoLabels.departamento}</InputLabel>
                <Select
                    labelId="departamento_id-label"
                    id="departamento_id"
                    label={contratoLabels.departamento}
                    defaultValue={dados.departamento_id ?? ""}
                    name="departamento_id"
                    required
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
                defaultValue={dados.processo_sei ?? ""}
                error={errors.hasOwnProperty('processo_sei')}
                helperText={errors.hasOwnProperty('processo_sei') ? errors.processo_sei : " "}
                label={contratoLabels.processo_sei}
                name="processo_sei"
            />
            
            <CampoEmpresa
                ref={empresaRef}
             />

            <CampoCatSubcat
                defaultValue={{categoria: dados?.categoria_id, subcategoria: dados?.subcategoria_id}}
                errors={errors}
             />

            <CampoTexto
                defaultValue={dados?.objeto}
                name="objeto"
                errors={errors}
                labels={contratoLabels}
            />
            {/* TODO: MOSTRAR HELPER TEXT E ERROR BORDER EM NUMERO_CONTRATO */}
            <CampoNumContrato 
                defaultValue={dados.numero_contrato ?? ""}
                error={error.hasOwnProperty('numero_contrato')}
                helperText={error.hasOwnProperty('numero_contrato') ? errors.numero_contrato : " "}
                label={contratoLabels.numero_contrato}
                fullWidth
            />

            <CampoValores
                index=""
                className="form__campo"
                label={contratoLabels.valor_contrato}
                defaultValue={dados.valor_contrato ?? ""}
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
                defaultValue={dados.valor_mensal_estimativo ?? ""}
                name="valor_mensal_estimativo"
                checaErros={() => {}}
                error={errors.hasOwnProperty('valor_mensal_estimativo')}
                helperText={errors.hasOwnProperty('valor_mensal_estimativo') ? errors.valor_mensal_estimativo : " "}
                fullWidth
            />

            <CampoTexto
                defaultValue={dados?.condicao_pagamento}
                name="condicao_pagamento"
                errors={errors}
                helperText={"Ex: Em até 30 dias após o adimplemento."}
                labels={contratoLabels}
            />
        </Box>
    );
}

export default BoxDadosContrato;