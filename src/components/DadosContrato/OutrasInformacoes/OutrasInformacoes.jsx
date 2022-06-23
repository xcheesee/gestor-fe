import { Box, Typography, Paper } from '@mui/material';
import React from 'react';

const OutrasInformacoes = (props) => {
    const formataInformacoes = (string) => {
        if (typeof string === "string") {
            return string.replaceAll("<br />", "\n");
        } else {
            return "- - -"
        }
    }

    return (
        <Box>
            <Typography variant="h2" sx={{ fontSize: '2rem', mt: '2rem' }}>
                Outras informações
            </Typography>

            <Box sx={{ width: '100%', margin: '2rem 0', padding: '0.1rem 0' }} component={Paper} elevation={5}>
                <Box sx={{ border: '1px solid #cdcdcd', borderRadius: '3px', margin: '1rem' }}>
                    <Typography sx={{ margin: '1rem', whiteSpace: 'pre-line' }} component="pre">
                        {formataInformacoes(props.outras_informacoes)}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default OutrasInformacoes;