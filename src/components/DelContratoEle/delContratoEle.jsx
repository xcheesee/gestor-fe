import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { throwableDeleteForm } from '../../commom/utils/api';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useErrorSnackbar } from '../../commom/utils/hooks';
export default function DelContratoEle({numContrato}) {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const delContrato = useMutation({
        mutationKey: ['contrato', numContrato],
        mutationFn: ({id}) => throwableDeleteForm({id: id, path: 'contrato/ativo'}),
        onSuccess: (res) => {
            setSnackbar(prev => ({...prev, open: true, message: res.mensagem, severity: 'success'}))
            navigate('/contrato') 
        },
        onError: (res) => {
            errorSnackbar.Delete(res)
        }
    })

    return(
        <>
            <Button 
                variant='contained' 
                className='bg-red-600 py-2 flex gap-2'
                onClick={() => setOpen(true)}
            >
                <DeleteIcon />
                Excluir Contrato
            </Button>
            <Dialog open={open}>
                <DialogTitle className='text-center'>Excluir Contrato</DialogTitle>
                <DialogContent className='pt-4'>
                    <Typography>Confirma a exclusão: <span className='font-bold'>Contrato #{numContrato}</span>?</Typography>
                </DialogContent>
                <DialogActions>
                    <Box className='flex justify-end gap-4 p-2'>
                        <Button onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button 
                            variant='contained' 
                            className='bg-red-600'
                            onClick={async () => {
                                await delContrato.mutateAsync({id: numContrato})
                                setOpen(false)
                            }}
                        >
                            {delContrato.isLoading
                                ?<CircularProgress className='text-white'  size={24} />
                                : "Excluir"
                            }
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    )
}