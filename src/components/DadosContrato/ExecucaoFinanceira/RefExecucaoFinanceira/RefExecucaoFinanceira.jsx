import React from 'react';
import { 
    Box,
    Typography 
} from '@mui/material';

const RefExecucaoFinanceira = (props) => {
    const { totais, formataValores } = props;

    return (
        <Box 
            sx={{
                border: '1px solid #cdcdcd', 
                borderRadius: '3px',
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                columnGap: '2rem',
                rowGap: '2rem',
                mb: '2rem'
            }}
        >
            <Typography sx={{ fontWeight: 'medium' }} component="span">
                Valor do contrato
                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                    {formataValores(totais.valor_contrato)}
                </Typography>
            </Typography>
            
            <Typography sx={{ fontWeight: 'medium' }} component="span">
                Valor de reserva
                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                    {formataValores(totais.valor_reserva)}
                </Typography>
            </Typography>
            
            <Typography sx={{ fontWeight: 'medium' }} component="span">
                Valor das dotações
                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                    {formataValores(totais.valor_dotacoes)}
                </Typography>
            </Typography>

            <Typography sx={{ fontWeight: 'medium' }} component="span">
                Valor total de empenho
                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                    {formataValores(totais.valor_empenhos)}
                </Typography>
            </Typography>

            <Typography sx={{ fontWeight: 'medium' }} component="span">
                Total planejado
                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                    {formataValores(totais.valor_planejados)}
                </Typography>
            </Typography>

            <Typography sx={{ fontWeight: 'medium' }} component="span">
                Valor dos aditamentos
                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                    {formataValores(totais.valor_aditamentos)}
                </Typography>
            </Typography>
        </Box>
    );
}

export default RefExecucaoFinanceira;