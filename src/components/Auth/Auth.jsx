import React from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    DialogContentText, 
    Button 
} from '@mui/material';
import { useNavigate } from "react-router-dom";

const Auth = (props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("../", { replace: true });
    }

    if (localStorage.getItem('access_token')) {
        return props.children;
    } 

    return (
        <Dialog open={true} fullWidth>
            <DialogTitle>
                Sessão expirada
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Efetue o login para continuar
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClick}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default Auth;