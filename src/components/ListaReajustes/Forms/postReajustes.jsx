import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorSnackbar } from "../../../commom/utils/hooks";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../../atomStore";
import { throwablePostForm } from "../../../commom/utils/api";
import { Box, TextField } from "@mui/material";
import CampoValores from "../../CampoValores";
import CampoData from "../../CampoData";
import { reajusteLabels } from "../../../commom/utils/constants";
import { brlToFloat } from "../../../commom/utils/utils";

export default function FormPostReajustes({
    setOpen,
    setCarregando,
    formId,
    numContrato
}) {
    const errorSnackbar = useErrorSnackbar()
    const queryClient = useQueryClient()
    const setSnackbar = useSetAtom(snackbarAtom)

    const postMutation = useMutation({
        mutationFn: async (formData) => {
                return await throwablePostForm({form:formData, path: 'reajuste'})
        }, 
        onSuccess: async (res) => {
            setOpen(false)
            setCarregando(false)
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Reajuste criado com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries(['reajuste', numContrato])
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
        },
        onError: async (res) => {
            setCarregando(false)
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
                const val = formData.get('valor_reajuste')
                const formatted = brlToFloat(val)
                formData.set('valor_reajuste', formatted)
                
                formData.append('contrato_id', numContrato)
                setCarregando(true)
                postMutation.mutate(formData, {
                    onSuccess: () => {
                        setOpen(false)
                        setCarregando(false)
                    }
                })
            }}
        >
            <CampoValores
                name="valor_reajuste"
                label={reajusteLabels.valor_reajuste}
                checaErros={() => {}}
                prefix="R$ "
                //error={errors.hasOwnProperty('valor_reajuste')}
                //helperText={errors.hasOwnProperty('valor_reajuste') ? errors : "Ex: "}
                fullWidth
                required
            />
            <TextField
                variant="outlined"
                name="indice_reajuste"
                label={reajusteLabels.indice_reajuste}
                //error={errors.hasOwnProperty('indice_reajuste')}
                //helperText={errors.hasOwnProperty('indice_reajuste') ? errors : "Ex: "}
                fullWidth
                required
            />

            <CampoData
                label="Data Reajuste"
                name="data_reajuste"
                //error={errors.hasOwnProperty('data_reajuste')}
                //helperText={errors.data_reajuste}
                fullWidth
                required
            />
        </Box>
    )

}