import { Box, TextField } from "@mui/material"
import CampoValores from "../../Inputs/CampoValores"
import CampoData from "../../Inputs/CampoData"
import { brlToFloat } from "../../../commom/utils/utils"
import { useState } from "react"

export default function FormGarantia({
    numContrato,
    acao,
    dados={},
    formId,
    onSubmit,
    setOpen
}) {

    const [errors, setErrors] = useState({})
    return(
        <Box
            className="flex flex-col gap-4 py-2"
            component="form"
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                formData.append("contrato_id", numContrato)
                const val = formData.get('valor_garantia')
                const formatted = brlToFloat(val)
                formData.set('valor_garantia', formatted)
                acao === "Enviar"
                    ? onSubmit({formData}, {
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    }) 
                    : onSubmit({formData, id: dados.id}, {
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    })
            }}>
            <TextField
                variant="outlined"
                defaultValue={dados.instituicao_financeira ?? ""}
                name="instituicao_financeira"
                label="Instituição financeira"
                error={errors?.hasOwnProperty('instituicao_financeira')}
                helperText={errors?.instituicao_financeira ?? ""}
                fullWidth
                
            />

            <TextField
                variant="outlined"
                defaultValue={dados?.numero_documento ?? ""}
                name="numero_documento"
                label="Número do documento"
                error={errors?.hasOwnProperty('numero_documento')}
                helperText={errors?.numero_documento ?? ""} 
                fullWidth
                
            />

            <CampoValores 
                label="Valor"
                defaultValue={dados?.valor_garantia ?? ""}
                name="valor_garantia"
                prefix="R$ "
                error={errors?.hasOwnProperty('valor_garantia')}
                helperText={errors?.valor_garantia ?? ""}
                fullWidth
                
            />

            <CampoData 
                label="Validade"
                defaultValue={dados?.data_validade_garantia ?? ""}
                name="data_validade_garantia"
                error={errors?.hasOwnProperty('data_validade_garantia')}
                helperText={errors?.data_validade_garantia ?? ""}
                fullWidth
                
            />
        </Box>
    )

}