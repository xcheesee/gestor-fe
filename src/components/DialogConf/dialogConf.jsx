import { 
    Dialog, 
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

export default function DialogConf({
    open,
    setOpen,
    title,
    body,
    formId,
    acao,
}) {
    return(
        <Dialog open={open} fullWidth>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {body}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button 
                    sx={{ textTransform: 'none', color: '#821f1f' }} 
                    onClick={ () => { setOpen({open: false, acao: ""}) } }
                >
                    Cancelar
                </Button>
                <Button 
                    sx={{ textTransform: 'none' }}  
                    type='submit'
                    form={formId}
                    onClick={(e) => { setOpen({open: false, acao: ""}); }}
                >
                    {acao}
                </Button>
            </DialogActions>
        </Dialog>
    )
}