import { useState } from "react"
import { Box, TextField } from "@mui/material"
import CampoData from "../../Inputs/CampoData"

export default function FormCertidao({
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
            component='form'
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                formData.append("contrato_id", numContrato)
                acao === "Enviar" 
                    ? onSubmit({formData}, {
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    }) 
                    : onSubmit({formData, id: dados.id}, {
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
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
                
            />

            <CampoData
                label="Validade"
                defaultValue={dados?.validade_certidoes ?? ""}
                name="validade_certidoes"
                error={errors?.hasOwnProperty('validade_certidoes')}
                helperText={errors?.validade_certidoes ?? ""}
                fullWidth
                
            />

        </Box>
    )
}