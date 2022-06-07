import React, { useState, useEffect } from 'react';
import { 
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
    Fab
} from '@mui/material';
import DadosEmpresa from './DadosEmpresa';
import OutrasInformacoes from './OutrasInformacoes';
import ListaCertidoes from '../ListaCertidoes';
import ListaGarantias from '../ListaGarantias/ListaGarantias';
import ListaFiscalizacao from '../ListaFiscalizacoes';
import ListaRecOrcamentario from '../ListaRecOrcamentario';
import ListaAditamentos from '../ListaAdimentos';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useParams, Link } from 'react-router-dom';
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

const formataPorcentagem = (valor) => {
    const porcentagem = new Intl.NumberFormat('pt-BR', {
        style: "decimal"
    });

    if (valor === "") {
        return "";
    } else {
        return `${porcentagem.format(valor)} %`;
    }
}

const TabContrato = (props) => {
    const campos = [
        "Processo SEI",
        "Credor",
        "CPF/CNPJ",
        "Objeto",
        "Número do contrato",
        "Data de assinatura",
        "Valor do contrato",
        "Data de início da vigência",
        "Data de fim da vigência",
        "Condição de pagamento",
        "Prazo do contrato",
        "Prazo a partir de",
        "Prazo máximo"
    ];

    const valores = [
        props.processo_sei,
        props.credor,
        formataCpfCnpj(props.cnpj_cpf),
        props.objeto,
        props.numero_contrato ,
        formataData(props.data_assinatura),
        formataValores(props.valor_contrato),
        formataData(props.data_inicio_vigencia),
        formataData(props.data_fim_vigencia),
        props.condicao_pagamento,
        `${props.prazo_contrato_meses} ${props.prazo_contrato_meses > 1 ? "meses" : "mês"}`,
        props.prazo_a_partir_de,
        formataData(props.data_prazo_maximo)
    ];

    return retornaCampoValor(campos, valores, props.estaCarregado);
}

const TabLocaisServico = (props) => {
    const campos = [
        "Distrito",
        "Subprefeitura",
        "Região"
    ];

    const valores = [
        props.distrito,
        props.subprefeitura,
        props.regiao
    ];

    return retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaTabs = [
    'Contrato',
    'Certidões',
    'Garantias',
    'Fiscalização',
    'Recursos orçamentários',
    'Locais de serviço',
    'Aditamentos'
];

const DadosContrato = ({ snackbar, setSnackbar }) => {
    const [value, setValue] = useState(0);
    const [dados, setDados] = useState({});
    const [certidoes, setCertidoes] = useState([]);
    const [garantias, setGarantias] = useState([]);
    const [fiscalizacoes, setFiscalizacoes] = useState([]);
    const [recOrcamentarios, setRecOrcamentarios] = useState([]);
    // const [locais, setLocais] = useState([]);
    const [aditamentos, setAditamentos] = useState([]);
    const [estaCarregado, setEstaCarregado] = useState(false);
    const { numContrato } = useParams();
    
    
    useEffect(() => {
        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api`
        const token = sessionStorage.getItem('access_token');
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'GET'
        }
        
        fetch(`${url}/contrato/${numContrato}`, options)
        .then(res => res.json())
        .then(data => {
            setEstaCarregado(true);
            setDados(data.data);
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

        fetch(`${url}/recursoorcamentarios/${numContrato}`, options)
        .then(res => res.json())
        .then(data => {
            setRecOrcamentarios(data.data);
        })

        fetch(`${url}/aditamentos/${numContrato}`, options)
        .then(res => res.json())
        .then(data => {
            setAditamentos(data.data);
        })

    }, [numContrato, snackbar])

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
            
            <Fade in={true} timeout={750}>

                <Box sx={{ padding: '0 1rem' }}>
                    <Box sx={{ padding: '1rem', maxWidth: '1280px', margin: '2rem auto' }} component={Paper} elevation={5}>
                    <Link to="/principal">
                        <Button sx={{ textTransform: 'none' }} size="large">
                            <ArrowBackIosIcon /> Voltar
                        </Button>
                    </Link>
                        <Box sx={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                            <Typography variant="h2" component="h1" sx={{ fontSize: '2rem' }}>
                                Contrato número <strong>{dados.id}</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', width: '100%', margin: '2rem 0' }} component={Paper} elevation={3}>
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
                                                    sx={{ '&.Mui-selected': { background: '#2B5F50', color: 'white', borderTopLeftRadius: '3px', transition: '1s' }, 
                                                    alignItems: 'flex-start', 
                                                    textAlign: 'left', 
                                                    textTransform: 'none' }} 
                                                    label={label}
                                                    {...a11yProps(index)} 
                                                    key={index}
                                                />
                                                :
                                                <Tab 
                                                    sx={{ '&.Mui-selected': { background: '#2B5F50', color: 'white', transition: '1s' }, 
                                                    alignItems: 'flex-start', 
                                                    textAlign: 'left', 
                                                    textTransform: 'none' }} 
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
                                        <Box component={Paper} elevation={3} sx={{ padding: '1rem' }}>
                                            <TabContrato 
                                                processo_sei={dados.processo_sei}
                                                credor={dados.credor}
                                                cnpj_cpf={dados.cnpj_cpf}
                                                objeto={dados.objeto}
                                                numero_contrato={dados.numero_contrato}
                                                data_assinatura={dados.data_assinatura}
                                                valor_contrato={dados.valor_contrato}
                                                data_inicio_vigencia={dados.data_inicio_vigencia}
                                                data_fim_vigencia={dados.data_fim_vigencia}
                                                condicao_pagamento={dados.condicao_pagamento}
                                                prazo_contrato_meses={dados.prazo_contrato_meses}
                                                prazo_a_partir_de={dados.prazo_a_partir_de}
                                                data_prazo_maximo={dados.data_prazo_maximo}
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
                                            >
                                                <EditIcon sx={{ mr: '0.3rem' }} /> Editar dados
                                            </Fab>
                                        </Box>
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
                                        <ListaRecOrcamentario 
                                            recOrcamentarios={recOrcamentarios}
                                            estaCarregado={estaCarregado}
                                            formataValores={formataValores}
                                            retornaCampoValor={retornaCampoValor}
                                            numContrato={numContrato}
                                            setSnackbar={setSnackbar}
                                        />
                                    </TabPanel>

                                    <TabPanel value={value} index={5}>
                                        <TabLocaisServico 
                                            distrito=""
                                            subprefeitura=""
                                            regiao=""
                                            estaCarregado={estaCarregado}
                                        />
                                    </TabPanel>
                                        
                                    <TabPanel value={value} index={6}>
                                        <ListaAditamentos 
                                            aditamentos={aditamentos}
                                            estaCarregado={estaCarregado}
                                            formataValores={formataValores}
                                            formataData={formataData}
                                            formataPorcentagem={formataPorcentagem}
                                            retornaCampoValor={retornaCampoValor}
                                            numContrato={numContrato}
                                            setSnackbar={setSnackbar}
                                        />
                                    </TabPanel>
                                </Box>
                            </Box>

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