import { Box, FormControl, FormHelperText, InputAdornment, InputLabel, Select, TextField, MenuItem } from "@mui/material"
import CampoValores from "../../CampoValores"
import CampoData from "../../CampoData"
import { brlToFloat } from "../../../commom/utils/utils"

export default function FormAditamentoValor({
    numContrato,
    acao,
    dados={},
    errors={},
    formId,
    onSubmit,
    setOpen
}) {
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
                onSuccess: () => setOpen(false)
              }) 
              : onSubmit({formData, id: dados.id}, {
                onSuccess: () => setOpen(false)
              })
          }}>

          <FormControl
            //sx={{ margin: "1rem 0" }}
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
              //onChange={handleInputChange}
              required
              fullWidth
            >
              <MenuItem value="Acréscimo de valor">Acréscimo de valor</MenuItem>
              <MenuItem value="Redução de valor">Redução de valor</MenuItem>
            </Select>
            <FormHelperText>{errors?.tipo_aditamento}</FormHelperText>
          </FormControl>

          <CampoValores
            index=""
            label="Valor"
            defaultValue={dados.valor_aditamento ?? ""}
            name="valor_aditamento"
            prefix="R$ "
            //checaErros={() => {}}
            error={errors?.hasOwnProperty("valor_aditamento")}
            helperText={errors?.valor_aditamento}
            fullWidth
          />

          <TextField
            label="Porcentagem reajuste"
            defaultValue={dados?.percentual ?? ""}
            name="percentual"
            fullWidth
            InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
          />

          {/*<CampoPorcentagem
            label="Porcentagem reajuste"
            value={formAditamento.percentual}
            name="percentual"
            state={formAditamento}
            setState={setFormAditamento}
            error={errors.hasOwnProperty("percentual")}
            helperText={errors.percentual}
            fullWidth
          />*/}

          <CampoData
              label="Data de Aditamento"
              defaultValue={dados?.data_aditamento ?? ""}
              name="data_aditamento"
              //onChange={handleInputChange}
              //margin="1rem 0"
              error={errors?.hasOwnProperty('data_aditamento')}
              helperText={errors?.data_aditamento}
              fullWidth
              required
          />
        </Box>
    )
}