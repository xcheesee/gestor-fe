import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

export default function FormDialog({
    open, 
    setOpen, 
    title,
    children,
    acao,
    carregando,
    setOpenConfirmar,
}) {
    //const [openConfirmar, setOpenConfirmar] = useState(false)
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
                    onClick={() => setOpenConfirmar({open: true, acao: acao})}  
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                    }
                    
                    {acao}
                </Button>
            </DialogActions>
        </Dialog>

        {/*<DialogConf 
            title={`${acao} ${tipoForm}`}
            body={<Typography>Deseja {acao} o(a) {tipoForm}?</Typography>}
            formId={formId}
            open={openConfirmar}
            setOpen={setOpenConfirmar}
            acao='Enviar'
        />*/}
        </>
    )
}