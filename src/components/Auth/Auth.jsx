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

    if (sessionStorage.getItem('access_token')) {
        return props.children
    } else {
        return (
            <Dialog open={true} fullWidth>
                <DialogTitle>
                    Não autorizado
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
}

export default Auth;