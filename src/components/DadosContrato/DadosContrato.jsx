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
    Fab
} from '@mui/material';
import ExecucaoFinanceira from './ExecucaoFinanceira';
import DadosEmpresa from './DadosEmpresa';
import OutrasInformacoes from './OutrasInformacoes';
import ListaCertidoes from '../ListaCertidoes';
import ListaGarantias from '../ListaGarantias/ListaGarantias';
import ListaFiscalizacao from '../ListaFiscalizacoes';
import ListaRecOrcamentario from '../ListaRecOrcamentario';
import ListaLocais from '../ListaLocais';
import ListaAditamentos from '../ListaAdimentos';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
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

const primeiraLetraMaiuscula = (string) => {
    if (typeof string === "string") {
        return string[0].toUpperCase() + string.substring(1);
    } else {
        return "---";
    }
}

const TabContrato = (props) => {
    const campos = [
        "Processo SEI",
        "Dotação Orçamentária",
        "Credor",
        "CPF/CNPJ",
        "Tipo de contratação",
        "Tipo de objeto",
        "Objeto",
        "Número do contrato",
        "Data de assinatura",
        "Valor do contrato",
        "Data de início da vigência",
        "Data de vencimento",
        "Condição de pagamento",
        "Prazo a partir de",
        "Prazo máximo",
        "Envio do Material Técnico",
        "Minuta Edital",
        "Abertura Certame",
        "Data Homologação",
        "Fonte do Recurso"
    ];

    const valores = [
        props.processo_sei,
        props.dotacao_orcamentaria,
        props.credor,
        formataCpfCnpj(props.cnpj_cpf),
        props.tipo_contratacao,
        primeiraLetraMaiuscula(props.tipo_objeto),
        props.objeto,
        props.numero_contrato ,
        formataData(props.data_assinatura),
        formataValores(props.valor_contrato),
        formataData(props.data_inicio_vigencia),
        formataData(props.data_vencimento),
        props.condicao_pagamento,
        //`${props.prazo_contrato_meses} ${props.prazo_contrato_meses > 1 ? "meses" : "mês"}`,
        props.prazo_a_partir_de,
        formataData(props.data_prazo_maximo),
        formataData(props.envio_material_tecnico),
        formataData(props.minuta_edital),
        formataData(props.abertura_certame),
        formataData(props.homologacao),
        props.fonte_recurso
    ];

    return retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaTabs = [
    'Contrato',
    'Certidões',
    'Garantias',
    'Fiscalização',
    'Planejadas',
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
    const [locais, setLocais] = useState([]);
    const [aditamentos, setAditamentos] = useState([]);
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

        /*fetch(`${url}/recursoorcamentarios/${numContrato}`, options)
        .then(res => res.json())
        .then(data => {
            setRecOrcamentarios(data.data);
        })*/

        fetch(`${url}/servicoslocais/${numContrato}`, options)
        .then(res => res.json())
        .then(data => {
            setLocais(data.data);
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
                                        <Box component={Paper} elevation={3} sx={{ padding: '1rem' }}>
                                            <TabContrato 
                                                processo_sei={dados.processo_sei}
                                                dotacao_orcamentaria={dados.dotacao_orcamentaria}
                                                credor={dados.credor}
                                                cnpj_cpf={dados.cnpj_cpf}
                                                tipo_contratacao={dados.tipo_contratacao}
                                                tipo_objeto={dados.tipo_objeto}
                                                objeto={dados.objeto}
                                                numero_contrato={dados.numero_contrato}
                                                data_assinatura={dados.data_assinatura}
                                                valor_contrato={dados.valor_contrato}
                                                data_inicio_vigencia={dados.data_inicio_vigencia}
                                                data_vencimento={dados.data_vencimento}
                                                condicao_pagamento={dados.condicao_pagamento}
                                                prazo_a_partir_de={dados.prazo_a_partir_de}
                                                data_prazo_maximo={dados.data_prazo_maximo}
                                                envio_material_tecnico={dados.envio_material_tecnico}
                                                minuta_edital={dados.minuta_edital}
                                                abertura_certame={dados.abertura_certame}
                                                homologacao={dados.homologacao}
                                                fonte_recurso={dados.fonte_recurso}
                                                estaCarregado={estaCarregado}
                                            />

                                            <Link to={`../contrato/${numContrato}/editar`}>
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
                                            </Link>
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
                                        <ListaLocais 
                                            locais={locais}
                                            estaCarregado={estaCarregado}
                                            retornaCampoValor={retornaCampoValor}
                                            numContrato={numContrato}
                                            setSnackbar={setSnackbar}
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