import { Box, FormControl, FormHelperText, InputLabel, Select, TextField, MenuItem } from "@mui/material"
import { useState } from "react"

export default function FormAditamentoPrazo({
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
          component="form"
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            formData.append("contrato_id", numContrato)
            acao === "Enviar" 
              ?  onSubmit({formData}, {
                onSuccess: () => setOpen(false),
                onError: (res) => setErrors(res.errors)
              }) 
              : onSubmit({formData, id: dados.id}, {
                onSuccess: () => setOpen(false),
                onError: (res) => setErrors(res.errors)
              })
          }}>

            <FormControl
              sx={{ margin: "1rem 0" }}
              error={errors?.hasOwnProperty("tipo_aditamento")}
              fullWidth
            >
              <InputLabel id="tipo_aditamento-label">Tipo</InputLabel>
              <Select
                labelId="tipo_aditamento-label"
                id="tipo_aditamento"
                label="Tipo"
                defaultValue={dados?.tipo_aditamento ?? ""}
                name="tipo_aditamento"
                fullWidth
              >
                <MenuItem value="Prorrogação de prazo">
                  Prorrogação de prazo
                </MenuItem>
                <MenuItem value="Supressão de prazo">Supressão de prazo</MenuItem>
                <MenuItem value="Suspensão">Suspensão</MenuItem>
                <MenuItem value="Rescisão">Rescisão</MenuItem>
              </Select>
              <FormHelperText>{errors?.tipo_aditamento ?? ""}</FormHelperText>
            </FormControl>

            <TextField
              variant="outlined"
              defaultValue={dados?.dias_reajuste ?? ""}
              name="dias_reajuste"
              label="Dias Reajuste"
              error={errors?.hasOwnProperty("dias_reajuste")}
              helperText={errors?.dias_reajuste}
              fullWidth
            />
          </Box>
    )

}