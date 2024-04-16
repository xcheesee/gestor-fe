import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DialogLogout = ({
    open, 
    setOpen,
    setCarregando
}) => {
    const navigate = useNavigate()

    const handleClickConfirma = () => {
        navigate("../", { replace: true }); 
        setOpen(false); 
        setCarregando(false); 
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('departamentos');
    }

    return (
        <Dialog open={open} fullWidth>
            <DialogContent sx={{ mt: '1rem' }}>
                <DialogContentText>
                    Logout efetuado com sucesso!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickConfirma}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogLogout