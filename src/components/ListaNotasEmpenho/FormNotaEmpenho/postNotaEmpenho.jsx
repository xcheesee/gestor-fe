import { useMutation, useQueryClient } from "@tanstack/react-query"
import { throwablePostForm, throwablePutForm } from "../../../commom/utils/api"
import { useErrorSnackbar } from "../../../commom/utils/hooks"
import { useSetAtom } from "jotai"
import { snackbarAtom } from "../../../atomStore"
import { meses } from "../../../commom/utils/constants"
import { brlToFloat } from "../../../commom/utils/utils"
import { MenuItem, TextField, Box } from "@mui/material"
import { useState } from "react"
import CampoAno from "../../CampoAno"
import CampoValores from "../../CampoValores"

export default function FormPostNotaEmpenho({
    numContrato,
    formId,
    setOpen,
    setCarregando
}) {
    const queryClient = useQueryClient()
    const errorSnackbar = useErrorSnackbar()
    const setSnackbar = useSetAtom(snackbarAtom)

    const [dataEmissao, setDataEmissao] = useState("")
    const [mesReferencia, setMesReferencia] = useState("")
    const [anoReferencia, setAnoReferencia] = useState("")
    const [errors, setErrors] = useState()

    const postMutation = useMutation({
        mutationFn: ({formData}) => throwablePostForm({form: formData, path: 'empenho_nota'}),
        onMutate: () => {
            setCarregando(true)
        },
        onSuccess: () => {
            setOpen(false)
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Nota de Empenho enviada com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries({queryKey: ['notasEmpenho', numContrato]})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
        },
        onError: (res) => {
            errorSnackbar.Post(res)
            setErrors(res.errors)
        },
        onSettled: () => setCarregando(false)
        
    })
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
                postMutation.mutate({formData})
            }}>
            <TextField
                select
                fullWidth
                label="Tipo de Empenho"
                id="tipo_empenho"
                name="tipo_empenho"
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
                onChange={(e) => {
                    setMesReferencia(e.target.value)
                }}
                error={errors?.hasOwnProperty('mes_referencia')}
                helperText={errors?.mes_referencia ?? ""}
            >
                {meses.map((mes, i) => {
                    return(
                        <MenuItem key={`mes-ref-${i}`} value={i+1} className=''>{mes}</MenuItem>

                    )
                })}
            </TextField>

            <CampoAno
                label="Ano de Referencia"
                fullWidth
                value={anoReferencia}
                onChange={(e) => {
                    setAnoReferencia(e.target.value)
                }}
                name="ano_referencia"
                error={errors?.hasOwnProperty('ano_referencia')}
                helperText={errors?.ano_referencia ?? ""}
            />

            <TextField
                variant="outlined"
                name="numero_nota"
                label="Número da Nota de Empenho"
                error={errors?.hasOwnProperty('numero_nota')}
                helperText={errors?.numero_nota ??  "Ex: 1234"}
                fullWidth
                
            />

            <CampoValores
                label="Valor de empenho"
                name="valor_empenho"
                error={errors?.hasOwnProperty('valor_empenho')}
                helperText={errors?.valor_empenho}
                fullWidth
                prefix="R$ "
            />
        </Box>
    )
}