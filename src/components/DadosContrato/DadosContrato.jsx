import React, { useState, useEffect } from 'react';
import { 
    Backdrop,
    CircularProgress,
    Paper,
    Typography, 
    Box, 
    Button,
    Divider,
    Tabs,
    Tab,
    Fade,
    Snackbar,
    Alert,
} from '@mui/material';
import ExecucaoFinanceira from './ExecucaoFinanceira';
import DadosEmpresa from './DadosEmpresa';
import OutrasInformacoes from './OutrasInformacoes';
import ListaDadosContrato from '../ListaDadosContrato';
import ListaCertidoes from '../ListaCertidoes';
import ListaGarantias from '../ListaGarantias';
import ListaFiscalizacao from '../ListaFiscalizacoes';
import ListaLocais from '../ListaLocais';
import PropTypes from 'prop-types';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { cpf, cnpj } from 'cpf-cnpj-validator';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`aba-${index}`}
            aria-labelledby={`aba-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, height: '480.1px', overflow: 'auto', background: '#F8FAF8'}}>
                    <Typography variant="h5">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

const a11yProps = (index) => {
    return {
        id: `aba-${index}`,
        'aria-controls': `aba-${index}`,
    };
}

const retornaCampoValor = (campos, valores, estaCarregado) => {
    return (
        <Box sx={{ margin: '0 1rem' }}>
            {campos.map((campo, index) => {
                return (
                    <Typography sx={{ margin: '1rem 0' }} key={index} component="span">
                        <strong>{campo}</strong>
                        <Fade in={estaCarregado} timeout={250}>
                            <Typography sx={{ margin: '0.5rem' }}>
                                {valores[index] === "" || valores[index] === null || !estaCarregado ? "---" : valores[index]}
                            </Typography>
                        </Fade>
                    </Typography>
                );
            })}
        </Box>
    );
}

const formataData = (data) => {
    if (data !== undefined && data !== null) {
        let dArr = data.split("-");
        let dia = dArr[2];
        let mes = dArr[1];
        let ano = dArr[0];

        if (data === "") {
            return "";
        } else {
            return `${dia}/${mes}/${ano}`;
        };
    } else {
        return "---"
    }
}

const formataValores = (valor) => {
    const valores = new Intl.NumberFormat('pt-BR', {
        style: "currency",
        currency: "BRL"
    });

    if (valor === "" || valor === undefined) {
        return "";
    } else {
        return valores.format(valor);
    }
}

const formataCpfCnpj = (cpfCnpj) => {
    if (cpfCnpj === "" || cpfCnpj === undefined) {
        return "";
    } else {
        return cpfCnpj.length > 11 ? cnpj.format(cpfCnpj) : cpf.format(cpfCnpj);
    }
}

const primeiraLetraMaiuscula = (string) => {
    if (typeof string === "string") {
        return string[0].toUpperCase() + string.substring(1);
    } else {
        return "---";
    }
}

const ListaTabs = [
    'Contrato',
    'Certidões',
    'Garantias',
    'Fiscalização',
    'Locais de serviço',
    'Aditamentos de valor',
    'Aditamentos de prazo',
    'Notas de empenho',
    'Dotações'
];

const DadosContrato = ({ snackbar, setSnackbar }) => {
    const [value, setValue] = useState(0);
    const [dados, setDados] = useState({});
    const [certidoes, setCertidoes] = useState([]);
    const [garantias, setGarantias] = useState([]);
    const [fiscalizacoes, setFiscalizacoes] = useState([]);
    const [locais, setLocais] = useState([]);
    const [estaCarregado, setEstaCarregado] = useState(false);
    const { numContrato } = useParams();
    
    const navigate = useNavigate();

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}`
        const token = localStorage.getItem('access_token');
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'GET'
        }
        
        fetch(`${url}/contrato/${numContrato}`, options)
        .then(res => {
            if (res.status === 404) {
                navigate("../404", { replace: true });
            } else if (res.status === 401) {
                localStorage.removeItem('access_token');
                navigate("../principal", { replace: true });
            } else {
                return res.json()
                    .then(data => {
                        setEstaCarregado(true);
                        setDados(data.data);
                    })
            }
        })

        fetch(`${url}/certidoes/${numContrato}`, options)
        .then(res => res.json())
        .then(data => {
            setCertidoes(data.data);
        })

        fetch(`${url}/garantias/${numContrato}`, options)
        .then(res => res.json())
        .then(data => {
            setGarantias(data.data);
        })

        fetch(`${url}/gestaofiscalizacoes/${numContrato}`, options)
        .then(res => res.json())
        .then(data => {
            setFiscalizacoes(data.data);
        })

        fetch(`${url}/servicoslocais/${numContrato}`, options)
        .then(res => res.json())
        .then(data => {
            setLocais(data.data);
        })

    }, [numContrato, snackbar, navigate])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => { setSnackbar({...snackbar, open: false}); }}>
                <Alert 
                    variant="filled"
                    onClose={() => { setSnackbar({...snackbar, open: false}); }}
                    severity={snackbar.severity}
                    elevation={6} 
                    sx={{ width: '100%' }}
                    color={snackbar.color}
                >
                    {snackbar.text}
                </Alert>
            </Snackbar>

            <Backdrop 
                open={!estaCarregado}
                sx={{ zIndex: '200' }}
                transitionDuration={850}
            >
                <CircularProgress
                    sx={{ color: (theme) => theme.palette.color.main }}
                />
            </Backdrop>
            
            <Fade in={true} timeout={750}>
                <Box sx={{ padding: '0 1rem' }}>
                    <Box sx={{ padding: '1rem', maxWidth: '80rem', margin: '2rem auto', boxSizing: 'border-box' }} component={Paper} elevation={5}>
                    <Link to="/principal">
                        <Button sx={{ textTransform: 'none' }} size="large">
                            <ArrowBackIosIcon /> Voltar
                        </Button>
                    </Link>
                        <Box sx={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                            <Typography variant="h2" component="h1" sx={{ fontSize: '2rem' }}>
                                Contrato # <strong>{dados.id}</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', width: '100%', margin: '2rem 0' }} component={Paper} elevation={5}>
                                <Box sx={{ display: 'flex'}}>
                                    <Tabs 
                                        orientation="vertical" 
                                        value={value} 
                                        onChange={handleChange} 
                                        aria-label="abas de navegação"
                                        TabIndicatorProps={{
                                            style: {
                                                display: "none",
                                            },
                                        }}
                                    >

                                        {ListaTabs.map((label, index) => {
                                            return (
                                                index === 0 
                                                ?
                                                <Tab 
                                                    sx={{ '&.Mui-selected': { 
                                                            background: (theme) => theme.palette.primary.main, 
                                                            color: (theme) => theme.palette.color.main, 
                                                            borderTopLeftRadius: '3px', 
                                                            transition: '0.5s' 
                                                        }, 
                                                        alignItems: 'flex-start', 
                                                        textAlign: 'left', 
                                                        textTransform: 'none',
                                                        width: '11.25rem'    
                                                    }} 
                                                    label={label}
                                                    {...a11yProps(index)} 
                                                    key={index}
                                                />
                                                :
                                                <Tab 
                                                    sx={{ '&.Mui-selected': { 
                                                            background: (theme) => theme.palette.primary.main, 
                                                            color: (theme) => theme.palette.color.main, 
                                                            transition: '0.5s' 
                                                        }, 
                                                        alignItems: 'flex-start', 
                                                        textAlign: 'left', 
                                                        textTransform: 'none',
                                                        width: '11.25rem'
                                                    }} 
                                                    label={label}
                                                    {...a11yProps(index)}
                                                    key={index} 
                                                />
                                            )
                                        })}
                                    </Tabs>

                                    <Divider orientation="vertical" />
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    <TabPanel value={value} index={0}>
                                        <ListaDadosContrato 
                                            formataCpfCnpj={formataCpfCnpj}
                                            primeiraLetraMaiuscula={primeiraLetraMaiuscula}
                                            formataData={formataData}
                                            formataValores={formataValores}
                                            retornaCampoValor={retornaCampoValor}
                                            dados={dados}
                                            estaCarregado={estaCarregado}
                                            numContrato={numContrato}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={1}>
                                        <ListaCertidoes 
                                            certidoes={certidoes}
                                            estaCarregado={estaCarregado}
                                            formataData={formataData}
                                            retornaCampoValor={retornaCampoValor} 
                                            snackbar={snackbar}
                                            setSnackbar={setSnackbar}
                                            numContrato={numContrato}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={2}>
                                        <ListaGarantias 
                                            garantias={garantias}
                                            estaCarregado={estaCarregado}
                                            formataData={formataData}
                                            formataValores={formataValores}
                                            retornaCampoValor={retornaCampoValor}
                                            snackbar={snackbar}
                                            setSnackbar={setSnackbar}
                                            numContrato={numContrato}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={3}>
                                        <ListaFiscalizacao 
                                            fiscalizacoes={fiscalizacoes}
                                            estaCarregado={estaCarregado}
                                            retornaCampoValor={retornaCampoValor}
                                            snackbar={snackbar}
                                            setSnackbar={setSnackbar}
                                            numContrato={numContrato}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={4}>
                                        <ListaLocais 
                                            locais={locais}
                                            estaCarregado={estaCarregado}
                                            retornaCampoValor={retornaCampoValor}
                                            numContrato={numContrato}
                                            setSnackbar={setSnackbar}
                                        />
                                    </TabPanel>
                                    
                                    <TabPanel value={value} index={5}>
                                        {/*
                                            Lista de Aditamentos de Valor
                                        */}
                                    </TabPanel>

                                    <TabPanel value={value} index={6}>
                                        {/*
                                            Lista de Aditamentos de Prazo
                                        */}
                                    </TabPanel>

                                    <TabPanel value={value} index={7}>
                                        {/*
                                            Lista de Notas de Empenho
                                        */}
                                    </TabPanel>

                                    <TabPanel value={value} index={8}>
                                        {/*
                                            Lista de Dotações
                                        */}
                                    </TabPanel>
                                </Box>
                            </Box>

                            <ExecucaoFinanceira 
                                execucao_financeira={dados.execucao_financeira}
                                formataValores={formataValores}
                            />

                            <DadosEmpresa
                                nome_empresa={dados.nome_empresa}
                                telefone_empresa={dados.telefone_empresa}
                                email_empresa={dados.email_empresa}
                                estaCarregado={estaCarregado}
                            />

                            <OutrasInformacoes 
                                outras_informacoes={dados.outras_informacoes}
                            />

                        </Box>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}

export default DadosContrato;