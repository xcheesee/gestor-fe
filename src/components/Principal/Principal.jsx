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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from "react-router-dom";
import Filtros from '../Filtros';

const Principal = ({ snackbar, setSnackbar, mascaraProcessoSei, mascaraContrato }) => {
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

    const ordena = (value) => {
        setSort(true);
        setCarregandoSort(true);
        if (url.sort === value)
            setUrl({ ...url, sort: `-${value}` });
        else
            setUrl({ ...url, sort: value });
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
        const urlMontado = `${url.url}page=${url.page}${url.filtros}&sort=${url.sort}`;

        if (!sort)
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
                            setSort(false);
                            setCarregandoSort(false);
                        });
                }
            });

        setSnackbar({...snackbar, open: false});
        
    }, [url])

    const Arrow = () => {
        if (carregandoSort) {
            return (
                <CircularProgress 
                    sx={{ 
                        color: (theme) => theme.palette.color.main, 
                        margin: '0 0.38rem'
                    }}
                    size="0.75rem"
                />
            );
        } else {
            if (url.sort[0] === '-') {
                return (
                    <Fade in={true}>
                        <KeyboardArrowUpIcon />
                    </Fade>
                );
            } else {
                return (
                    <Fade in={true}>
                        <KeyboardArrowDownIcon />
                    </Fade>
                );
            }
        }
    }

    const ConteudoPrincipal = () => {
        const rows = [];
    
        Object.values(dados).map((contrato) => {
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
                            <TableCell 
                                sx={{ 
                                    color: (theme) => theme.palette.color.main
                                }} 
                                align="center"
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        borderRadius: '3px',
                                        '&:hover': { 
                                            background: 'rgba(20, 20, 20, 0.2)',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        } 
                                    }}
                                    onClick={() => ordena('id')}
                                >
                                    ID
                                    {
                                        url.sort === 'id' || url.sort === '-id'
                                        ? <Arrow />
                                        : ''
                                    }
                                </Box>
                            </TableCell>
                            <TableCell 
                                sx={{ 
                                    color: (theme) => theme.palette.color.main
                                }} 
                                align="center"
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        borderRadius: '3px',
                                        '&:hover': { 
                                            background: 'rgba(20, 20, 20, 0.2)',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        } 
                                    }}
                                    onClick={() => ordena('processo_sei')}
                                >
                                    Processo SEI
                                    {
                                        url.sort === 'processo_sei' || url.sort === '-processo_sei'
                                        ? <Arrow />
                                        : ''
                                    }
                                </Box>
                            </TableCell>
                            <TableCell 
                                sx={{ 
                                    color: (theme) => theme.palette.color.main
                                }} 
                                align="center"
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        borderRadius: '3px',
                                        '&:hover': { 
                                            background: 'rgba(20, 20, 20, 0.2)',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        } 
                                    }}
                                    onClick={() => ordena('credor')}
                                >
                                    Credor
                                    {
                                        url.sort === 'credor' || url.sort === '-credor'
                                        ? <Arrow />
                                        : ''
                                    }
                                </Box>
                            </TableCell>
                            <TableCell 
                                sx={{ 
                                    color: (theme) => theme.palette.color.main
                                }} 
                                align="center"
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        borderRadius: '3px',
                                        '&:hover': { 
                                            background: 'rgba(20, 20, 20, 0.2)',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        } 
                                    }}
                                    onClick={() => ordena('nome_empresa')}
                                >
                                    Empresa
                                    {
                                        url.sort === 'nome_empresa' || url.sort === '-nome_empresa'
                                        ? <Arrow />
                                        : ''
                                    }
                                </Box>
                            </TableCell>
                            <TableCell 
                                sx={{ 
                                    color: (theme) => theme.palette.color.main
                                }} 
                                align="center"
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        borderRadius: '3px',
                                        '&:hover': { 
                                            background: 'rgba(20, 20, 20, 0.2)',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        } 
                                    }}
                                    onClick={() => ordena('numero_contrato')}
                                >
                                    Contrato
                                    {
                                        url.sort === 'numero_contrato' || url.sort === '-numero_contrato'
                                        ? <Arrow />
                                        : ''
                                    }
                                </Box>
                            </TableCell>
                            <TableCell 
                                sx={{ 
                                    color: (theme) => theme.palette.color.main
                                }} 
                                align="center"
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        borderRadius: '3px',
                                        '&:hover': { 
                                            background: 'rgba(20, 20, 20, 0.2)',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        } 
                                    }}
                                    onClick={() => ordena('data_inicio_vigencia')}
                                >
                                    Início da vigência
                                    {
                                        url.sort === 'data_inicio_vigencia' || url.sort === '-data_inicio_vigencia'
                                        ? <Arrow />
                                        : ''
                                    }
                                </Box>
                            </TableCell>
                            <TableCell 
                                sx={{ 
                                    color: (theme) => theme.palette.color.main
                                }} 
                                align="center"
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        borderRadius: '3px',
                                        '&:hover': { 
                                            background: 'rgba(20, 20, 20, 0.2)',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        } 
                                    }}
                                    onClick={() => ordena('data_vencimento')}
                                >
                                    Vencimento
                                    {
                                        url.sort === 'data_vencimento' || url.sort === '-data_vencimento'
                                        ? <Arrow />
                                        : ''
                                    }
                                </Box>
                            </TableCell>
                            <TableCell 
                                sx={{ 
                                    color: (theme) => theme.palette.color.main,
                                }} 
                                align="center"
                            >
                                Visualizar
                            </TableCell>
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