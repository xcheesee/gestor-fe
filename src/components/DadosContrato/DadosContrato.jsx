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
import DelContratoEle from '../DelContratoEle';

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

const DadosContrato = () => {
    const [value, setValue] = useState(0);
    const [dados, setDados] = useState({});
    const [mudancaContrato, setMudancaContrato] = useState(false);
    //const [origemRecursos, setOrigemRecursos] = useState([]);
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
            const [ totRec] = await Promise.all([
                //getRecursos(),
                getContrTot(numContrato),
            ])
            //setOrigemRecursos(recOri.data)
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
                                            mudancaContrato={mudancaContrato}
                                            setMudancaContrato={setMudancaContrato}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={1}>
                                        <ListaCertidoes numContrato={numContrato}/>
                                    </TabPanel>

                                    <TabPanel value={value} index={2}>
                                        <ListaGarantias numContrato={numContrato} />
                                    </TabPanel>

                                    <TabPanel value={value} index={3}>
                                        <ListaFiscalizacao numContrato={numContrato} />
                                    </TabPanel>

                                    <TabPanel value={value} index={4}>
                                        <ListaLocais numContrato={numContrato} />
                                    </TabPanel>
                                    
                                    <TabPanel value={value} index={5}>
                                        <ListaAditamentosValor numContrato={numContrato} />                                                                                                               
                                    </TabPanel>

                                    <TabPanel value={value} index={6}>
                                        <ListaAditamentosPrazo numContrato={numContrato} />
                                    </TabPanel>

                                    <TabPanel value={value} index={7}>
                                        <ListaNotasEmpenho numContrato={numContrato} />
                                    </TabPanel>

                                    <TabPanel value={value} index={8}>
                                        <ListaDotacoes numContrato={numContrato} />
                                    </TabPanel>
                                    <TabPanel value={value} index={9}>
                                        <ListaReajustes numContrato={numContrato} />
                                    </TabPanel>
                                </Box>
                            </Box>

                            <ExecucaoFinanceira 
                                numContrato={numContrato}
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
                                mudancaContrato={mudancaContrato}
                                setMudancaContrato={setMudancaContrato}
                            />
                            <Box className='flex justify-end'>
                                <DelContratoEle numContrato={numContrato} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}

export default DadosContrato;