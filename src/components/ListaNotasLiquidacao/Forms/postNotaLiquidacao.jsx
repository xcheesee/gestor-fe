import { Box, MenuItem, TextField } from "@mui/material";
import CampoMasked from "../../CampoMasked";
import CampoValores from "../../CampoValores";
import { useState } from "react";
import { meses } from "../../../commom/utils/constants";
import { brlToFloat } from "../../../commom/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../../atomStore";
import { useErrorSnackbar } from "../../../commom/utils/hooks";
import { throwablePostForm } from "../../../commom/utils/api";

export function FormPostNotaLiquidacao({
    formId,
    numContrato,
    setCarregando,
    setOpen
}) {
    const queryClient = useQueryClient()
    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const [errors, setErrors] = useState({})
    const [dataPagamento, setDataPagamento] = useState("")
    const [mesReferencia, setMesReferencia] = useState("")
    const [anoReferencia, setAnoReferencia] = useState("")

    const postMutation = useMutation({
        mutationFn: (notaLiq) => throwablePostForm({form:notaLiq, path:'nota_liquidacao'}),
        onSuccess: (res) => {
            setOpen(false)
            setCarregando(false)
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
            queryClient.invalidateQueries({queryKey: ['notas_liquidacao']})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Liquidação enviada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Post(res)
            setCarregando(false)
            setErrors(res.errors)
        }
    })
    return(
        <Box
            className="grid gap-4 py-2"
            component="form"
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const val = formData.get('valor')
                const formatted = brlToFloat(val)
                formData.set('valor', formatted)
                formData.append('contrato_id', numContrato)
                setCarregando(true)
                postMutation.mutate(formData)
            }}
        >
            <CampoMasked
                mask="####"
                name="numero_nota_liquidacao"
                label="Numero da Nota de Liquidação"
                error={errors.hasOwnProperty('numero_nota_liquidacao')}
                helperText={errors?.numero_nota_liquidacao ?? ""}
            />

            <TextField
                type="date"
                name="data_pagamento"
                error={errors.hasOwnProperty('data_pagamento')}
                helperText={errors?.data_pagamento ?? ""}
                value={dataPagamento}
                onChange={(e) => {
                    const dataArr = e.target.value.split('-')
                    setDataPagamento(e.target.value)
                    setMesReferencia(+dataArr[1])
                    setAnoReferencia(+dataArr[0])
                }}
                label="Data de Pagamento"
                InputLabelProps={{
                    shrink: true
                }}
            />

            <TextField
                select
                fullWidth
                label="Mês de Referência"
                name='mes_referencia'
                error={errors.hasOwnProperty('mes_referencia')}
                helperText={errors?.mes_referencia ?? ""}
                value={mesReferencia}
                onChange={(e) => {
                    setMesReferencia(e.target.value)
                }}
            >
                {meses.map((mes, i) => {
                    return(
                        <MenuItem key={`mes-ref-${i+1}`} value={i+1} className=''>{mes}</MenuItem>

                    )
                })}
            </TextField>

            <CampoMasked
                label="Ano de Referência"
                fullWidth
                mask="####"
                value={anoReferencia}
                onChange={(e) => {
                    setAnoReferencia(e.target.value)
                }}
                name="ano_referencia"
                error={errors.hasOwnProperty('ano_referencia')}
                helperText={errors?.ano_referencia ?? ""}
            />

            <CampoValores 
                name="valor"
                label="Valor da Nota de Liquidação"
                prefix="R$ "
                error={errors.hasOwnProperty('valor')}
                helperText={errors?.valor ?? ""}
            />
        </Box>
    )
}