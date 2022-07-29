import React, { useState, useEffect } from 'react';
import { 
    Paper,
    Typography, 
    Box, 
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    CircularProgress,
    Fade
} from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import Filtros from '../Filtros';

const Principal = ({ snackbar, setSnackbar, mascaraProcessoSei, mascaraContrato }) => {
    const [dados, setDados] = useState({});
    const [metaDados, setMetaDados] = useState({});
    const [estaCarregado, setEstaCarregado] = useState(false);
    const [url, setUrl] = useState({
        url: `${process.env.REACT_APP_API_URL}/contratos?`,
        page: 1,
        filtros: ''
    });

    const irParaTopo = () => {
        window.scrollTo(0, 0);
    }
    
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

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const urlMontado = `${url.url}page=${url.page}${url.filtros}`;

        setEstaCarregado(false);
        
        fetch(urlMontado, options)
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem('access_token');
                    document.location.reload();
                } else {
                    return res.json()
                        .then(data => {
                            setEstaCarregado(true);
                            setDados(data.data);
                            setMetaDados(data.meta);
                        });
                }
            });

        setSnackbar({...snackbar, open: false});
        
    }, [url])

    const ConteudoPrincipal = () => {
        const rows = [];
    
        Object.values(dados).map((contrato, index) => {
            return rows.push(
                {
                    id: contrato.id, 
                    processo_sei: mascaraProcessoSei(contrato.processo_sei),
                    credor: contrato.credor,
                    nome_empresa: contrato.nome_empresa,
                    numero_contrato: mascaraContrato(contrato.numero_contrato),
                    data_inicio_vigencia: contrato.data_inicio_vigencia,
                    data_vencimento: contrato.data_vencimento
                }
            );
        });

        return (
            <TableContainer component={Paper} elevation={3} sx={{ width: '100%', margin: '1rem auto 0 auto'}}>
                <Table size="small">
                    <TableHead sx={{ background: (theme) => theme.palette.primary.main  }}>
                        <TableRow>
                            <TableCell sx={{ color: (theme) => theme.palette.color.main }} align="center">ID</TableCell>
                            <TableCell sx={{ color: (theme) => theme.palette.color.main }} align="center">Processo SEI</TableCell>
                            <TableCell sx={{ color: (theme) => theme.palette.color.main }} align="center">Credor</TableCell>
                            <TableCell sx={{ color: (theme) => theme.palette.color.main }} align="center">Empresa</TableCell>
                            <TableCell sx={{ color: (theme) => theme.palette.color.main }} align="center">Contrato</TableCell>
                            <TableCell sx={{ color: (theme) => theme.palette.color.main }} align="center">Início da vigência</TableCell>
                            <TableCell sx={{ color: (theme) => theme.palette.color.main }} align="center">Vencimento</TableCell>
                            <TableCell sx={{ color: (theme) => theme.palette.color.main }} align="center">Visualizar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => {
                            const background = { background: index % 2 === 0 ? '#FFFFFF' : '#f3f6f3', borderBottom: 0 };
                            return (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center" sx={background}>{row.id}</TableCell>
                                    <TableCell align="center" sx={background}>{row.processo_sei}</TableCell>
                                    <TableCell align="center" sx={background}>{row.credor}</TableCell>
                                    <TableCell align="center" sx={background}>{row.nome_empresa}</TableCell>
                                    <TableCell align="center" sx={background}>{row.numero_contrato}</TableCell>
                                    <TableCell align="center" sx={background}>{row.data_inicio_vigencia}</TableCell>
                                    <TableCell align="center" sx={background}>{row.data_vencimento === null ? "- - -" : row.data_vencimento}</TableCell>
                                    <TableCell align="center" sx={background}>
                                        <Link to={`../contrato/${row.id}`}>
                                            <IconButton onClick={irParaTopo}>
                                                <ManageSearchIcon />
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box sx={{ padding: '0 1rem' }}>
            <Fade in={true} timeout={500}>
                <Box sx={{ padding: '1rem', maxWidth: '80rem', margin: '2rem auto', boxSizing: 'border-box' }} component={Paper} elevation={5}>
                    <Typography variant="h2" component="h1" sx={{ fontSize: '2rem' }}>Contratos vigentes</Typography>
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
                                    <ConteudoPrincipal />
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