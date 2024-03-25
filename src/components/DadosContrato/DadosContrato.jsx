import React, { useEffect, useState } from 'react';
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
import { throwableGetData } from '../../commom/utils/api';
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
import { useQuery } from '@tanstack/react-query';
import { useInitialRender } from '../../commom/utils/hooks';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';

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
    const [mudancaContrato, setMudancaContrato] = useState(false);

    const { numContrato } = useParams();
    const initialRender = useInitialRender()
    const navigate = useNavigate();
    const setSnackbar = useSetAtom(snackbarAtom)

    const dadosTotalizador = useQuery({
        queryFn: () => throwableGetData({path: 'totalizadores_contrato', contratoId: numContrato}),
        queryKey: ['totalizadores'],
    })

    const contratoDados = useQuery({
        queryFn: async () => (await throwableGetData({path: `contrato/${numContrato}`})).data,
        queryKey: ['contratoDados', numContrato],
        refetchOnWindowFocus: false,
        onError: (res) => {
            if(res.status === 404) {
                navigate("../404", { replace: true })
            } else if(res.status === 401) {
                localStorage.removeItem('access_token');
                navigate("../contrato", { replace: true });
            }
        }
    })

    function avisoDataDefinitiva(contrato) {
        const {termo_recebimento_provisorio, termo_recebimento_definitivo, estado_id} = contrato
        return !!termo_recebimento_provisorio && !termo_recebimento_definitivo && (estado_id == 4)
    }


    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const contratoTabs = [
        {
            nome: 'Contrato',
            element: 
                <ListaDadosContrato
                    dados={contratoDados.data}
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
            nome: 'Reajustes',
            element: <ListaReajustes numContrato={numContrato}/>,
        },
    ]
    
    useEffect(() => {
        if(!contratoDados.isFetching && avisoDataDefinitiva(contratoDados.data)) {
            setSnackbar(prev => ({...prev, 
                open: true,
                severity: 'warning',
                message: <p>Apenas data de recebimento provisória definida até o momento.<br/>Lembre-se de preencher a data de recebimento definitivo o quanto antes.</p>
            }))
        }
        console.log(contratoDados.isFetching)
    }, [contratoDados.isFetching])


    return (
        <>
            <Backdrop 
                open={contratoDados.isFetching}
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
                                Contrato # <strong>{contratoDados.data?.id ?? " "}</strong>
                            </Typography>

                            <Box 
                                className=" overflow-x-scroll overflow-y-hidden"
                                id="totalizador-container"
                            >
                                <Box className="grid grid-cols-12 gap-2">
                                    <TotalizadorCardEle 
                                        className="col-span-4 bg-[#54ada4]"
                                        title="Total Reservado"
                                        val={dadosTotalizador?.data?.totalResevado.toLocaleString('pt-BR', { minimumFractionDigits: 2}) ?? ""}
                                    />
                                    <TotalizadorCardEle 
                                        className="col-span-4 bg-[#54ada4]"
                                        title="Total Empenhado"
                                        val={dadosTotalizador?.data?.totalEmpenhado.toLocaleString('pt-BR', { minimumFractionDigits: 2}) ?? ""}
                                    />
                                    <TotalizadorCardEle 
                                        className="col-span-4 bg-[#54ada4]"
                                        title="Saldo"
                                        val={dadosTotalizador?.data?.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2}) ?? ""}
                                    />
                                    <TotalizadorCardEle 
                                        className="col-span-6 bg-[#2c756f]"
                                        title="Realizado (Liquidado)"
                                        val={dadosTotalizador?.data?.realizado.toLocaleString('pt-BR', { minimumFractionDigits: 2}) ?? ""}
                                        icon={<ReceiptLongOutlinedIcon className='text-[5rem] text-white' />}
                                    />
                                    <TotalizadorCardEle 
                                        className="col-span-6 bg-[#2c756f]"
                                        title="Devoluções"
                                        val={dadosTotalizador?.data?.totalDevolucoes.toLocaleString('pt-BR', { minimumFractionDigits: 2}) ?? ""}
                                        icon={<CurrencyExchangeOutlinedIcon className='text-[5rem] text-white' />}
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

                            {contratoDados.data?.empresa_id !== null 
                                ?<CardEmpresa 
                                    centered
                                    displayOnly
                                    empresa={{
                                        nome: contratoDados.data?.empresa,
                                        cnpj_formatado: formataCpfCnpj(contratoDados.data?.empresa_cnpj),
                                        email: contratoDados.data?.empresa_email,
                                        telefone: contratoDados.data?.empresa_telefone
                                    }} 
                                />
                                :<Typography className='text-red-500 font-bold'>Nenhum dado de empresa disponível para este contrato!</Typography>
                            }

                            <ExecucaoFinanceira 
                                numContrato={numContrato}
                                //totais={totais}
                            />

                            <OutrasInformacoes 
                                dados={contratoDados?.data}
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