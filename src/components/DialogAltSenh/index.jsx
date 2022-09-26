import React from 'react';
import { 
    Box,
    IconButton,
    Tooltip,
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button,
    TextField,
    CircularProgress,
} from '@mui/material';
import style from './style';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const DialogAltSenh = ({openAltSenha, setOpenAltSenha, altCarregando, setAltCarregando}) => {
    return(
        <Dialog open={openAltSenha} fullWidth maxWidth="md">
            
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
                    onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = Object.fromEntries(new FormData(e.target))
                        console.log(formData)
                        //simulacao de envio
                        setAltCarregando(true)
                        await(new Promise((res, rej) => {
                            setTimeout(() => res('true'), 3000)
                        }))
                        //simulacao de envio
                        setOpenAltSenha(false)
                        setAltCarregando(false)

                    }}
                >
                    <TextField 
                        label="Email"
                        name="email"
                        id="email"
                        required
                    />

                    <TextField 
                        label="Senha Atual"
                        name="atualPw"
                        id="atualPw"
                        required
                    />

                    <TextField 
                        label="Nova Senha"
                        name="novaPw"
                        id="novaPw"
                        required
                    />

                    <TextField
                        name="novaPwConf"
                        label="Confirmação Nova Senha"
                        id="novaPwConf"
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
                        {altCarregando
                            ? <CircularProgress color="color" size="1rem" />
                            : ''
                        }
                        Salvar
                    </Button>
                </Box>
            </DialogActions>

        </Dialog>
    )
}

export default DialogAltSenh