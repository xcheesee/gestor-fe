import React, { useState } from 'react';
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

const DialogAltSenh = ({openAltSenha, setOpenAltSenha, altCarregando, setAltCarregando, pwRequest}) => {
    const [reqResponse, setReqResponse] = useState('')
    return(
        <Dialog open={openAltSenha} fullWidth={reqResponse === ''} maxWidth="md">
           {reqResponse === ''
                ?<>
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
                                    setAltCarregando(true)
                                    const res = await pwRequest(formData)
                                    console.log(res)
                                    setReqResponse(res)
                                    setAltCarregando(false)         
                                }}
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
                                    {altCarregando
                                        ? <CircularProgress color="color" size="1rem" />
                                        : ''
                                    }
                                    Salvar
                                </Button>
                            </Box>
                        </DialogActions>
                </>
                :<>
                    <DialogContent>{reqResponse.message}</DialogContent>
                    <DialogActions sx={{ justifyContent: 'center'}}>
                        <Box sx={{ display: 'flex', margin: '0.5rem', gap: '1rem' }}>
                            <Button
                                onClick={async () => {
                                    setOpenAltSenha(false)
                                    //timeout para evitar flicker de dialog
                                    await(new Promise((res, rej) => {
                                        setTimeout(() => res('true'), 500)
                                    }))
                                    setReqResponse('')
                                }}
                                variant="contained" sx={{ gap: '0.5rem' }}
                            >
                                Ok
                            </Button>
                        </Box>
                    </DialogActions>
                </>
            }
        </Dialog>
    )
}

export default DialogAltSenh