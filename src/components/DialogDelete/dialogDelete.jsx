import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";
import { throwableDeleteForm } from "../../commom/utils/api";
import { useErrorSnackbar } from "../../commom/utils/hooks";

export default function DialogDelete({
    tipo_op="", 
    id,
    carregando,
    setCarregando,
    open,
    setOpen,
    deletePath,
    queryKeys,
    onSucc=()=>{}
}) {
    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: ({id}) => throwableDeleteForm({id: id, path: deletePath}),
        onSuccess: () => {
            setOpen(false)
            setCarregando(false)
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: `${tipo_op} excluído(a).`, color: "success"}))
            queryKeys.forEach(key => {
                queryClient.invalidateQueries([key])
            })
            onSucc()

        },
        onError: (res) => {
            errorSnackbar.Delete(res)
            setCarregando(false)
        }
    })

    return(
        <Dialog open={open} fullWidth className='p-4'>
            <DialogTitle>
                Excluir {tipo_op}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Confirma a exclusão: 
                        <strong> {tipo_op[0]?.toUpperCase() + tipo_op?.substring(1)} {`#${id}`}</strong>?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button 
                    className='text-neutral-600'
                    sx={{ textTransform: 'none' }} 
                    onClick={ () => { setOpen(false) } }
                >
                    Cancelar
                </Button>
                <Button 
                    className='bg-red-600'
                    variant='contained'
                    sx={{ textTransform: 'none' }}
                    onClick={() => {
                        deleteMutation.mutate({id})
                        setCarregando(true)
                    }}
                >
                    {carregando
                        ? <CircularProgress size={14} sx={{ mr: '0.3rem' }} color="color" /> 
                        : ""
                    }
                    Excluir
                </Button>
            </DialogActions>
        </Dialog>
    )
}