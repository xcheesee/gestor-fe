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
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';

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

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

const ListaDadosContrato = (props) => {
    const {
        formataCpfCnpj,
        primeiraLetraMaiuscula,
        formataData,
        formataValores,
        retornaCampoValor,
        dados,
        estaCarregado,
        numContrato,
        setSnackbar,
        mudancaContrato,
        setMudancaContrato
    } = props;

    const [value, setValue] = useState(0);
    const [modelosLicitacao, setModelosLicitacao] = useState([]);
    const [openProcCon, setOpenProcCon] = useState(false);
    const [openDadosCon, setOpenDadosCon] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [contratoEditado, setContratoEditado] = useState({...dados});

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

    const TabContrato = (props) => {
        const campos = [
            "Processo SEI",
            "Credor",
            "CPF/CNPJ",
            "Tipo de objeto",
            "Objeto",
            "Número do contrato",
            "Data de assinatura",
            "Valor do contrato",
            "Valor mensal estimativo",
            "Data de início da vigência",
            "Data de vencimento",
            "Condição de pagamento",
            "Prazo a partir de",
            "Prazo máximo",
            "Número nota reserva",
            "Valor reserva"
        ];
    
        const valores = [
            props.processo_sei,
            props.credor,
            formataCpfCnpj(props.cnpj_cpf),
            primeiraLetraMaiuscula(props.tipo_objeto),
            props.objeto,
            props.numero_contrato ,
            formataData(props.data_assinatura),
            formataValores(props.valor_contrato),
            formataValores(props.valor_mensal_estimativo),
            formataData(props.data_inicio_vigencia),
            formataData(props.data_vencimento),
            props.condicao_pagamento,
            props.prazo_a_partir_de,
            formataData(props.data_prazo_maximo),
            props.numero_nota_reserva,
            formataValores(props.valor_reserva),
        ];
    
        return retornaCampoValor(campos, valores, props.estaCarregado);
    }

    const TabProcessoContratacao = (props) => {
        const campos = [
            "Modelo de licitação",
            "Envio de material técnico",
            "Minuta edital",
            "Abertura certame",
            "Homologação"
        ];

        const valores = [
            props.licitacao_modelo,
            formataData(props.envio_material_tecnico),
            formataData(props.minuta_edital),
            formataData(props.abertura_certame),
            formataData(props.homologacao)
        ];

        return retornaCampoValor(campos, valores, props.estaCarregado);
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
                        processo_sei={dados.processo_sei}
                        credor={dados.credor}
                        cnpj_cpf={dados.cnpj_cpf}
                        tipo_contratacao={dados.tipo_contratacao}
                        tipo_objeto={dados.tipo_objeto}
                        objeto={dados.objeto}
                        numero_contrato={dados.numero_contrato}
                        data_assinatura={dados.data_assinatura}
                        valor_contrato={dados.valor_contrato}
                        valor_mensal_estimativo={dados.valor_mensal_estimativo}
                        data_inicio_vigencia={dados.data_inicio_vigencia}
                        data_vencimento={dados.data_vencimento}
                        condicao_pagamento={dados.condicao_pagamento}
                        prazo_a_partir_de={dados.prazo_a_partir_de}
                        data_prazo_maximo={dados.data_prazo_maximo}
                        numero_nota_reserva={dados.numero_nota_reserva}
                        valor_reserva={dados.valor_reserva}
                        envio_material_tecnico={dados.envio_material_tecnico}
                        minuta_edital={dados.minuta_edital}
                        abertura_certame={dados.abertura_certame}
                        homologacao={dados.homologacao}
                        fonte_recurso={dados.fonte_recurso}
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
                        onMouseDown={() => setContratoEditado({...dados})}
                        onMouseUp={() => setOpenDadosCon(true)}
                    >
                        <EditIcon sx={{ mr: '0.3rem' }} /> Editar contrato
                    </Fab>

                    <FormDadosContrato 
                        formContrato={dados}
                        numContrato={numContrato}
                        openDadosCon={openDadosCon}
                        setOpenDadosCon={setOpenDadosCon}
                        setSnackbar={setSnackbar}
                        carregando={carregando}
                        mudancaContrato={mudancaContrato}
                        setMudancaContrato={setMudancaContrato}
                        contratoEditado={contratoEditado}
                        setContratoEditado={setContratoEditado}
                    />
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <TabProcessoContratacao 
                        licitacao_modelo={dados.licitacao_modelo}
                        envio_material_tecnico={dados.envio_material_tecnico}
                        minuta_edital={dados.minuta_edital}
                        abertura_certame={dados.abertura_certame}
                        homologacao={dados.homologacao}
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
                        formContrato={dados}
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