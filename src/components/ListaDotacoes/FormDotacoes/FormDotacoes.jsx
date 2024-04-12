import React from 'react';
import { Box } from '@mui/material';

import CampoTipoDotacao from '../../Inputs/CampoTipoDotacao';
import CampoRecurso from '../CampoRecurso';

const FormDotacoes = (props) => {
    const {
        openFormDotacao,
        errors,
        setErrors,
        formDotacao,
        numContrato,
        enviaDotacao,
        editaDotacao,
    } = props;

    return (
        <Box
            component="form"
            id="dotacao_form"
            className='flex flex-col gap-4 mt-4'
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                formData.append("contrato_id", numContrato)
                if(formData.get("origem_recurso_id") === "" && formData.get("dotacao_tipo_id") === "") {
                    return setErrors({
                        dotacao_recurso: {
                            message: "Defina ao menos um tipo de dotação ou uma fonte de recurso"
                    }})
                }
                setErrors({})
                openFormDotacao.acao === 'adicionar' ?  enviaDotacao(formData) : editaDotacao(formDotacao.id, formData)
                
            }}>
            <CampoTipoDotacao dotacao={formDotacao}/>
            { openFormDotacao.acao === 'adicionar' && <CampoRecurso errors={errors} /> }
            <Box className="text-red-500 font-bold text-center">{errors?.dotacao_recurso?.message ?? "" }</Box>
        </Box>
    );
}

export default FormDotacoes;