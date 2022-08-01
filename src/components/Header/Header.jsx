import React, { useState, useEffect } from 'react';
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
    Tooltip,
    Badge,
    Menu,
    FormGroup,
    Paper,
    Table,
    TableContainer,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import './estilo.css';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Header = (props) => {
    const [open, setOpen] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem('username');
    const accessToken = localStorage.getItem('access_token');

    const [contratoVencido, setContratoVencido] = useState();
    const [qtdVencido, setQtdVencido] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [estaCarregado, setEstaCarregado] = useState(false);

    const handleClickConfirma = () => {
        navigate("../", { replace: true }); 
        setOpen(false); 
        setCarregando(false); 
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('departamentos');
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

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/contratos_vencimento`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        if (token) {
            fetch(url, options)
                .then(res => res.json())
                .then(data => {
                    console.log(data.data);
                    setContratoVencido(data.data);
                    setQtdVencido(data.data.length);
                    setEstaCarregado(true);
                });
        }
    }, [accessToken])

    const handleClick = (event) => {
        document.getElementById("btnHeader").setAttribute('style', 'background: #398E87 !important;')
        setAnchorEl(event.currentTarget);
        console.log(event.currentTarget);
    }

    const handleClose = () => {
        document.getElementById("btnHeader").removeAttribute('style', 'background')
        setAnchorEl(null);
    }

    const stopPropagationParaTab = (evento) => {
        if (evento.key === "Tab") {
            evento.stopPropagation();
        }
    }

    
    const MenuContratoVencido = () => {
        const rows = [];
        console.log(contratoVencido);
        Object.values(contratoVencido).map((contrato, index) => {
            return rows.push(
                {   
                    id: contrato.id, 
                    numero_contrato: contrato.numero_contrato, 
                    processo_sei: contrato.processo_sei,
                    meses_ate_vencimento: contrato.meses_ate_vencimento
                }
            );
        });
        return (
            <div className="notificacao">
                <Menu
                    id="menu-filtros"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                    sx={{ position: 'fixed', '& .MuiMenu-paper': { top: '50px !important' } }}
                    disableScrollLock={true}
                >
                    <FormGroup tabIndex={-1} onKeyDown={stopPropagationParaTab} sx={{ marginBottom: "-8px"}}>
                        <Typography 
                            variant="h2" 
                            className="header__titulo" 
                            sx={{ 
                                fontSize: '1.2rem', 
                                margin: '0 auto', 
                                padding: '0',
                                marginTop: '5px',
                                cursor: 'defaut'
                            }}
                        >
                            Contratos a vencer
                        </Typography>
                                    
                        <TableContainer component={Paper} elevation={3} sx={{ width: '100%', margin: '1rem auto 0 auto'}}>
                            <Table size="small">
                                <TableBody>
                                    {rows.map((row, index) => {
                                        const background = { background: index % 2 === 0 ? '#FFFFFF' : '#f3f6f3', borderBottom: 0 };
                                        return (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center" sx={background}>{row.numero_contrato}</TableCell>
                                                <TableCell align="center" sx={background}>{row.processo_sei}</TableCell>
                                                <TableCell align="center" sx={background}>{row.meses_ate_vencimento}</TableCell>
                                                <TableCell align="center" sx={background}>
                                                    <Link to={`../contrato/${row.id}`} onClick={handleClose}>
                                                        <IconButton>
                                                            <ManageSearchIcon />
                                                        </IconButton>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </FormGroup>       
                </Menu>
            </div>
        );
    }

    return (
        <Box component={'header'} className="header" sx={{ background: (theme) => theme.palette.primary.main }}>
            <DialogLogout />
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
                ? 
                <Fade in={true} timeout={500}>
                    <Box>
                        <IconButton id="btnHeader" sx={{ borderRadius: 3, boxSizing: 'border-box', padding: '0.5rem 0.8rem', mr: '0.5rem' }} onClick={handleClick}>
                            <Badge color="secondary" badgeContent={qtdVencido} overlap="circular" variant="dot">
                                <AccountBoxIcon sx={{ color: (theme) => theme.palette.color.main, mr: '0.5rem' }} />
                            </Badge>
                            <Typography sx={{ color: (theme) => theme.palette.color.main }}>Olá, {username}</Typography>
                        </IconButton>
                        { estaCarregado &&
                            <MenuContratoVencido />
                        }
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
                :
                ""
            }
        </Box>
    );
}

export default Header;