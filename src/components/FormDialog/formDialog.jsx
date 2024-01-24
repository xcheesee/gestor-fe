import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DialogConf from "../DialogConf";

export default function FormDialog({
    open, 
    setOpen, 
    title,
    children,
    acao,
    carregando,
    onClick,
    openConfirmar,
    setOpenConfirmar,
    tipoForm,
    formId
}) {
    return(
        <>
        <Dialog open={open} fullWidth>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>{children} </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    onClick={() => setOpen(false)}
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={onClick}  
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                    }
                    
                    {acao}
                </Button>
            </DialogActions>
        </Dialog>

        <DialogConf 
            title={`${acao} ${tipoForm}`}
            body={<Typography>Deseja {acao} a(o) {tipoForm}?</Typography>}
            formId={formId}
            open={openConfirmar}
            setOpen={setOpenConfirmar}
            acao='Enviar'
        />
        </>
    )
}