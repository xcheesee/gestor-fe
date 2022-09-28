import React from 'react';
import { 
    Box,
    IconButton,
    Tooltip,
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button,
    TextField,
    CircularProgress,
} from '@mui/material';
import style from './style';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const SenhaForm = (props) => {
    const {setOpenAltSenha, carregando, setCarregando, pwRequest, setReqResponse} = props
    
    const sendData = async (e) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.target))
        setCarregando(true)
        console.log(formData)
        const res = await pwRequest(formData)
        setReqResponse(res)
        setCarregando(false)         
    }

    return (
        <>
            <DialogTitle>
                <Tooltip title="Voltar">
                    <IconButton onClick={() => setOpenAltSenha(false)}>
                        <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                Alterar Senha
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={style.gridAlt}
                    component="form"
                    id="senha"
                    name="senha"
                    onSubmit={async (e) => sendData(e)}
                >
                    <TextField
                        label="Email"
                        name="email"
                        id="email"
                        value={localStorage.getItem('usermail')}
                        disabled
                    />
                    <TextField
                        label="Senha Atual"
                        name="password"
                        id="password"
                        type="password"
                        required
                    />
                    <TextField
                        label="Nova Senha"
                        name="newpassword"
                        type="password"
                        id="newpassword"
                        required
                    />
                    <TextField
                        name="password_confirmation"
                        label="Confirmação Nova Senha"
                        type="password"
                        id="password_confirmation"
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between' , padding: "0 0 1rem 2rem"}}>
                <Box sx={{ display: 'flex', margin: '0.5rem', gap: '1rem' }}>
                    <Button
                        type="submit"
                        form="senha"
                        variant="contained" sx={{ gap: '0.5rem' }}
                    >
                        {carregando
                            ? <CircularProgress color="color" size="1rem" />
                            : ''
                        }
                        Salvar
                    </Button>
                </Box>
            </DialogActions>
        </>
    )
}

export default SenhaForm