import React from 'react';
import { 
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

const DialogErroEnvio = ({ openErro, setOpenErro, acao }) => {
    return (
        <Dialog 
            open={openErro.open} 
            onClose={() => { 
                setOpenErro({ ...openErro, open: false }); 
            }}
        >
            <DialogContent>
                <DialogContentText sx={{ mt: '1rem' }}>
                    <strong>Erro {openErro.status}:</strong> Não foi possível {acao} o contrato. {openErro.status === 422 ? "Revise os dados informados e tente novamente" : ""}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={() => { 
                        setOpenErro({ ...openErro, open: false }); 
                    }} 
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogErroEnvio;