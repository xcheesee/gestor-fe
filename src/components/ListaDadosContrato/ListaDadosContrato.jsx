import React, { useEffect, useState } from 'react';
import { 
    Box,
    Paper,
    Fab,
    Tabs,
    Tab,
    Fade,
} from '@mui/material';
import FormDadosContrato from './FormDadosContrato';
import FormProcessoContratacao from './FormProcessoContratacao';
import EditIcon from '@mui/icons-material/Edit';
import { formataCpfCnpj, formataData, formataValores, mascaraContrato, mascaraProcessoSei, primeiraLetraMaiuscula, TabValues } from '../../commom/utils/utils';
import { contratoLabels } from '../../commom/utils/constants';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tab-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

const a11yProps = (index) => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

const ListaDadosContrato = (props) => {
    const {
        dados,
        numContrato,
        setSnackbar,
        mudancaContrato,
        setMudancaContrato,
    } = props;

    const [value, setValue] = useState(0);
    const [modelosLicitacao, setModelosLicitacao] = useState([]);
    const [estados, setEstados] = useState([]);
    const [openProcCon, setOpenProcCon] = useState(false);
    const [openDadosCon, setOpenDadosCon] = useState(false);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/licitacaomodelos`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => res.json())
            .then(data => { 
                setModelosLicitacao(data.data);
                setCarregando(false);
            });
    }, [])

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/estados`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => res.json())
            .then(data => { 
                setEstados(data.data);
                setCarregando(false);
            });
    }, [])

    const handleChange = (e, newValue) => {
        setValue(newValue);
    }

    const TabContrato = ({ dados }) => {
        const valores = {
            departamento: dados?.departamento,
            processo_sei: mascaraProcessoSei(dados?.processo_sei),
            credor: dados?.credor,
            cnpj_cpf: formataCpfCnpj(dados?.cnpj_cpf),
            tipo_objeto: primeiraLetraMaiuscula(dados?.tipo_objeto),
            objeto: dados?.objeto,
            numero_contrato: mascaraContrato(dados?.numero_contrato),
            valor_contrato: formataValores(dados?.valor_contrato),
            valor_mensal_estimativo: formataValores(dados?.valor_mensal_estimativo),
            condicao_pagamento: dados?.condicao_pagamento,
            numero_nota_reserva: dados?.numero_nota_reserva,
            valor_reserva: formataValores(dados?.valor_reserva),
        };
    
        return <TabValues entry={valores} labels={contratoLabels} label="contrato" />
    }

    const TabProcessoContratacao = (props) => {
        function DateDisplay(date, diff) {
            return (
                <>
                <Box className='mb-2 inline-block font-bold' sx={{color: 'hsl(201, 0%, 20%)'}}>{date}</Box>
                <Box className='ml-4'>
                    <Box style={{color: 'hsl(201, 0%, 60%)'}}><span className='font-medium'></span> +{diff} dia(s) </Box>
                </Box>
            </>
                // `${date} ( +${diff} dia(s) )`
                )
        }

        function VencimentoEle () {
            return(
                <>
                    <Box className='mb-2 inline-block font-bold' sx={{color: 'hsl(201, 0%, 20%)'}}>{formataData(dados?.data_vencimento)}</Box>
                    <Box className='ml-4'>
                        <Box style={{color: 'hsl(201, 0%, 60%)'}}><span className='font-medium'>Envio material técnico</span>:  +{dados.diferenca_envio_vencimento} dia(s) </Box>
                        <Box style={{color: 'hsl(201, 0%, 60%)'}}><span className='font-medium'>Homologacao</span>:  +{dados.diferenca_homologacao_vencimento} dia(s) </Box>
                        <Box style={{color: 'hsl(201, 0%, 60%)'}}><span className='font-medium'>Vigencia</span>:  +{dados.diferenca_vigencia_vencimento} dia(s) </Box>
                    </Box>
                </>
            )
        }
        const valores = {
            licitacao_modelo: props.licitacao_modelo,
            estado: props.estado,
            data_assinatura: <Box className='mb-2 inline-block font-bold' sx={{color: 'hsl(201, 0%, 20%)'}}>{formataData(dados?.data_assinatura)}</Box>,
            envio_material_tecnico: <Box className='mb-2 inline-block font-bold' sx={{color: 'hsl(201, 0%, 20%)'}}>{formataData(props.envio_material_tecnico)}</Box>,
            minuta_edital: DateDisplay(formataData(props.minuta_edital), dados.diferenca_envio_minuta),
            abertura_certame: DateDisplay(formataData(props.abertura_certame), dados.diferenca_minuta_abertura),
            homologacao: DateDisplay(formataData(props.homologacao), dados.diferenca_abertura_homologacao),
            data_inicio_vigencia: DateDisplay(formataData(dados?.data_inicio_vigencia), dados.diferenca_homologacao_vigencia),
            data_vencimento: <VencimentoEle/>,
            data_prazo_maximo: DateDisplay(formataData(dados?.data_prazo_maximo), dados.diferenca_vencimento_prazo_maximo),
        };

        return <TabValues entry={valores} labels={contratoLabels} label="processo_contratacao" />;
    }

    return (
        <Fade in={true} timeout={400}>
            <Box component={Paper} elevation={3} sx={{ padding: '1rem', pt: 0 }}>
                <Box sx={{ mb: '1rem' }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Contrato" {...a11yProps(0)} sx={{ padding: '0 1rem', textTransform: 'none' }} />
                        <Tab label="Processo de contratação" {...a11yProps(1)} sx={{ padding: '0 1rem', textTransform: 'none' }} />
                    </Tabs>
                </Box>
                
                <TabPanel value={value} index={0}>
                    <TabContrato 
                        dados={dados}
                    />

                    <Fab 
                        sx={{ 
                            position: 'sticky', 
                            bottom: '0px', 
                            left: '100%',
                            zIndex: '80',
                            textTransform: 'none',
                            borderRadius: '5px'
                        }}
                        color="primary"
                        variant="extended"
                        onClick={() => setOpenDadosCon(true)}
                    >
                        <EditIcon sx={{ mr: '0.3rem' }} /> Editar contrato
                    </Fab>

                    <FormDadosContrato 
                        dados={dados}
                        numContrato={numContrato}
                        openDadosCon={openDadosCon}
                        setOpenDadosCon={setOpenDadosCon}
                        setSnackbar={setSnackbar}
                        carregando={carregando}
                        mudancaContrato={mudancaContrato}
                        setMudancaContrato={setMudancaContrato}
                    />
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <TabProcessoContratacao 
                        licitacao_modelo={dados?.licitacao_modelo}
                        estado={dados?.estado}
                        envio_material_tecnico={dados?.envio_material_tecnico}
                        minuta_edital={dados?.minuta_edital}
                        abertura_certame={dados?.abertura_certame}
                        homologacao={dados?.homologacao}
                    />

                    <Fab 
                        sx={{ 
                            position: 'sticky', 
                            bottom: '0px', 
                            left: '100%',
                            zIndex: '80',
                            textTransform: 'none',
                            borderRadius: '5px'
                        }}
                        color="primary"
                        variant="extended"
                        onClick={() => setOpenProcCon(true)}
                    >
                        <EditIcon sx={{ mr: '0.3rem' }} /> Editar processo de contratação
                    </Fab>

                    <FormProcessoContratacao 
                        dados={dados}
                        modelosLicitacao={modelosLicitacao}
                        estados={estados}
                        openProcCon={openProcCon}
                        setOpenProcCon={setOpenProcCon}
                        numContrato={numContrato}
                        setSnackbar={setSnackbar}
                        carregando={carregando}
                        mudancaContrato={mudancaContrato}
                        setMudancaContrato={setMudancaContrato}
                    />
                </TabPanel>

            </Box>
        </Fade>
    );
}

export default ListaDadosContrato;