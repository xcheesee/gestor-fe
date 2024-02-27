import { useState } from "react";
import { Box, MenuItem, TextField } from "@mui/material";
import CampoMasked from "../../CampoMasked";
import CampoValores from "../../CampoValores";
import { tipos_notas_reserva } from "../../../commom/utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { throwablePostForm } from "../../../commom/utils/api";
import { useErrorSnackbar } from "../../../commom/utils/hooks";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../../atomStore";
import { brlToFloat } from "../../../commom/utils/utils";

export function FormPostNotaReserva({
    formId,
    numContrato,
    //postMutation,
    setOpen,
    setCarregando
}) {
    const errorSnackbar = useErrorSnackbar()
    const queryClient = useQueryClient()
    const setSnackbar = useSetAtom(snackbarAtom)
    const [errors, setErrors] = useState()
    console.log(errors)

    const postMutation = useMutation({
        mutationFn: ({notaReserva, path}) => throwablePostForm({form:notaReserva, path}),
        onSuccess: (res) => {
            queryClient.invalidateQueries({queryKey: ['notas_reserva']})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Reserva enviada.", color: "success"}))
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
                postMutation.mutate({notaReserva: formData, path: 'nota_reserva'}, {
                    onSuccess: () => {
                        setOpen(false)
                        setCarregando(false)
                    }
                })
            }}
        >
            <CampoMasked
                mask="####"
                name="numero_nota_reserva"
                label="Numero da Nota de Reserva"
                error={errors?.hasOwnProperty('numero_nota_reserva')}
                helperText={errors?.numero_nota_reserva ?? ""}
            />

            <TextField
                type="date"
                name="data_emissao"
                label="Data de Emissão"
                InputLabelProps={{
                    shrink: true
                }}
                error={errors?.hasOwnProperty('data_emissao')}
                helperText={errors?.data_emissao ?? ""}
            />
            <TextField
                select
                name="tipo_nota"
                label="Tipo de Nota"
                error={errors?.hasOwnProperty('tipo_nota')}
                helperText={errors?.tipo_nota ?? ""}
            >
                {Object.entries(tipos_notas_reserva).map((tipo_nota, i) => (
                    <MenuItem value={tipo_nota[0]} key={`tipo-nota-${i}`} >{tipo_nota[1]}</MenuItem>
                ))} 
            </TextField>
            <CampoValores 
                name="valor"
                label="Valor da Nota de Reserva"
                prefix="R$ "
                error={errors?.hasOwnProperty('valor')}
                helperText={errors?.valor ?? ""}
            />
        </Box>
    )
}