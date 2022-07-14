import React, { useState } from 'react';
import { Box, Typography, Fade, Paper, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FormDadosEmpresa from './FormDadosEmpresa/FormDadosEmpresa';

const DadosEmpresa = (props) => {
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
                        border: '1px solid #cdcdcd', 
                        borderRadius: '3px', 
                        width: '100%', 
                        boxSizing: 'border-box', 
                        mb: '1rem',
                        background: '#FFFFFF'
                    }}
                >
                    <Typography sx={{ fontWeight: 'medium'}} component="span">
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

                <Tooltip title="Editar" arrow>
                    <IconButton
                        onClick={() => setOpenDadosEmpresa(true)}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <FormDadosEmpresa 
                formContrato={props.formContrato}
                setFormContrato={props.setFormContrato}
                numContrato={props.numContrato}
                openDadosEmpresa={openDadosEmpresa}
                setOpenDadosEmpresa={setOpenDadosEmpresa}
                setSnackbar={props.setSnackbar}
            />
        </Box>
    );
}

export default DadosEmpresa;