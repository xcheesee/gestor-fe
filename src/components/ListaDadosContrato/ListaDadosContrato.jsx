import React, { useEffect, useState } from 'react';
import { 
    Box,
    Paper,
    Fab,
    Tabs,
    Tab,
    Fade
} from '@mui/material';
import FormDadosContrato from './FormDadosContrato';
import FormProcessoContratacao from './FormProcessoContratacao';
import EditIcon from '@mui/icons-material/Edit';
import { formataCpfCnpj, formataData, formataValores, mascaraContrato, mascaraProcessoSei, primeiraLetraMaiuscula, TabValues } from '../../commom/utils/utils';
import { contratoLabels } from '../../commom/utils/constants';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    let valores = {}

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
        retornaCampoValor,
        dados,
        estaCarregado,
        numContrato,
        setSnackbar,
        mudancaContrato,
        setMudancaContrato,
    } = props;

    const [value, setValue] = useState(0);
    const [modelosLicitacao, setModelosLicitacao] = useState([]);
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

    const handleChange = (e, newValue) => {
        setValue(newValue);
    }

    const TabContrato = ({ dados , estaCarregado }) => {
        // const campos = [
        //     "Departamento",
        //     "Processo SEI",
        //     "Credor",
        //     "CPF/CNPJ",
        //     "Tipo de objeto",
        //     "Objeto",
        //     "Número do contrato",
        //     "Valor do contrato",
        //     "Valor mensal estimativo",
        //     "Condição de pagamento",
        //     "Número nota reserva",
        //     "Valor reserva"
        // ];
    
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
        // const campos = [
        //     "Modalidade de licitação",
        //     "Envio de material técnico",
        //     "Minuta edital",
        //     "Abertura certame",
        //     "Homologação",
        //     "Data de assinatura",
        //     "Data de início da vigência",
        //     "Data de vencimento",
        //     "Prazo máximo",
        // ];

        const valores = {
            licitacao_modelo: props.licitacao_modelo,
            envio_material_tecnico: formataData(props.envio_material_tecnico),
            minuta_edital: formataData(props.minuta_edital),
            abertura_certame: formataData(props.abertura_certame),
            homologacao: formataData(props.homologacao),
            data_assinatura: formataData(dados?.data_assinatura),
            data_inicio_vigencia: formataData(dados?.data_inicio_vigencia),
            data_vencimento: formataData(dados?.data_vencimento),
            data_prazo_maximo: formataData(dados?.data_prazo_maximo),
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
                        estaCarregado={estaCarregado}
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
                        envio_material_tecnico={dados?.envio_material_tecnico}
                        minuta_edital={dados?.minuta_edital}
                        abertura_certame={dados?.abertura_certame}
                        homologacao={dados?.homologacao}
                        estaCarregado={estaCarregado}
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