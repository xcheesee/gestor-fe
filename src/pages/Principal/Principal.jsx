import React, { useState, useEffect } from 'react';
import { 
    Paper,
    Typography, 
    Box, 
    Button,
    IconButton,
    Pagination,
    CircularProgress,
    Fade,
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import Filtros from '../../components/Filtros';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { irParaTopo } from '../../components/utils/utils';
import { getContrato } from '../../components/utils/api';
import ContratoTable from '../../components/ContratoTable';

const Principal = ({ snackbar, setSnackbar }) => {
    const [dados, setDados] = useState({});
    const [metaDados, setMetaDados] = useState({});
    const [estaCarregado, setEstaCarregado] = useState(false);
    const [sort, setSort] = useState(false);
    const [carregandoSort, setCarregandoSort] = useState(true);
    const [url, setUrl] = useState({
        url: `${process.env.REACT_APP_API_URL}/contratos?`,
        page: 1,
        filtros: '',
        sort: ''
    });
    
    const mudaPagina = (event, value) => {
        if (url.page !== value) {
            setEstaCarregado(false);
            irParaTopo();
            setUrl({
                ...url,
                page: value
            });
        }
    }

    const ordena = (value) => {
        setSort(true);
        setCarregandoSort(true);
        if (url.sort === value)
            setUrl({ ...url, sort: `-${value}` });
        else
            setUrl({ ...url, sort: value });
    }

    useEffect(() => {
        (async () => {
            if (!sort) 
                setEstaCarregado(false);
            const data = await getContrato(url)
            setEstaCarregado(true);
            setDados(data.data);
            setMetaDados(data.meta);
            setSort(false);
            setCarregandoSort(false);
        })();

        setSnackbar({...snackbar, open: false});
        
    }, [url])

    return (
        <Box sx={{ padding: '0 1rem' }}>
            <Fade in={true} timeout={500}>
                <Box sx={{ padding: '1rem', maxWidth: '80rem', margin: '2rem auto', boxSizing: 'border-box' }} component={Paper} elevation={5}>
                    <Typography variant="h2" component="h1" sx={{ fontSize: '2rem' }}>
                        <Link to='/principal'>
                            <Tooltip title="Voltar" arrow>
                                <IconButton sx={{ mr: '0.5rem' }}>
                                    <ArrowBackIosIcon />
                                </IconButton>
                            </Tooltip>
                        </Link>
                        Contratos vigentes
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                        <Filtros url={url} setUrl={setUrl} />

                        {
                            !estaCarregado
                            ?
                            <Box 
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
                            :
                            <Fade in={estaCarregado} timeout={800}>
                                <Box>
                                    <ContratoTable 
                                        dados={dados} 
                                        url={url}
                                        ordena={ordena}
                                        carregandoSort={carregandoSort}/>
                                </Box>
                            </Fade>
                        }

                        <Fade in={true}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Link to="../novo-contrato">
                                    <Button 
                                        variant="contained" 
                                        sx={{ color: (theme) => theme.palette.color.main, margin: '2rem 0', textTransform: 'none' }}
                                        onClick={irParaTopo}
                                    >
                                        <AddIcon sx={{ mr: '0.2rem' }} /> Novo contrato
                                    </Button>
                                </Link>
                            </Box>
                        </Fade>

                        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
                            <Pagination 
                                count={metaDados.last_page} 
                                size="large" 
                                color="primary" 
                                page={url.page}
                                onChange={mudaPagina}
                            />
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Box>
    );
};

export default Principal;