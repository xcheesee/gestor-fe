import React, { useState } from 'react';
import { 
    Typography, 
    IconButton, 
    Fade, 
    Box,
    CircularProgress,
    Tooltip,
    Badge,
} from '@mui/material';
import './estilo.css';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useLocation, Link } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock'
import DialogAltSenh from '../Dialogs/DialogAltSenh';
import { newPwRequest } from '../../commom/utils/api';
import ContratosAVencerPopover from './ContratosAVencerPopover';
import DialogLogout from '../Dialogs/DialogLogout/DialogLogout';

const Header = (props) => {
    const [open, setOpen] = useState(false);
    const [carregando, setCarregando] = useState(false);
    
    const location = useLocation();
    
    const username = localStorage.getItem('username');
    
    const [qtdVencido, setQtdVencido] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [openAltSenha, setOpenAltSenha] = useState(false)
    const [altCarregando, setAltCarregando] = useState(false)
    
    const showSenhaForm = () => setOpenAltSenha(true)

    const handleLogout = () => {
        setCarregando(true);
        const url = `${process.env.REACT_APP_API_URL}/logout`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        }
        
        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setOpen(true);
                    setCarregando(false);
                } else {
                    setCarregando(false);
                    localStorage.removeItem('access_token');
                    document.location.reload();
                }
            });
    }

    const handleClick = (event) => {
        document.getElementById("btnHeader").setAttribute('style', 'background: #398E87 !important;')
        setAnchorEl(event.currentTarget);
    }

    return (
        <Box component={'header'} className="header" sx={{ background: (theme) => theme.palette.primary.main }}>
            <DialogLogout 
                open={open}
                setOpen={setOpen}
                setCarregando={setCarregando}
            />

            <DialogAltSenh
                openAltSenha={openAltSenha}
                setOpenAltSenha={setOpenAltSenha}
                carregando={altCarregando}
                setCarregando={setAltCarregando}
                pwRequest={newPwRequest} />
            
            <Link to={location.pathname === "/" ? "/" : "../principal"}>
                <Typography 
                    variant="h1" 
                    className="header__titulo" 
                    sx={{ 
                        fontSize: '1.5rem', 
                        margin: '0 0.5rem', 
                        padding: '0.5rem', 
                        color: (theme) => theme.palette.color.main 
                    }}
                >
                    Sisgecon
                </Typography>
            </Link>

            {location.pathname !== "/" && localStorage.getItem('access_token')
                && 
                <Fade in={true} timeout={500}>
                    <Box>
                        <IconButton 
                            id="btnHeader" 
                            sx={{ borderRadius: 3, boxSizing: 'border-box', padding: '0.5rem 0.8rem', mr: '0.5rem' }} 
                            onClick={handleClick}
                        >
                            <Badge color="secondary" badgeContent={qtdVencido} overlap="circular" variant="dot">
                                <AccountBoxIcon sx={{ color: (theme) => theme.palette.color.main, mr: '0.5rem' }} />
                            </Badge>

                            <Typography sx={{ color: (theme) => theme.palette.color.main }}>Olá, {username}</Typography>
                        </IconButton>

                        <ContratosAVencerPopover 
                            anchorEl={anchorEl} 
                            setAnchorEl={setAnchorEl}
                            open={menuOpen} 
                            setQtdVencido={setQtdVencido}
                        /> 

                        <Tooltip title="Alterar Senha">
                            <IconButton onClick={showSenhaForm}>
                                <LockIcon sx={{ color: (theme) => theme.palette.color.main }} fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Sair" arrow>
                            <IconButton sx={{ margin: '0 0.5rem', boxSizing: 'border-box', padding: '0.5rem' }} onClick={() => { handleLogout(); }}>
                                {carregando
                                    ? <CircularProgress size="1.5rem" sx={{ color: (theme) => theme.palette.color.main }} />
                                    : <LogoutIcon sx={{ color: (theme) => theme.palette.color.main }} />
                                }
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Fade>
            }
        </Box>
        
    );
}

export default Header;