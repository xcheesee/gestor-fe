import React, { useState } from 'react';
import { Box, Typography, Fade, Paper, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FormDadosEmpresa from './FormDadosEmpresa/FormDadosEmpresa';

const DadosEmpresa = (props) => {
    const {
        nome_empresa,
        telefone_empresa,
        email_empresa,
        estaCarregado,
        formContrato,
        setFormContrato,
        numContrato,
        setSnackbar
    } = props;

    const [openDadosEmpresa, setOpenDadosEmpresa] = useState(false);

    return (
        <Box>
            <Typography variant="h2" sx={{ fontSize: '2rem', margin: '2rem 0 0 0' }}>
                Dados da empresa
            </Typography>

            <Box 
                sx={{ 
                    padding: '1rem', 
                    margin: '2rem 0', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end', 
                    justifyContent: 'space-between',
                    background: '#F8FAF8'
                }} 
                component={Paper} 
                elevation={5}
            >
                <Box 
                    sx={{ 
                        padding: '1rem',
                        width: '100%', 
                        boxSizing: 'border-box', 
                        mb: '1rem',
                        background: '#FFFFFF'
                    }}
                    component={Paper}
                    elevation={3}
                >
                    <Typography sx={{ fontWeight: 'medium'}} component="span">
                        Nome
                        <Fade in={estaCarregado} timeout={250}>
                            <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                {nome_empresa}
                            </Typography>
                        </Fade>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Telefone
                        <Fade in={estaCarregado} timeout={250}>
                            <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                {telefone_empresa}
                            </Typography>
                        </Fade>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        E-mail
                        <Fade in={estaCarregado} timeout={250}>
                            <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                {email_empresa}
                            </Typography>
                        </Fade>
                    </Typography>
                </Box>

                <Box>
                    <Button 
                        sx={{ textTransform: 'none' }}
                        onClick={() => setOpenDadosEmpresa(true)}
                    >
                        <EditIcon
                            sx={{ 
                                mr: '0.5rem'
                            }}
                            fontSize="small"
                        />
                        Editar dados da empresa
                    </Button>
                </Box>
            </Box>

            <FormDadosEmpresa 
                formContrato={formContrato}
                setFormContrato={setFormContrato}
                numContrato={numContrato}
                openDadosEmpresa={openDadosEmpresa}
                setOpenDadosEmpresa={setOpenDadosEmpresa}
                setSnackbar={setSnackbar}
            />
        </Box>
    );
}

export default DadosEmpresa;