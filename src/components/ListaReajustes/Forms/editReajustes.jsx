import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorSnackbar } from "../../../commom/utils/hooks";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../../atomStore";
import { throwablePutForm } from "../../../commom/utils/api";
import { Box, TextField } from "@mui/material";
import CampoValores from "../../CampoValores";
import CampoData from "../../CampoData";
import { reajusteLabels } from "../../../commom/utils/constants";
import { brlToFloat } from "../../../commom/utils/utils";
import { useState } from "react";

export default function FormEditReajustes({
    dados,
    setOpen,
    setCarregando,
    formId,
    numContrato
}) {
    const queryClient = useQueryClient()
    const errorSnackbar = useErrorSnackbar()
    const setSnackbar = useSetAtom(snackbarAtom)

    const [errors, setErrors] = useState({})

    const putMutation = useMutation({
        mutationFn: async ({id, formData}) => await throwablePutForm({id, form:formData, path:"reajuste"}), 
        onSuccess: async (res) => {
            setCarregando(false)
            setOpen(false)
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Reajuste editado com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries(['reajuste'])
            queryClient.invalidateQueries(['mesesExecutados'])
        },
        onError: async (res) => {
            setCarregando(false)
            errorSnackbar.Put(res)
            setErrors(res.errors)
        }
    })

    return(
        <Box
            className="grid gap-8 py-2"
            component="form"
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const val = formData.get('valor_reajuste')
                const formatted = brlToFloat(val)
                formData.set('valor_reajuste', formatted)
                formData.append('contrato_id', numContrato)
                setCarregando(true)
                putMutation.mutate({id:dados.id, formData:formData}, {
                    onSuccess: () => {
                        setOpen(false)
                        setCarregando(false)
                    }
                })
            }}
        >
            <CampoValores
                defaultValue={dados.valor_reajuste}
                name="valor_reajuste"
                label={reajusteLabels.valor_reajuste}
                checaErros={() => {}}
                prefix="R$ "
                error={errors?.hasOwnProperty('valor_reajuste')}
                helperText={errors?.valor_reajuste ?? "Ex: "}
                fullWidth
                
            />
            <TextField
                variant="outlined"
                defaultValue={dados.indice_reajuste}
                name="indice_reajuste"
                label={reajusteLabels.indice_reajuste}
                error={errors?.hasOwnProperty('indice_reajuste')}
                helperText={errors.indice_reajuste ?? "Ex: "}
                fullWidth
                
            />

            <CampoData
                label="Data Reajuste"
                defaultValue={dados.data_reajuste}
                name="data_reajuste"
                error={errors?.hasOwnProperty('data_reajuste')}
                helperText={errors?.data_reajuste ?? ""}
                fullWidth
                
            />
        </Box>
    )

}