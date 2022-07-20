import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Divider, 
    Paper,
    IconButton,
    Tooltip,
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import DialogDetalhes from './DialogDetalhes/DialogDetalhes';

const ExecucaoFinanceira = (props) => {
    const execucao_financeira = typeof props.execucao_financeira != 'undefined' ? props.execucao_financeira : [];
    const [carregando, setCarregando] = useState(false);
    const [detalheExecFin, setDetalheExecFin] = useState({});
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const detalhaExecucaoFinanceira = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/execucao_financeira/${id}`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    return res.json()
                    .then(data => { 
                        setDetalheExecFin(data.data); 
                        setOpenDetalhes(true);
                    });
                }
            })
    }

    const Conteudo = () => {
        if (Object.keys(execucao_financeira).length > 0) {
            return (
                <Box 
                    sx={{ 
                        padding: '1rem', 
                        margin: '2rem 0', 
                        display: 'flex', 
                        background: '#F8FAF8', 
                        overflow: 'auto' 
                    }} 
                    component={Paper} 
                    elevation={5}
                >
                    {Object.keys(execucao_financeira).map((execucao, index) => {
                        return (
                            <Box
                                elevation={3}
                                component={Paper}
                                sx={{ 
                                    padding: '1rem', 
                                    margin: '0 1rem', 
                                    minWidth: '16rem'
                                }}
                                key={index}
                            >
                                <Divider
                                    textAlign='right'
                                    sx={{
                                        fontWeight: 'light',
                                        fontSize: '1rem',
                                        mb: '1rem'
                                    }}
                                >
                                    {execucao_financeira[execucao].mes}
                                </Divider>
                                
                                <Box sx={{ display: 'flex' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 'medium' }} component="span">
                                            Planejado
                                            <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                                {props.formataValores(execucao_financeira[execucao].planejado)}
                                            </Typography>
                                        </Typography>
                    
                                        <Typography sx={{ fontWeight: 'medium' }} component="span">
                                            Contratado
                                            <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                                {props.formataValores(execucao_financeira[execucao].contratado)}
                                            </Typography>
                                        </Typography>
                    
                                        <Typography sx={{ fontWeight: 'medium' }} component="span">
                                            Empenhado
                                            <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                                {props.formataValores(execucao_financeira[execucao].empenhado)}
                                            </Typography>
                                        </Typography>
                    
                                        <Typography sx={{ fontWeight: 'medium' }} component="span">
                                            Executado
                                            <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                                {props.formataValores(execucao_financeira[execucao].executado)}
                                            </Typography>
                                        </Typography>
                    
                                        <Typography sx={{ fontWeight: 'medium' }} component="span">
                                            Saldo
                                            <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                                {props.formataValores(execucao_financeira[execucao].saldo)}
                                            </Typography>
                                        </Typography>
                                    </Box>
                                    
                                    <Box 
                                        sx={{ 
                                            alignSelf: 'flex-end', 
                                            width: '100%', 
                                            display: 'flex', 
                                            justifyContent: 'flex-end' 
                                        }}
                                    >
                                        <Tooltip title="Detalhes" arrow>
                                            <IconButton
                                                onClick={() => detalhaExecucaoFinanceira(execucao_financeira[execucao].id)}
                                            >
                                                {
                                                    carregando
                                                    ? <CircularProgress size="1.5rem" />
                                                    : <ManageSearchIcon />
                                                }
                                            </IconButton>
                                        </Tooltip>
                                        
                                        <Tooltip title="Editar" arrow>
                                            <IconButton>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            );
        } else {
            return (
                <Box sx={{ padding: '1rem', margin: '2rem 0', display: 'flex', background: '#FFFFFF', overflow: 'auto' }} component={Paper} elevation={5}>
                    - - -
                </Box>
            );
        }
    }
    
    return (
        <Box>
            <Typography variant="h2" sx={{ fontSize: '2rem', margin: '2rem 0 0 0' }}>
                Execução Financeira do Contrato
            </Typography>

            <Conteudo />

            <DialogDetalhes 
                detalhes={detalheExecFin}
                openDetalhes={openDetalhes}
                setOpenDetalhes={setOpenDetalhes}
                formataValores={props.formataValores}
            />
        </Box>
    );
}

export default ExecucaoFinanceira;