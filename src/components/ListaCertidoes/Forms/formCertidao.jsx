import { Box, TextField } from "@mui/material"
import CampoData from "../../CampoData"

export default function FormCertidao({
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
            component='form'
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                formData.append("contrato_id", numContrato)
                acao === "Enviar" 
                    ? onSubmit({formData}, {
                        onSuccess: () => setOpen(false)
                    }) 
                    : onSubmit({formData, id: dados.id}, {
                        onSuccess: () => setOpen(false)
                    })
            }}
        >
            <TextField
                variant="outlined"
                defaultValue={dados?.certidoes ?? ""}
                name="certidoes"
                label="Certidão"
                error={errors?.hasOwnProperty('certidoes')}
                helperText={errors?.certidoes ?? "Ex: Certidão negativa de débitos"}
                fullWidth
                required
            />

            <CampoData
                label="Validade"
                defaultValue={dados?.validade_certidoes ?? ""}
                name="validade_certidoes"
                error={errors?.hasOwnProperty('validade_certidoes')}
                helperText={errors?.validade_certidoes ?? ""}
                fullWidth
                required
            />

        </Box>
    )
}