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
import ListaLocais from '../ListaLocais';
import ListaDotacoes from '../ListaDotacoes';
import ListaNotasEmpenho from '../ListaNotasEmpenho';
import ListaAditamentosValor from '../ListaAditamentosValor';
import ListaAditamentosPrazo from '../ListaAditamentosPrazo';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ListaReajustes from '../ListaReajustes';
import { getContrato, /*getContrTot, getRecursos*/ } from '../../commom/utils/api';
import { formataCpfCnpj } from '../../commom/utils/utils';
import { CardEmpresa } from '../CampoEmpresa';
import DelContratoEle from '../DelContratoEle';
import ListaFiscalizacoes from '../ListaFiscalizacoes';
import ListaNotasReserva from '../ListaNotasReserva';
import ListaNotasLiquidacao from '../ListaNotasLiquidacao';
import ListaDevolucoes from '../ListaDevolucoes';
import TotalizadorCardEle from '../TotalizadorCardEle';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';

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
                    <Box className="h-full w-full">{children}</Box>
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

const DadosContrato = () => {
    const [value, setValue] = useState(0);
    const [dados, setDados] = useState({});
    const [mudancaContrato, setMudancaContrato] = useState(false);
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
            setEstaCarregado(true)
        })();
    }, [numContrato, navigate, mudancaContrato])

    useEffect(() => {
        const totContainer = document.getElementById('totalizador-container')

        function horizontalScroll(e) {
            e.preventDefault()
            totContainer.scrollLeft += e.deltaY;
        }

        totContainer.addEventListener("wheel", horizontalScroll)
        return () => totContainer.removeEventListener('wheel', horizontalScroll)
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const contratoTabs = [
        {
            nome: 'Contrato',
            element: 
                <ListaDadosContrato
                    dados={dados}
                    numContrato={numContrato}
                    mudancaContrato={mudancaContrato}
                    setMudancaContrato={setMudancaContrato}
                />
        },
        {
            nome: 'Certidões',
            element: <ListaCertidoes numContrato={numContrato}/>,
        },
        {
            nome: 'Garantias',
            element: <ListaGarantias numContrato={numContrato}/>,
        },
        {
            nome: 'Fiscalização',
            element: <ListaFiscalizacoes numContrato={numContrato}/>,
        },
        {
            nome: 'Regionalização',
            element: <ListaLocais numContrato={numContrato}/>,
        },
        {
            nome: 'Aditamentos de valor',
            element: <ListaAditamentosValor numContrato={numContrato}/>,
        },
        {
            nome: 'Aditamento de prazo',
            element: <ListaAditamentosPrazo numContrato={numContrato}/>,
        },
        {
            nome: 'Notas de empenho',
            element: <ListaNotasEmpenho numContrato={numContrato}/>,
        },
        {
            nome: 'Notas de reserva',
            element: <ListaNotasReserva numContrato={numContrato} />
        },
        {
            nome: 'Notas de liquidação',
            element: <ListaNotasLiquidacao numContrato={numContrato} />
        },
        {
            nome: 'Devoluções',
            element: <ListaDevolucoes numContrato={numContrato} />
        },
        {
            nome: 'Dotações',
            element: <ListaDotacoes numContrato={numContrato}/>,
        },
        {
            nome: 'Reajuste',
            element: <ListaReajustes numContrato={numContrato}/>,
        },
    ]


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
                        <Box sx={{ display: 'flex', flexDirection: 'column', margin: '1rem', gap: '2rem' }}>
                            <Typography variant="h2" component="h1" sx={{ fontSize: '2rem' }}>
                                Contrato # <strong>{estaCarregado ? dados?.id : " "}</strong>
                            </Typography>
                            <Box 
                                className=" overflow-x-scroll overflow-y-hidden"
                                id="totalizador-container"
                            >
                            <Box className="grid grid-rows-3 grid-flow-col auto-cols-[90px] gap-2">
                                <TotalizadorCardEle 
                                    className="col-span-4 bg-[#3b948c]"
                                    title="Total Reservado"
                                    val={109492.88}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-4 bg-[#54ada4]"
                                    title="Total Empenhado"
                                    val={109492.88}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-4 bg-[#7fc9bf]"
                                    title="Média Mensal Empenhado"
                                    val={109492.88}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-6 bg-[#2c756f]"
                                    title="Realizado (Liquidado)"
                                    val={109492.88}
                                    icon={<ReceiptLongOutlinedIcon className='text-[5rem] text-white' />}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-6 bg-[#2c756f]"
                                    title="Média Mensal Realizado"
                                    val={109492.88}
                                    icon={<BarChartOutlinedIcon className='text-[5rem] text-white' />}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-8 bg-[#54ada4]"
                                    title="Devoluções"
                                    val={109492.88}
                                    icon={<CurrencyExchangeOutlinedIcon className='text-[5rem] text-white' />}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-4 bg-[#54ada4]"
                                    title="Saldo"
                                    val={109492.88}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-4 bg-[#3b948c]"
                                    title="Total Reservado"
                                    val={109492.88}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-4 bg-[#54ada4]"
                                    title="Total Empenhado"
                                    val={109492.88}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-4 bg-[#7fc9bf]"
                                    title="Média Mensal Empenhado"
                                    val={109492.88}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-6 bg-[#2c756f]"
                                    title="Realizado (Liquidado)"
                                    val={109492.88}
                                    icon={<ReceiptLongOutlinedIcon className='text-[5rem] text-white' />}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-6 bg-[#2c756f]"
                                    title="Média Mensal Realizado"
                                    val={109492.88}
                                    icon={<BarChartOutlinedIcon className='text-[5rem] text-white' />}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-8 bg-[#54ada4]"
                                    title="Devoluções"
                                    val={109492.88}
                                    icon={<CurrencyExchangeOutlinedIcon className='text-[5rem] text-white' />}
                                />
                                <TotalizadorCardEle 
                                    className="col-span-4 bg-[#54ada4]"
                                    title="Saldo"
                                    val={109492.88}
                                />
                            </Box>
                            </Box>

                            <Box sx={{ display: 'flex', width: '100%' }} className='rounded overflow-hidden' component={Paper} elevation={5}>
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

                                        {contratoTabs.map((tab, index) => {
                                            return (
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
                                                    label={tab.nome}
                                                    {...a11yProps(index)}
                                                    key={index} 
                                                />
                                            )
                                        })}
                                    </Tabs>

                                    <Divider orientation="vertical" />
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    {contratoTabs.map((tab, i) => {
                                        return (
                                            <TabPanel value={value} index={i} key={`tab-${i}`}>
                                                {tab.element}
                                            </TabPanel>
                                        )
                                    })}
                                </Box>
                            </Box>

                            <Typography variant="h2" sx={{ fontSize: '2rem' }}>
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

                            <ExecucaoFinanceira 
                                numContrato={numContrato}
                                //totais={totais}
                            />


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