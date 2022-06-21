import React from 'react';
import { Box, Typography, Fade, Paper } from '@mui/material';

const DadosEmpresa = (props) => {
    return (
        <Box>
            <Typography variant="h2" sx={{ fontSize: '2rem', margin: '2rem 0 0 0' }}>
                Dados da empresa
            </Typography>

            <Box sx={{ padding: '1rem', margin: '2rem 0' }} component={Paper} elevation={5}>
                <Typography sx={{ fontWeight: 'medium' }} component="span">
                    Nome
                    <Fade in={props.estaCarregado} timeout={250}>
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {props.nome_empresa}
                        </Typography>
                    </Fade>
                </Typography>

                <Typography sx={{ fontWeight: 'medium' }} component="span">
                    Telefone
                    <Fade in={props.estaCarregado} timeout={250}>
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {props.telefone_empresa}
                        </Typography>
                    </Fade>
                </Typography>

                <Typography sx={{ fontWeight: 'medium' }} component="span">
                    E-mail
                    <Fade in={props.estaCarregado} timeout={250}>
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {props.email_empresa}
                        </Typography>
                    </Fade>
                </Typography>
            </Box>
        </Box>
    );
}

export default DadosEmpresa;