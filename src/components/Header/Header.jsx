import React, { useState } from 'react';
import { 
    Typography, 
    IconButton, 
    Fade, 
    Box,
    Dialog, 
    DialogContent, 
    DialogActions, 
    DialogContentText, 
    Button,
    CircularProgress,
    Tooltip
} from '@mui/material';
import './estilo.css';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Header = (props) => {
    const [open, setOpen] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const username = sessionStorage.getItem('username');

    const handleClickConfirma = () => {
        navigate("../", { replace: true }); 
        setOpen(false); 
        setCarregando(false); 
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('username');
    }

    const DialogLogout = () => {
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

    const handleLogout = () => {
        setCarregando(true);
        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api/logout`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
            }
        }
        
        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setOpen(true);
                    setCarregando(false);
                } 
            });
    }

    return (
        <Box sx={{ minHeight: '72px', mb: '1rem' }}>
            <Box component={'header'} className="header" sx={{ background: (theme) => theme.palette.primary.main }}>
                <DialogLogout />
                <Link to="../principal">
                    <Typography variant="h1" className="header__titulo" sx={{ fontSize: '1.5rem', margin: '0 0.5rem', padding: '0 0.5rem', color: (theme) => theme.palette.color.main }}>Sisgecon</Typography>
                </Link>
                {location.pathname !== "/" && sessionStorage.getItem('access_token')
                    ? 
                    <Fade in={true} timeout={500}>
                        <Box>
                            <IconButton sx={{ margin: '0 0.5rem', borderRadius: 3 }}>
                                <AccountBoxIcon sx={{ color: (theme) => theme.palette.color.main }} />
                                <Typography sx={{ margin: '0 0.5rem', color: (theme) => theme.palette.color.main }}>Olá, {username}</Typography>
                            </IconButton>
                            <Tooltip title="Sair" arrow>
                                <IconButton sx={{ margin: '0 0.5rem' }} onClick={() => { handleLogout(); }}>
                                    {carregando
                                        ? <CircularProgress size={24} sx={{ color: (theme) => theme.palette.color.main }} />
                                        : <LogoutIcon sx={{ color: (theme) => theme.palette.color.main }} />
                                    }
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Fade>
                    :
                    ""
                }
            </Box>
        </Box>
    );
}

export default Header;