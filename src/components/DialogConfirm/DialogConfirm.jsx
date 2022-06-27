import React from 'react';
import { 
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


const DialogConfirm = (props) => {
    const { 
        openConfirm, 
        handleCloseConfirm, 
        handleClickEnviarFormulario, 
        acao, 
        carregando, 
        numContrato 
    } = props;

    const mensagem = acao === 'editar' ? `Confirma a edição do contrato # ${numContrato}?` : 'Confirma o envio do novo contrato?'

    return (
        <Dialog open={openConfirm} onClose={handleCloseConfirm} fullWidth>
            <DialogContent>
                <DialogContentText sx={{ mt: '1rem' }}>{mensagem}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button sx={{ textTransform: 'none', color: (theme) => theme.palette.error.main }} onClick={handleCloseConfirm}>
                    <CloseIcon fontSize="small" sx={{ mr: '0.2rem' }} /> Não
                </Button>
                <Button sx={{ textTransform: 'none', color: (theme) => theme.palette.success.main }} onClick={handleClickEnviarFormulario}>
                    {carregando
                        ? <CircularProgress size={16} sx={{ mr: '0.4rem' }} />
                        : <CheckIcon fontSize="small" sx={{ mr: '0.2rem' }} />
                    }
                    Sim
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogConfirm;