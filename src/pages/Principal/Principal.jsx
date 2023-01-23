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
import { irParaTopo } from '../../components/utils/utils';
import { getContrato } from '../../components/utils/api';
import ContratoTable from '../../components/ContratoTable';
import VoltarArrowBtn from '../../components/VoltarArrowBtn';
import NovoContratoDialog from '../../components/NovoContratoDialog';

const Principal = ({ snackbar, setSnackbar }) => {
    const [dados, setDados] = useState({});
    const [novoDialog, setNovoDialog] = useState(false)
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
    const navigate = useNavigate()
    
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
                            {!estaCarregado
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
                                    dados={dados}
                                    estaCarregado={estaCarregado}
                                    url={url}
                                    ordena={ordena}
                                    carregandoSort={carregandoSort}/>
                            }
                            <Button
                                className='self-end'
                                variant="contained"
                                sx={{ color: (theme) => theme.palette.color.main, margin: '2rem 0', textTransform: 'none' }}
                                onClick={() => {
                                    // irParaTopo()
                                    setNovoDialog(true)
                                }}
                            >
                                <AddIcon sx={{ mr: '0.2rem' }} /> Novo Novo contrato
                            </Button>
                            <Pagination
                                className="self-center m-[1rem]"
                                count={metaDados?.last_page ?? 1}
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