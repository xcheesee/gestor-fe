import { meses } from "../../../commom/utils/constants"
import { brlToFloat } from "../../../commom/utils/utils"
import { Box, TextField, MenuItem } from "@mui/material"
import CampoAno from "../../Inputs/CampoAno"
import CampoValores from "../../Inputs/CampoValores"
import { useState } from "react"
                
//const tipos_empenho = {
//    cancelamento: "Cancelamento",
//    complemento: "Complemento",
//    novo_empenho: "Novo Empenho"
//}

export default function FormNotaEmpenho({
    numContrato,
    formId,
    dados={},
    setOpen,
    setCarregando,
    acao,
    onSubmit
}) {
    const [dataEmissao, setDataEmissao] = useState(dados?.data_emissao ?? "")
    const [mesReferencia, setMesReferencia] = useState(dados?.mes_referencia ?? "")
    const [anoReferencia, setAnoReferencia] = useState(dados?.ano_referencia ?? "")
    const [errors, setErrors] = useState({})

    return(
        <Box
            className='grid gap-4 py-2'
            component="form"
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                formData.append("contrato_id", numContrato)
                const val = formData.get('valor_empenho')
                const formatted = brlToFloat(val)
                formData.set('valor_empenho', formatted)
                acao === 'Enviar' 
                    ? onSubmit({formData},{
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    }) 
                    : onSubmit({formData, id: dados?.id}, {
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    })
            }}>

            <TextField
                select
                fullWidth
                label="Tipo de Empenho"
                id="tipo_empenho"
                name="tipo_empenho"
                defaultValue={dados?.tipo_empenho}
                error={errors?.hasOwnProperty('tipo_empenho')}
                helperText={errors?.tipo_empenho ?? ""}
            >
                <MenuItem value={"complemento"}>Complemento</MenuItem>
                <MenuItem value={"cancelamento"}>Cancelamento</MenuItem>
                <MenuItem value={"novo_empenho"}>Novo Empenho</MenuItem>
            </TextField>

            <TextField
                label="Data de Emissão da Nota"
                type='date'
                name="data_emissao"
                error={errors?.hasOwnProperty('data_emissao')}
                helperText={errors?.data_emissao ?? ""}
                value={dataEmissao}
                onChange={(e) => {
                    setDataEmissao(e.target.value)
                    const arrData = e.target.value?.split("-")
                    setMesReferencia(+arrData[1])
                    setAnoReferencia(+arrData[0])
                }}
                InputLabelProps={{ shrink: true}}
                fullWidth
            />

            <TextField
                select
                fullWidth
                label="Mes de Referencia"
                name='mes_referencia'
                value={mesReferencia}
                onChange={(e) => setMesReferencia(e.target.value)}
                error={errors?.hasOwnProperty('mes_referencia')}
                helperText={errors?.mes_referencia ?? ""}
            >
                {meses.map((mes, i) => {
                    return(
                        <MenuItem key={`mes-ref-${i+1}`} value={i+1} className=''>{mes}</MenuItem>
                    )
                })}
            </TextField>

            <CampoAno
                label="Ano de Referencia"
                fullWidth
                value={anoReferencia}
                onChange={(e) => setAnoReferencia(e.target.value)}
                name="ano_referencia"
                error={errors?.hasOwnProperty('ano_referencia')}
                helperText={errors?.ano_referencia ?? ""}
            />

            <TextField
                variant="outlined"
                defaultValue={dados?.numero_nota}
                name="numero_nota"
                label="Número da Nota de Empenho"
                error={errors?.hasOwnProperty('numero_nota')}
                helperText={errors?.numero_nota ??  "Ex: 1234"}
                fullWidth
            />

            <CampoValores
                label="Valor de empenho"
                defaultValue={dados?.valor_empenho}
                name="valor_empenho"
                error={errors?.hasOwnProperty('valor_empenho')}
                helperText={errors?.valor_empenho}
                prefix="R$ "
                fullWidth
            />
        </Box>
    )
}