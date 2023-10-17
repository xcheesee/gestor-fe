import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FormOutrasInformacoes from './FormOutrasInformacoes';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../../atomStore';

const OutrasInformacoes = (props) => {
    const {
        outras_informacoes,
        dados,
        numContrato,
        mudancaContrato,
        setMudancaContrato
    } = props;

    const [openOutrasInformacoes, setOpenOutrasInformacoes] = useState(false);

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

            <Box 
                sx={{ 
                    width: '100%', 
                    margin: '2rem 0', 
                    padding: '0.1rem 0',
                    background: '#F8FAF8',
                }} 
                component={Paper} 
                elevation={5}
            >
                <Box 
                    sx={{ 
                        margin: '1rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-start',
                    }}
                >
                    {outras_informacoes !== ''
                        ?
                            <Box 
                                sx={{ 
                                    width: '100%', 
                                    boxSizing: 'border-box', 
                                    mb: '1rem',
                                    background: '#FFFFFF',
                                }}
                                component={Paper}
                                elevation={3}
                            >
                                <Typography sx={{ margin: '1rem', whiteSpace: 'pre-line' }} component="pre">
                                    {formataInformacoes(outras_informacoes)}
                                </Typography>
                            </Box>
                        :   
                            <Typography>
                                Nenhuma informação adicional disponível para este contrato
                            </Typography>
                    }
                            
                    <Box sx={{ alignSelf: 'flex-end' }}>
                        <Button 
                            sx={{ textTransform: 'none' }}
                            onClick={() => setOpenOutrasInformacoes(true)}
                        >
                            <EditIcon
                                sx={{ 
                                    mr: '0.5rem'
                                }}
                                fontSize="small"
                            />
                            Editar informações adicionais
                        </Button>
                    </Box>
                </Box>
            </Box>

            <FormOutrasInformacoes 
                openOutrasInformacoes={openOutrasInformacoes}
                setOpenOutrasInformacoes={setOpenOutrasInformacoes}
                dados={dados}
                numContrato={numContrato}
                mudancaContrato={mudancaContrato}
                setMudancaContrato={setMudancaContrato}
            /> 
        </Box>
    );
}

export default OutrasInformacoes;