import { Box, TextField } from "@mui/material";
import CampoMasked from "../../CampoMasked";
import CampoValores from "../../CampoValores";
import { brlToFloat } from "../../../commom/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../../atomStore";
import { useErrorSnackbar } from "../../../commom/utils/hooks";
import { throwablePutForm } from "../../../commom/utils/api";

export function FormEditDevolucao({
    formId,
    numContrato,
    dados,
    //editMutation,
    setOpen,
    setCarregando
}) {
    const queryClient = useQueryClient()
    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar();

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form:formData, path:'devolucao', id}),
        onSuccess: (res) => {
            queryClient.invalidateQueries({queryKey: ['devolucoes']})
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Devolução editada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Put(res)
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
                editMutation.mutate({formData, id: dados.id}, {
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
                defaultValue={dados?.numero_devolucao}
            />

            <TextField
                type="date"
                name="data_devolucao"
                label="Data de Devolução"
                defaultValue={dados?.data_devolucao ?? ""}
                InputLabelProps={{
                    shrink: true
                }}
            />

            <CampoValores 
                name="valor"
                label="Valor da Devolução"
                defaultValue={dados.valor}
                prefix="R$ "
            />
        </Box>
    )
}