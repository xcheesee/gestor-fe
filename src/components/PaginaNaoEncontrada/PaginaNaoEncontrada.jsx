import React from 'react';
import { Box, Typography, Paper, Button, Fade } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Img404 from './img/vazio.png';
import { Link } from 'react-router-dom';

const PaginaNaoEncontrada = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ margin: '2rem 1rem', padding: '1rem', width: '100%', maxWidth: '80rem' }} component={Paper} elevation={5}>
                    <Link to="/principal">
                        <Button sx={{ textTransform: 'none' }} size="large">
                            <ArrowBackIosIcon /> Voltar
                        </Button>
                    </Link>
                <Fade in={true} timeout={800}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                            <img src={Img404} alt="Erro 404" width="400" />
                        </Box>
                        <Typography sx={{ textAlign: 'center', margin: '2rem' }} variant="h2">Erro 404</Typography>
                        <Typography sx={{ textAlign: 'center', margin: '2rem', fontSize: '2.5rem', fontWeight: 'light' }}>Página não encontrada</Typography>
                    </Box>
                </Fade>
            </Box>
        </Box>
    );
}

export default PaginaNaoEncontrada;