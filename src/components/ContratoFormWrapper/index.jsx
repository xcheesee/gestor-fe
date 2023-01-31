import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { Box } from "@mui/system";

export default function ContratoFormWrapper({open, acao, title, form, setFormDialog, children}) {
    let carregando = false
    return(
        <Dialog open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Box className="mb-4 mr-4">

                <Button
                    onClick={() => setFormDialog(false)}
                    sx={{ textTransform: 'none', mr: '1rem', color: (theme) => theme.palette.error.main }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                </Button>

                <Button
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    type={acao === 'adicionar' ? "submit" : ""}
                    form={acao === 'adicionar' ? `${form}` : ""}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small"/> 
                    }

                    {acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}