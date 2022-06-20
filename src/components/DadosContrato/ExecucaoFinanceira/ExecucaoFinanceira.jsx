import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';

const ExecucaoFinanceira = (props) => {
    const execucao_financeira = typeof props.execucao_financeira != 'undefined' ? props.execucao_financeira : [];
    //console.log(execucao_financeira);
                    
    return (
        <Box>
            <Typography variant="h2" sx={{ fontSize: '2rem', margin: '2rem 0 0 0' }}>
                Execução Financeira do Contrato
            </Typography>

            <Box sx={{ padding: '1rem', margin: '2rem 0' }} component={Paper} elevation={3}>
                {
                    Object.keys(execucao_financeira).map((execucao) => {
                        console.log(execucao_financeira[execucao]);
                        return (
                            <Box
                                elevation={3}
                                component={Paper}
                                sx={{ padding: '1rem', mb: '2rem' }}
                            >
                                <Divider
                                    textAlign='left'
                                    sx={{
                                        fontWeight: 'light',
                                        fontSize: '1.25rem'
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
                                    Executado
                                    <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                        {props.formataValores(execucao_financeira[execucao].executado)}
                                    </Typography>
                                </Typography>
                            </Box>
                        );
                    })
                }       
            </Box>
        </Box>
    );
}

export default ExecucaoFinanceira;