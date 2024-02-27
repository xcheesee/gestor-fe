import { Box, FormControl, FormHelperText, InputAdornment, InputLabel, Select, TextField, MenuItem } from "@mui/material"
import CampoValores from "../../CampoValores"
import CampoData from "../../CampoData"
import { brlToFloat } from "../../../commom/utils/utils"
import { useState } from "react"

export default function FormAditamentoValor({
    numContrato,
    acao,
    dados={},
    formId,
    onSubmit,
    setOpen
}) {

    const [errors, setErrors] = useState({})
    return (
        <Box
          component="form"
          className="flex flex-col gap-4 py-2"
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            formData.append("contrato_id", numContrato)
            const val = formData.get('valor_aditamento')
            const formatted = brlToFloat(val)
            formData.set('valor_aditamento', formatted)
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
            fullWidth 
            error={errors?.hasOwnProperty("tipo_aditamento")}
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
              <MenuItem value="Acréscimo de valor">Acréscimo de valor</MenuItem>
              <MenuItem value="Redução de valor">Redução de valor</MenuItem>
            </Select>
            <FormHelperText>{errors?.tipo_aditamento ?? ""}</FormHelperText>
          </FormControl>

          <CampoValores
            index=""
            label="Valor"
            defaultValue={dados.valor_aditamento ?? ""}
            name="valor_aditamento"
            prefix="R$ "
            error={errors?.hasOwnProperty("valor_aditamento")}
            helperText={errors?.valor_aditamento ?? ""}
            fullWidth
          />

          <TextField
            label="Porcentagem reajuste"
            defaultValue={dados?.percentual ?? ""}
            name="percentual"
            fullWidth
            error={errors?.hasOwnProperty('percentual')}
            helperText={errors?.percentual ?? ""}
            InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
          />

          <CampoData
              label="Data de Aditamento"
              defaultValue={dados?.data_aditamento ?? ""}
              name="data_aditamento"
              error={errors?.hasOwnProperty('data_aditamento')}
              helperText={errors?.data_aditamento ?? ""}
              fullWidth
          />
        </Box>
    )
}