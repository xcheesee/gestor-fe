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
} from '@mui/material';
import ExecucaoFinanceira from './ExecucaoFinanceira';
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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ListaReajustes from '../ListaReajustes';
import { getContrato, getContrTot, getRecursos } from '../../commom/utils/api';
import { formataCpfCnpj } from '../../commom/utils/utils';
import { CardEmpresa } from '../CampoEmpresa';

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

const a11yProps = (index) => {
    return {
        id: `aba-${index}`,
        'aria-controls': `aba-${index}`,
    };
}

const ListaTabs = [
    'Contrato',
    'Certidões',
    'Garantias',
    'Fiscalização',
    'Regionalização',
    'Aditamentos de valor',
    'Aditamentos de prazo',
    'Notas de empenho',
    'Dotações',
    'Reajuste'
];

const DadosContrato = ({ setSnackbar }) => {
    const [value, setValue] = useState(0);
    const [dados, setDados] = useState({});
    const [mudancaContrato, setMudancaContrato] = useState(false);
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
    const [notasempenho, setNotasEmpenho] = useState([]);
    const [mudancaNotasEmpenho, setMudancaNotasEmpenho] = useState(false);
    const [carregandoNotasEmpenho, setCarregandoNotasEmpenho] = useState(true);
    const [origemRecursos, setOrigemRecursos] = useState([]);
    const [totais, setTotais] = useState([]);
    const [estaCarregado, setEstaCarregado] = useState(false);
    const { numContrato } = useParams();
    
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setEstaCarregado(false)
            const contrato = await getContrato(numContrato)
            if (contrato.status === 404) {
                navigate("../404", { replace: true });
            } else if(contrato.status === 401) {
                localStorage.removeItem('access_token');
                navigate("../contrato", { replace: true });
            }
            setDados(contrato?.data)
            const [recOri, totRec] = await Promise.all([
                getRecursos(),
                getContrTot(numContrato),
            ])
            setOrigemRecursos(recOri.data)
            setTotais(totRec.data)
            setEstaCarregado(true)
        })();
    }, [numContrato, navigate, mudancaContrato])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <>
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
                    <Link to="/contrato">
                        <Button sx={{ textTransform: 'none' }} size="large">
                            <ArrowBackIosIcon /> Voltar
                        </Button>
                    </Link>
                        <Box sx={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                            <Typography variant="h2" component="h1" sx={{ fontSize: '2rem' }}>
                                Contrato # <strong>{estaCarregado ? dados?.id : " "}</strong>
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
                                            dados={dados}
                                            numContrato={numContrato}
                                            setSnackbar={setSnackbar}
                                            mudancaContrato={mudancaContrato}
                                            setMudancaContrato={setMudancaContrato}
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
                                            numContrato={numContrato}
                                            setSnackbar={setSnackbar}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={7}>
                                        <ListaNotasEmpenho
                                            notasempenho={notasempenho}
                                            setNotasEmpenho={setNotasEmpenho}
                                            mudancaNotasEmpenho={mudancaNotasEmpenho}
                                            setMudancaNotasEmpenho={setMudancaNotasEmpenho}
                                            carregandoNotasEmpenho={carregandoNotasEmpenho}
                                            setCarregandoNotasEmpenho={setCarregandoNotasEmpenho}
                                            setSnackbar={setSnackbar}
                                            numContrato={numContrato}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={8}>
                                        <ListaDotacoes 
                                            numContrato={numContrato}
                                            origemRecursos={origemRecursos}
                                            setSnackbar={setSnackbar}
                                        />
                                    </TabPanel>
                                    <TabPanel value={value} index={9}>
                                        <ListaReajustes 
                                            numContrato={numContrato} 
                                            setSnackbar={setSnackbar}/>
                                    </TabPanel>
                                </Box>
                            </Box>

                            <ExecucaoFinanceira 
                                //execucao_financeira={dados?.execucao_financeira}
                                numContrato={numContrato}
                                setSnackbar={setSnackbar}
                                mudancaContrato={mudancaContrato}
                                setMudancaContrato={setMudancaContrato}
                                totais={totais}
                            />

                            <Typography variant="h2" sx={{ fontSize: '2rem', margin: '2rem 0' }}>
                                Dados da empresa
                            </Typography>
                            {dados?.empresa_id !== null 
                                ?<CardEmpresa 
                                    centered
                                    displayOnly
                                    empresa={{
                                        nome: dados?.empresa,
                                        cnpj_formatado: formataCpfCnpj(dados?.empresa_cnpj),
                                        email: dados?.empresa_email,
                                        telefone: dados?.empresa_telefone
                                    }} 
                                />
                                :<Typography className='text-red-500 font-bold'>Nenhum dado de empresa disponível para este contrato!</Typography>
                            }

                            <OutrasInformacoes 
                                outras_informacoes={dados?.outras_informacoes}
                                dados={dados}
                                numContrato={numContrato}
                                setSnackbar={setSnackbar}
                                mudancaContrato={mudancaContrato}
                                setMudancaContrato={setMudancaContrato}
                            />
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}

export default DadosContrato;