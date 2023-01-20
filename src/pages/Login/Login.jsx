import React, { useEffect, useState } from 'react';
import './estilo.css';
import { 
    Paper, 
    Typography, 
    TextField, 
    Box, 
    Button, 
    InputAdornment, 
    IconButton, 
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { sendPWData } from '../../components/utils/api';

const Login = () => {
    // const [email, setEmail] = useState("");
    // const [senha, setSenha] = useState("");
    const [mostraSenha, setMostraSenha] = useState(false);
    const [error, setError] = useState({
        error: false,
        helperText: ''
    });
    const [dialogErro, setDialogErro] = useState({
        open: false,
        message: ''
    });
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            navigate("../principal", { replace: true });
        }
    }, [navigate]);

    // const handleChange = (e) => {
    //     setError({
    //         error: false,
    //         helperText: ''
    //     });

    //     if (e.target.name === "email") {
    //         setEmail(e.target.value);
    //     } else {
    //         setSenha(e.target.value);
    //     }
    // }

    // const handleClickEntrar = (e) => {

    //     setCarregando(true);

    //     if (data.access_token) {
    //         localStorage.setItem('access_token', data.access_token);
    //         localStorage.setItem('username', data.username);
    //         localStorage.setItem('departamentos', JSON.stringify(data.departamentos));
    //         localStorage.setItem('usermail', email)
    //         navigate("../principal", { replace: true });
    //     } else {
    //         setError({
    //             error: true,
    //             helperText: 'Usuário e/ou senha inválido(s)'
    //         });
    //         setCarregando(false);
    //     }

        // fetch(url, options)
        //     .then(res => res.json())
        //     .then((data) => {
        //         if (data.access_token) {
        //             localStorage.setItem('access_token', data.access_token);
        //             localStorage.setItem('username', data.username);
        //             localStorage.setItem('departamentos', JSON.stringify(data.departamentos));
        //             localStorage.setItem('usermail', email)
        //             navigate("../principal", { replace: true });
        //         } else {
        //             setError({
        //                 error: true,
        //                 helperText: 'Usuário e/ou senha inválido(s)'
        //             });
        //             setCarregando(false);
        //         }
        //     })
        //     .catch((err) => {
        //         setDialogErro({
        //             open: true,
        //             message: `${err.message}`
        //         });
        //         setCarregando(false);
        //     })
    // }

    const handleClickMostraSenha = (e) => {
        e.preventDefault();
        setMostraSenha(!mostraSenha);
    }

    return (
        <Box className="login__container">
            <Fade in={true}>
                <Box 
                    component='form'
                    onSubmit={async (e) => {
                        e.preventDefault()

                        setCarregando(true);
                        const data = await sendPWData(e)
                        if (data.data.access_token) {
                            localStorage.setItem('access_token', data.data.access_token);
                            localStorage.setItem('username', data.data.username);
                            localStorage.setItem('departamentos', JSON.stringify(data.data.departamentos));
                            localStorage.setItem('usermail', data.userMail.email)
                            navigate("../principal", { replace: true });
                        } else {
                            setError({
                                error: true,
                                helperText: 'Usuário e/ou senha inválido(s)'
                            });
                        }
                        setCarregando(false);
                    }}>
                    <Paper sx={{ padding: '1rem' }} className="login" elevation={5}>
                        <Typography variant="h2" component="h1" sx={{ fontSize: '2rem' }}>Entrar</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '1rem 1rem 0 1rem' }}>
                            <EmailIcon sx={{ mr: '1rem', color: 'action.active', fontSize: "1.5rem" }} />
                            <TextField
                                // value={email}
                                label="E-mail"
                                sx={{ margin: '1rem 0'}}
                                fullWidth
                                name="email"
                                type="email"
                                // onChange={handleChange}
                                error={error.error}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                            <LockIcon sx={{ mr: '1rem', color: 'action.active', fontSize: "1.5rem" }} />
                            <TextField
                                // value={senha}
                                label="Senha"
                                sx={{ margin: '1rem 0' }}
                                fullWidth
                                name="password"
                                type={mostraSenha ? 'text' : 'password'}
                                // onChange={handleChange}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="start">
                                            <IconButton
                                                onClick={handleClickMostraSenha}
                                                edge="end"
                                            >
                                            {mostraSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                }}
                                error={error.error}
                                helperText={error.helperText}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.type !== 'button') {
                                        // handleClickEntrar();
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem' }}>
                            <CircularProgress sx={{ mr: '1rem', visibility: carregando ? 'visible' : 'hidden' }} size={20} />
                            <Button
                                variant="contained"
                                type='submit'
                                sx={{ color: 'white', textTransform: 'none', fontSize: '1rem' }}
                                // onClick={handleClickEntrar}
                                disabled={carregando}
                            >
                                Entrar
                            </Button>
                        </Box>
                        <Dialog open={dialogErro.open} onClick={() => { setDialogErro({open: false, message: ''}); }} fullWidth>
                            <DialogTitle>Erro ao logar</DialogTitle>
                            <DialogContent>
                                <DialogContentText sx={{ mt: '1rem' }}>
                                    Tivemos um problema: <br/> <br/>
                                    <strong style={{ color: '#821f1f' }}>{dialogErro.message}</strong> <br/> <br/>
                                    Tente novamente mais tarde. Caso o problema persista, contate o administrador do sistema.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button sx={{ textTransform: 'none' }} onClick={() => { setDialogErro({open: false, message: ''}); }}>
                                    OK
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Box sx={{ margin: '1rem', border: '1px solid #cdcdcd', borderRadius: '3px' }}>
                            <Typography sx={{ padding: '1rem' }}>
                                <strong>Importante</strong>: Se este for o seu primeiro acesso, recomendamos que troque a senha.
                                Para isso, após efetuar o login, basta clicar no ícone de senha localizado ao lado do nome de usuário.
                            </Typography>
                            <Typography sx={{ padding: '1rem' }}>
                                Caso tenha esquecido sua senha ou precise criar um usuário para acesso, favor enviar e-mail para <strong>tisvma@prefeitura.sp.gov.br</strong>.
                                No e-mail, informe o serviço a ser solicitado (esqueci a senha/criar usuário), o e-mail, caso esteja solicitando o serviço para terceiro,
                                e o sistema (<strong>Gestor de Contratos</strong>).
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Fade>
        </Box>
    );
}

export default Login;