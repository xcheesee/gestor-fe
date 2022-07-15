import React from 'react';
import { 
    Box, 
    Typography, 
    Divider, 
    Paper,
    IconButton,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const ExecucaoFinanceira = (props) => {
    const execucao_financeira = typeof props.execucao_financeira != 'undefined' ? props.execucao_financeira : [];

    const Conteudo = () => {
        if (Object.keys(execucao_financeira).length > 0) {
            return (
                <Box sx={{ padding: '1rem', margin: '2rem 0', display: 'flex', background: '#F8FAF8', overflow: 'auto' }} component={Paper} elevation={5}>
                    {Object.keys(execucao_financeira).map((execucao, index) => {
                        return (
                            <Box
                                elevation={3}
                                component={Paper}
                                sx={{ padding: '1rem', margin: '0 1rem', minWidth: '11.25rem' }}
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
                                
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Tooltip title="Editar" arrow>
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
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
        </Box>
    );
}

export default ExecucaoFinanceira;