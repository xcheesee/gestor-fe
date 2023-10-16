import React, { useState, useEffect } from 'react';
import { 
    Paper,
    Typography, 
    Box, 
    Button,
    Pagination,
    CircularProgress,
    Fade,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import Filtros from '../../components/Filtros';
import { irParaTopo } from '../../commom/utils/utils';
import { getContratos } from '../../commom/utils/api';
import ContratoTable from '../../components/ContratoTable';
import VoltarArrowBtn from '../../components/VoltarArrowBtn';
import NovoContratoDialog from '../../components/NovoContratoDialog';
import { useQuery } from '@tanstack/react-query';

const Principal = ({ }) => {
    const [novoDialog, setNovoDialog] = useState(false)
    // const [sort, setSort] = useState(false);
    const [carregandoSort, setCarregandoSort] = useState(true);
    const [url, setUrl] = useState({
        url: `${process.env.REACT_APP_API_URL}/contratos?`,
        page: 1,
        filtros: '',
        sort: ''
    });

    const navigate = useNavigate()

    const dados = useQuery(['contratos', url], {
        queryFn: () => getContratos(url)
    })

    const mudaPagina = (event, value) => {
        if (url.page !== value) {
            irParaTopo();
            setUrl({
                ...url,
                page: value
            });
        }
    }

    const ordena = (value) => {
        setCarregandoSort(true);
        if (url.sort === value)
            setUrl({ ...url, sort: `-${value}` });
        else
            setUrl({ ...url, sort: value });
    }

    useEffect(() => {
        setCarregandoSort(false);
        //setSnackbar({...snackbar, open: false});
    }, [url])

    return (
        <>
            <Box sx={{ padding: '0 1rem' }}>
                <Fade in={true} timeout={500}>
                    <Box 
                        sx={{ padding: '1rem', maxWidth: '80rem', margin: '2rem auto', boxSizing: 'border-box' }} 
                        component={Paper} 
                        elevation={5}>
                            
                        <Typography variant="h2" component="h1" sx={{ fontSize: '2rem' }}>
                            <VoltarArrowBtn onClick={() => navigate("/principal")} />
                            Contratos vigentes
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                            <Filtros url={url} setUrl={setUrl} />
                            {dados.isLoading
                                ?<Box
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: '841px',
                                        margin: '1rem auto 0 auto',
                                        background: '#F5F5F5'
                                    }}
                                    component={Paper}
                                    elevation={3}
                                >
                                    <CircularProgress size={40} sx={{ margin: '10rem' }} />
                                </Box>
                                :<ContratoTable
                                    dados={dados?.data?.data}
                                    isLoading={dados.isLoading}
                                    url={url}
                                    ordena={ordena}
                                    carregandoSort={carregandoSort}/>
                            }
                            <Button
                                className='self-end'
                                variant="contained"
                                sx={{ color: (theme) => theme.palette.color.main, margin: '2rem 0', textTransform: 'none' }}
                                onClick={() => {
                                    setNovoDialog(true)
                                }}
                            >
                                <AddIcon sx={{ mr: '0.2rem' }} /> Novo contrato
                            </Button>
                            <Pagination
                                className="self-center m-[1rem]"
                                count={dados?.data?.meta?.last_page || 1}
                                size="large"
                                color="primary"
                                page={url.page}
                                onChange={mudaPagina}
                            />
                        </Box>
                    </Box>
                </Fade>
            </Box>
            <NovoContratoDialog novoDialog={novoDialog} setNovoDialog={setNovoDialog} />
        </>
    );
};

export default Principal;