import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from "@mui/material";
import { useState } from "react";

export default function DialogDelete({
    tipo_op, 
    id,
    fnDelete,
    carregando,
    open,
    setOpen
}) {
    return(
        <Dialog open={open} fullWidth className='p-4'>
            <DialogTitle>
                Excluir {tipo_op}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Confirma a exclusão: 
                        <strong> {tipo_op[0].toUpperCase() + tipo_op.substring(1)} {`#${id}`}</strong>?
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
                    onClick={() => fnDelete(id)}
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