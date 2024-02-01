import { Box, TextField } from "@mui/material"
import CampoValores from "../../CampoValores"
import CampoData from "../../CampoData"
import { brlToFloat } from "../../../commom/utils/utils"

export default function FormGarantia({
    numContrato,
    acao,
    dados={},
    errors={},
    formId,
    onSubmit,
    setOpen
}) {
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
                        onSuccess: () => setOpen(false)
                    }) 
                    : onSubmit({formData, id: dados.id}, {
                        onSuccess: () => setOpen(false)
                    })
            }}>
            <TextField
                variant="outlined"
                defaultValue={dados.instituicao_financeira ?? ""}
                name="instituicao_financeira"
                // onChange={handleInputChange}
                label="Instituição financeira"
                //sx={{ margin: '1rem 0' }}
                error={errors?.hasOwnProperty('instituicao_financeira')}
                helperText={errors?.instituicao_financeira ?? ""}
                fullWidth
                required
            />

            <TextField
                variant="outlined"
                defaultValue={dados?.numero_documento ?? ""}
                name="numero_documento"
                // onChange={handleInputChange}
                label="Número do documento"
                //sx={{ margin: '1rem 0' }}
                error={errors?.hasOwnProperty('numero_documento')}
                helperText={errors?.numero_documento ?? ""} 
                fullWidth
                required
            />

            <CampoValores 
                label="Valor"
                defaultValue={dados?.valor_garantia ?? ""}
                name="valor_garantia"
                prefix="R$ "
                //checaErros={() => {}}
                error={errors?.hasOwnProperty('valor_garantia')}
                helperText={errors?.valor_garantia ?? ""}
                fullWidth
                required
            />

            <CampoData 
                label="Validade"
                defaultValue={dados?.data_validade_garantia ?? ""}
                name="data_validade_garantia"
                //onChange={handleInputChange}
                //margin="1rem 0"
                error={errors?.hasOwnProperty('data_validade_garantia')}
                helperText={errors?.data_validade_garantia ?? ""}
                fullWidth
                required
            />
        </Box>
    )

}