import { useMutation, useQueryClient } from "@tanstack/react-query"
import { throwablePutForm } from "../../../commom/utils/api"
import { useErrorSnackbar } from "../../../commom/utils/hooks"
import { useSetAtom } from "jotai"
import { snackbarAtom } from "../../../atomStore"
import { meses } from "../../../commom/utils/constants"
import { brlToFloat } from "../../../commom/utils/utils"
import { Box, TextField, MenuItem } from "@mui/material"
import CampoAno from "../../CampoAno"
import CampoValores from "../../CampoValores"
import { useState } from "react"

export default function FormEditNotaEmpenho({
    numContrato,
    formId,
    dados,
    setOpen,
    setCarregando
}) {
    const queryClient = useQueryClient()
    const errorSnackbar = useErrorSnackbar()
    const setSnackbar = useSetAtom(snackbarAtom)

    const [dataEmissao, setDataEmissao] = useState(dados?.data_emissao ?? "")
    const [mesReferencia, setMesReferencia] = useState(dados?.mes_referencia ?? "")
    const [anoReferencia, setAnoReferencia] = useState(dados.ano_referencia ?? "")

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({id: id, form: formData, path: 'empenho_nota'}),
        onMutate: () => {
            setCarregando(true)
        },
        onSuccess: () => {
            setOpen(false)
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Nota de Empenho editada com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries({queryKey: ['notasEmpenho', numContrato]})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
        },
        onError: (res) => {
            errorSnackbar.Put(res)
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
                const val = formData.get('valor')
                const formatted = brlToFloat(val)
                formData.set('valor', formatted)
                editMutation.mutate({formData, id: dados.id})
            }}>

            <TextField
                select
                fullWidth
                required
                label="Tipo de Empenho"
                id="tipo_empenho"
                defaultValue={dados.tipo_empenho}
            >
                <MenuItem value={"complemento"}>Complemento</MenuItem>
                <MenuItem value={"cancelamento"}>Cancelamento</MenuItem>
                <MenuItem value={"novo_empenho"}>Novo Empenho</MenuItem>
            </TextField>

            <TextField
                label="Data de Emissão da Nota"
                type='date'
                name="data_emissao"
                value={dataEmissao}
                onChange={(e) => {
                    setDataEmissao(e.target.value)
                    const arrData = e.target.value?.split("-")
                    setMesReferencia(+arrData[1]-1)
                    setAnoReferencia(+arrData[0])
                }}
                //error={errors.hasOwnProperty('data_emissao')}
                //helperText={errors?.data_emissao}
                InputLabelProps={{ shrink: true}}
                fullWidth
                required
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
            >
                {meses.map((mes, i) => {
                    return(
                        <MenuItem key={`mes-ref-${i}`} value={i} className=''>{mes}</MenuItem>

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
            />

            <TextField
                variant="outlined"
                defaultValue={dados.numero_nota}
                name="numero_nota"
                label="Número da Nota de Empenho"
                //error={errors?.hasOwnProperty('numero_nota')}
                //helperText={errors?.numero_nota ??  "Ex: 1234"}
                fullWidth
                required
            />

            <CampoValores
                label="Valor de empenho"
                defaultValue={dados.valor_empenho}
                name="valor_empenho"
                prefix="R$ "
                //checaErros={() => {}}
                //error={errors?.hasOwnProperty('valor_garantia')}
                //helperText={errors?.valor_empenho}
                required
                fullWidth
            />
        </Box>
    )
}