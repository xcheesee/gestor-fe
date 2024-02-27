import React, { useRef, useState } from 'react';
import { 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    FormHelperText,
    Box
} from '@mui/material';

import CampoTipoDotacao from '../../CampoTipoDotacao';

const FormDotacoes = (props) => {
    const {
        openFormDotacao,
        errors,
        setErrors,
        formDotacao,
        setFormDotacao,
        numContrato,
        origemRecursos,
        enviaDotacao,
        editaDotacao,
    } = props;
    const novoRecursoRef = useRef({
        outros_descricao: "",
        origem_recurso_id: ""
    })
    const [outrosDesc, setOutrosDesc] = useState(false)
    const CamposRecurso = () => {
        if (openFormDotacao.acao === 'adicionar') {
            return (
                <>
                    <FormControl
                        sx={{ position: 'relative' }}
                        error={errors.hasOwnProperty('dotacao_recurso')}
                        fullWidth
                        // required
                    >
                        <InputLabel id="dotacao_recurso-label">Fonte de recurso</InputLabel>

                        <Select
                            labelId="dotacao_recurso-label"
                            id="origem_recurso_id"
                            label="Fonte de recurso"
                            defaultValue={novoRecursoRef.current.origem_recurso_id ?? ""}
                            onChange={(e) => {
                                novoRecursoRef.current.origem_recurso_id = e.target.value
                                if(e.target.value === 999) {
                                    setOutrosDesc(true)
                                } else {
                                    setOutrosDesc(false)
                                }
                            }}
                            name="origem_recurso_id"
                            fullWidth
                        >
                            {origemRecursos.map((origemRecurso, index) => {
                                return (
                                    <MenuItem key={index} value={origemRecurso.id}>{origemRecurso.nome}</MenuItem>
                                );
                            })}
                        </Select>
                        <FormHelperText className='text-red-600'>{errors?.dotacao_recurso?.message} </FormHelperText>
                    </FormControl>
                    
                    {
                        outrosDesc
                        ?
                            <TextField 
                                variant="outlined"
                                defaultValue={novoRecursoRef.current.outros_descricao}
                                onChange={(e) => novoRecursoRef.current.outros_descricao = e.target.value}
                                name="outros_descricao"
                                label="Descrição"
                                helperText="Descreva brevemente a fonte de recurso"
                                fullWidth
                                // required
                            />
                        :
                            ""
                    }
                </>
            );
        } else if (openFormDotacao.acao === 'editar') {
            return ("");
        }
    }

    return (
        <Box
            component="form"
            id="dotacao_form"
            className='flex flex-col gap-4 mt-4'
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                formData.append("contrato_id", numContrato)
                formData.append("dotacao_tipo_id", formDotacao.dotacao_tipo_id)
                if(formData.get("origem_recurso_id") === "" && formData.get("dotacao_tipo_id") === "") {
                    return setErrors({
                        dotacao_recurso: {
                            message: "Defina ao menos um tipo de dotação ou uma fonte de recurso"
                    }})
                }
                setErrors({})
                openFormDotacao.acao === 'adicionar' ?  enviaDotacao(formData) : editaDotacao(formDotacao.id, formData)
                
            }}>
            <CampoTipoDotacao dotacao={formDotacao} setDotacao={setFormDotacao}/>
            <CamposRecurso />
        </Box>
    );
}

export default FormDotacoes;