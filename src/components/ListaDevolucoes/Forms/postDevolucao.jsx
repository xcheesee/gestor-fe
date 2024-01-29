import { Box, TextField } from "@mui/material";
import CampoMasked from "../../CampoMasked";
import CampoValores from "../../CampoValores";
import { brlToFloat } from "../../../commom/utils/utils";
import { useErrorSnackbar } from "../../../commom/utils/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../../atomStore";
import { throwablePostForm } from "../../../commom/utils/api";

export function FormPostDevolucao({
    formId,
    numContrato,
    //postMutation,
    setOpen,
    setCarregando
}) {
    const errorSnackbar = useErrorSnackbar()
    const queryClient = useQueryClient()
    const setSnackbar = useSetAtom(snackbarAtom)

    const postMutation = useMutation({
        mutationFn: (formData) => throwablePostForm({form:formData, path:'devolucao'}),
        onSuccess: (res) => {
            //setOpenPostForm(false)
            queryClient.invalidateQueries({queryKey: ['devolucoes']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Devolução enviada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Post(res)
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
                postMutation.mutate(formData, {
                    onSuccess: () => {
                        setOpen(false)
                        setCarregando(false)
                    },
                    onError: () => {
                        setCarregando(false)
                    }
                })
            }}
        >
            <CampoMasked
                mask="##.####"
                name="numero_devolucao"
                label="Numero de Devolução"
            />

            <TextField
                type="date"
                name="data_devolucao"
                label="Data de Devolução"
                InputLabelProps={{
                    shrink: true
                }}
            />

            <CampoValores 
                name="valor"
                label="Valor da Devolução"
                prefix="R$ "
            />
        </Box>
    )
}