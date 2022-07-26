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
import ListaDotacoes from '../ListaDotacoes';
import ListaNotasEmpenho from '../ListaNotasEmpenho';
import ListaAditamentosValor from '../ListaAditamentosValor';
import ListaAditamentosPrazo from '../ListaAditamentosPrazo';
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
                <Box sx={{ p: 3, height: '42rem', overflow: 'auto', background: '#F8FAF8'}}>
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
                    <Typography sx={{ margin: '1rem 0' }} key={index} component="pre">
                        <strong>{campo}</strong>
                        <Typography sx={{ margin: '0.5rem' }}>
                            {valores[index] === "" || valores[index] === null || !estaCarregado ? "---" : valores[index]}
                        </Typography>
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
    const [mudancaCertidoes, setMudancaCertidoes] = useState(false);
    const [carregandoCertidoes, setCarregandoCertidoes] = useState(true);
    
    const [garantias, setGarantias] = useState([]);
    const [mudancaGarantias, setMudancaGarantias] = useState(false);
    const [carregandoGarantias, setCarregandoGarantias] = useState(true);
    
    const [fiscalizacoes, setFiscalizacoes] = useState([]);
    const [mudancaFiscalizacoes, setMudancaFiscalizacoes] = useState(false);
    const [carregandoFicalizacoes, setCarregandoFiscalizacoes] = useState(true);

    const [locais, setLocais] = useState([]);
    const [mudancaLocais, setMudancaLocais] = useState(false);
    const [carregandoLocais, setCarregandoLocais] = useState(true);

    const [aditamentos_valor, setaditamentos_valor] = useState([]);
    const [mudancaAditamentos_valor, setMudancaAditamentos_valor] = useState(false);
    const [carregandoAditamentos_valor, setCarregandoAditamentos_valor] = useState(true);

    const [aditamentos_prazo, setaditamentos_prazo] = useState([]);
    const [mudancaAditamentos_prazo, setMudancaAditamentos_prazo] = useState(false);
    const [carregandoAditamentos_prazo, setCarregandoAditamentos_prazo] = useState(true);

    const [dotacoes, setDotacoes] = useState([]);

    const [notasempenho, setNotasEmpenho] = useState([]);
    
    const [tipoDotacoes, setTipoDotacoes] = useState([]);
    const [origemRecursos, setOrigemRecursos] = useState([]);
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
                            setDados(data.data);
                            setEstaCarregado(true);
                        })
                        .then(() => {
                            fetch(`${url}/dotacao_tipos`, options)
                                .then(res => res.json())
                                .then(data => {
                                    setTipoDotacoes(data.data);
                                })
                        })
                        .then(() => {
                            fetch(`${url}/origem_recursos`, options)
                                .then(res => res.json())
                                .then(data => {
                                    setOrigemRecursos(data.data);
                                    // setEstaCarregado(true);
                                })
                        })
                        .then(() => {
                            fetch(`${url}/dotacoes/${numContrato}`, options)
                                .then(res => res.json())
                                .then(data => {
                                    setDotacoes(data.data);
                                })
                        })
                        .then(() => {
                            fetch(`${url}/empenho_notas/${numContrato}`, options)
                                .then(res => res.json())
                                .then(data => {
                                    setNotasEmpenho(data.data);
                                    setEstaCarregado(true);
                                })
                        })
                }
            })
    }, [numContrato, snackbar.open, navigate])

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
                                <Box sx={{ display: 'flex' }}>
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
                                                        width: '11.25rem',
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
                                                        width: '11.25rem',
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
                                            setDados={setDados}
                                            estaCarregado={estaCarregado}
                                            numContrato={numContrato}
                                            setSnackbar={setSnackbar}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={1}>
                                        <ListaCertidoes 
                                            certidoes={certidoes}
                                            setCertidoes={setCertidoes}
                                            mudancaCertidoes={mudancaCertidoes}
                                            setMudancaCertidoes={setMudancaCertidoes}
                                            carregandoCertidoes={carregandoCertidoes}
                                            setCarregandoCertidoes={setCarregandoCertidoes}
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
                                            setGarantias={setGarantias}
                                            mudancaGarantias={mudancaGarantias}
                                            setMudancaGarantias={setMudancaGarantias}
                                            carregandoGarantias={carregandoGarantias}
                                            setCarregandoGarantias={setCarregandoGarantias}
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
                                            setFiscalizacoes={setFiscalizacoes}
                                            mudancaFiscalizacoes={mudancaFiscalizacoes}
                                            setMudancaFiscalizacoes={setMudancaFiscalizacoes}
                                            carregandoFiscalizacoes={carregandoFicalizacoes}
                                            setCarregandoFiscalizacoes={setCarregandoFiscalizacoes}
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
                                            setLocais={setLocais}
                                            mudancaLocais={mudancaLocais}
                                            setMudancaLocais={setMudancaLocais}
                                            carregandoLocais={carregandoLocais}
                                            setCarregandoLocais={setCarregandoLocais}
                                            estaCarregado={estaCarregado}
                                            retornaCampoValor={retornaCampoValor}
                                            numContrato={numContrato}
                                            setSnackbar={setSnackbar}
                                        />
                                    </TabPanel>
                                    
                                    <TabPanel value={value} index={5}>
                                        <ListaAditamentosValor
                                            aditamentos_valor={aditamentos_valor}
                                            setaditamentos_valor={setaditamentos_valor}
                                            mudancaAditamentos_valor={mudancaAditamentos_valor}
                                            setMudancaAditamentos_valor={setMudancaAditamentos_valor}
                                            carregandoAditamentos_valor={carregandoAditamentos_valor}
                                            setCarregandoAditamentos_valor={setCarregandoAditamentos_valor}
                                            estaCarregado={estaCarregado}
                                            formataValores={formataValores}
                                            retornaCampoValor={retornaCampoValor}
                                            numContrato={numContrato}
                                            setSnackbar={setSnackbar}
                                        />                                                                                                               
                                    </TabPanel>

                                    <TabPanel value={value} index={6}>
                                        <ListaAditamentosPrazo
                                            aditamentos_prazo={aditamentos_prazo}
                                            setaditamentos_prazo={setaditamentos_prazo}
                                            mudancaAditamentos_prazo={mudancaAditamentos_prazo}
                                            setMudancaAditamentos_prazo={setMudancaAditamentos_prazo}
                                            carregandoAditamentos_prazo={carregandoAditamentos_prazo}
                                            setCarregandoAditamentos_prazo={setCarregandoAditamentos_prazo}
                                            estaCarregado={estaCarregado}
                                            formataData={formataData}
                                            retornaCampoValor={retornaCampoValor}
                                            numContrato={numContrato}
                                            setSnackbar={setSnackbar}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={7}>
                                        <ListaNotasEmpenho
                                            notasempenho={notasempenho}
                                            estaCarregado={estaCarregado}
                                            formataData={formataData}
                                            formataValores={formataValores}
                                            retornaCampoValor={retornaCampoValor} 
                                            snackbar={snackbar}
                                            setSnackbar={setSnackbar}
                                            numContrato={numContrato}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={8}>
                                        <ListaDotacoes 
                                            dotacoes={dotacoes}
                                            estaCarregado={estaCarregado}
                                            formataValores={formataValores}
                                            retornaCampoValor={retornaCampoValor}
                                            numContrato={numContrato}
                                            tipoDotacoes={tipoDotacoes}
                                            origemRecursos={origemRecursos}
                                            setSnackbar={setSnackbar}
                                        />
                                    </TabPanel>
                                </Box>
                            </Box>

                            <ExecucaoFinanceira 
                                execucao_financeira={dados.execucao_financeira}
                                formataValores={formataValores}
                                numContrato={numContrato}
                                setSnackbar={setSnackbar}
                            />

                            <DadosEmpresa
                                nome_empresa={dados.nome_empresa}
                                telefone_empresa={dados.telefone_empresa}
                                email_empresa={dados.email_empresa}
                                estaCarregado={estaCarregado}
                                formContrato={dados}
                                setFormContrato={setDados}
                                numContrato={numContrato}
                                setSnackbar={setSnackbar}
                            />

                            <OutrasInformacoes 
                                outras_informacoes={dados.outras_informacoes}
                                formContrato={dados}
                                setFormContrato={setDados}
                                numContrato={numContrato}
                                setSnackbar={setSnackbar}
                            />

                        </Box>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}

export default DadosContrato;