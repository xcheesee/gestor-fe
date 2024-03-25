import React, { useRef, useState } from 'react';
import { 
    Box,
    Paper,
    Fab,
    Tabs,
    Tab,
    Fade,
    Typography,
} from '@mui/material';
import FormDadosContrato from './FormDadosContrato';
import FormProcessoContratacao from './FormProcessoContratacao';
import EditIcon from '@mui/icons-material/Edit';
import { formataData, formataValores, mascaraContrato, mascaraProcessoSei, primeiraLetraMaiuscula, TabValues } from '../../commom/utils/utils';
import { contratoLabels, termoRecebimentoLabels } from '../../commom/utils/constants';
import FormDialog from '../FormDialog';
import FormTermoRecebimento from './FormTermoRecebimento';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editaDadosContrato, throwablePutForm } from '../../commom/utils/api';
import DialogConf from '../DialogConf';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useErrorSnackbar } from '../../commom/utils/hooks';

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

const TabContrato = ({ dados }) => {
    const valores = {
        departamento: dados?.departamento,
        processo_sei: mascaraProcessoSei(dados?.processo_sei),
        //credor: dados?.credor,
        //cnpj_cpf: formataCpfCnpj(dados?.cnpj_cpf),
        categoria: primeiraLetraMaiuscula(dados?.categoria), 
        subcategoria: primeiraLetraMaiuscula(dados?.subcategoria), 
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
        const formattedDate = formataData(date)
        return (
            <>
                <Box className='mb-2 inline-block' sx={{color: 'hsl(201, 0%, 20%)'}}>{formattedDate}</Box>
                {
                    diff
                        ?<Box className='ml-4'>
                            <Box style={{color: 'hsl(201, 0%, 60%)'}}><span className='font-medium'></span> +{diff} dia(s) </Box>
                        </Box>
                        : <></>    
                }
            </>
            // `${date} ( +${diff} dia(s) )`0
        )
    }

    function VencimentoEle ({ dados }) {
        const { 
            diferenca_envio_vencimento,
            diferenca_homologacao_vencimento,
            diferenca_vigencia_vencimento,
        } = dados
        return(
            <>
                <Box className='mb-2 inline-block' sx={{color: 'hsl(201, 0%, 20%)'}}>{formataData(dados?.data_vencimento)}</Box>
                <Box className='ml-4'>
                    {diferenca_envio_vencimento ? <Box style={{color: 'hsl(201, 0%, 60%)'}}><span className='font-medium'>Envio material técnico</span>:  +{diferenca_envio_vencimento} dia(s) </Box> : <></>}
                    {diferenca_homologacao_vencimento ?<Box style={{color: 'hsl(201, 0%, 60%)'}}><span className='font-medium'>Homologacao</span>:  +{diferenca_homologacao_vencimento} dia(s) </Box> : <></>}
                    {diferenca_vigencia_vencimento ? <Box style={{color: 'hsl(201, 0%, 60%)'}}><span className='font-medium'>Vigencia</span>:  +{diferenca_vigencia_vencimento} dia(s) </Box> : <></>}
                </Box>
            </>
        )
    }

    const valores = {
        licitacao_modelo: props.licitacao_modelo,
        estado: props.estado,
        data_assinatura: <Box className='mb-2 inline-block' sx={{color: 'hsl(201, 0%, 20%)'}}>{formataData(props?.data_assinatura)}</Box>,
        envio_material_tecnico: <Box className='mb-2 inline-block' sx={{color: 'hsl(201, 0%, 20%)'}}>{formataData(props.envio_material_tecnico)}</Box>,
        minuta_edital: DateDisplay(props.minuta_edital, props.diferenca_envio_minuta),
        abertura_certame: DateDisplay(props.abertura_certame, props.diferenca_minuta_abertura),
        homologacao: DateDisplay(props.homologacao, props.diferenca_abertura_homologacao),
        data_inicio_vigencia: DateDisplay(props?.data_inicio_vigencia, props.diferenca_homologacao_vigencia),
        data_vencimento: <VencimentoEle dados={props} />,
        data_vencimento_aditada: <Box className='mb-2 inline-block' sx={{color: 'hsl(201, 0%, 20%)'}}>{formataData(props?.data_vencimento_aditada)}</Box>,
        data_recebimento_provisorio: formataData(props?.data_recebimento_provisorio),
        data_recebimento_definitivo: formataData(props?.data_recebimento_definitivo),
        data_prazo_maximo: DateDisplay(props?.data_prazo_maximo, props.diferenca_vencimento_prazo_maximo),
    };

    return <TabValues entry={valores} labels={contratoLabels} label="processo_contratacao" />;
}

const TabTermoRecebimento = (props) => {
    const valores = {
        termo_recebimento_provisorio: formataData(props.termo_recebimento_provisorio),
        termo_recebimento_definitivo: formataData(props.termo_recebimento_definitivo),
    }
    return <TabValues entry={valores} labels={termoRecebimentoLabels} label="termo_recebimento"/>
}

const ListaDadosContrato = (props) => {
    const {
        dados,
        numContrato,
        mudancaContrato,
        setMudancaContrato,
    } = props;

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()
    const queryClient = useQueryClient() 

    const [value, setValue] = useState(0);
    const [openProcCon, setOpenProcCon] = useState(false);
    const [openDadosCon, setOpenDadosCon] = useState(false);
    const [openFormRecebimento, setOpenFormRecebimento] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [openConfirmar, setOpenConfirmar] = useState({
        open: false,
        acao: "",
    })
    const [errors, setErrors] = useState({})
 
    const termoRecebimentoFormId = 'termo-form'
    const contratacaoFormId = "form-processo-contrato"
    const contratoFormId = 'form-contrato'

    const tipoListaRef = useRef("")
    const formIdRef = useRef("")

    const handleChange = (e, newValue) => {
        setValue(newValue);
    }

    const editTermoRecebimento = useMutation({
        mutationFn: ({formData}) => editaDadosContrato({}, dados,  formData, numContrato),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setOpenFormRecebimento(false)
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Termo de recebimento editado com sucesso!',
            });
            queryClient.invalidateQueries(['contratoDados', numContrato])
        },
        onError: (res) => errorSnackbar.Put(res),
        onSettled: () => setCarregando(false)
    })


    return (
        <>
        <Fade in={true} timeout={400}>
            <Box component={Paper} elevation={3} sx={{ padding: '1rem', pt: 0 }}>
                <Box sx={{ mb: '1rem' }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Contrato" {...a11yProps(0)} sx={{ padding: '0 1rem', textTransform: 'none' }} />
                        <Tab label="Processo de contratação" {...a11yProps(1)} sx={{ padding: '0 1rem', textTransform: 'none' }} />
                        <Tab label="Termo de Recebimento" {...a11yProps(1)} sx={{ padding: '0 1rem', textTransform: 'none' }} />
                    </Tabs>
                </Box>
                
                <TabPanel value={value} index={0}>
                    <TabContrato dados={dados} />

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
                        onClick={() => {
                            setOpenDadosCon(true)
                            formIdRef.current = contratoFormId
                            tipoListaRef.current = "dados do contrato"

                        }}
                    >
                        <EditIcon sx={{ mr: '0.3rem' }} /> Editar contrato
                    </Fab>

                    <FormDialog
                        title="Dados do Contrat"
                        acao="Editar"
                        open={openDadosCon}
                        setOpen={(bool) => {
                            setOpenDadosCon(bool);
                            formIdRef.current = ""
                            tipoListaRef.current = "" 
                        }}
                        maxWidth='md'
                        setOpenConfirmar={setOpenConfirmar}
                        carregando={carregando}
                    >
                        <FormDadosContrato 
                            dados={dados}
                            numContrato={numContrato}
                            openDadosCon={openDadosCon}
                            setOpenDadosCon={setOpenDadosCon}
                            carregando={carregando}
                            setCarregando={setCarregando}
                            mudancaContrato={mudancaContrato}
                            setMudancaContrato={setMudancaContrato}
                            formId={contratoFormId}
                        />
                    </FormDialog>

                </TabPanel>

                <TabPanel value={value} index={1}>
                    <TabProcessoContratacao 
                        {...dados}
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
                        onClick={() => {
                            setOpenProcCon(true)
                            formIdRef.current = contratacaoFormId
                            tipoListaRef.current = "processo de contratação"
                        }}
                    >
                        <EditIcon sx={{ mr: '0.3rem' }} /> Editar processo de contratação
                    </Fab>

                    <FormDialog
                        title="Processo de Contratação"
                        acao="Editar"
                        open={openProcCon}
                        setOpen={(bool) => {
                            setOpenProcCon(bool);
                            formIdRef.current = ""
                            tipoListaRef.current = "" 
                        }}
                        setOpenConfirmar={setOpenConfirmar}
                        carregando={carregando}
                    >
                        <FormProcessoContratacao 
                            dados={dados}
                            setOpenProcCon={setOpenProcCon}
                            numContrato={numContrato}
                            formId={contratacaoFormId}
                            setCarregando={setCarregando}
                        />
                    </FormDialog>

                </TabPanel>

                <TabPanel value={value} index={2}>
                    <TabTermoRecebimento
                        {...dados}
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
                        onClick={() => {
                            formIdRef.current = termoRecebimentoFormId
                            tipoListaRef.current = "termo de recebimento" 
                            setOpenFormRecebimento(true)
                            return
                        }}
                    >
                        <EditIcon sx={{ mr: '0.3rem' }} /> Editar termo de recebimento
                    </Fab>

                    <FormDialog
                        title="Termo de Recebimento"
                        acao="Editar"
                        open={openFormRecebimento}
                        setOpen={(bool) => {
                            setOpenFormRecebimento(bool);
                            formIdRef.current = ""
                            tipoListaRef.current = "" 
                        }}
                        setOpenConfirmar={setOpenConfirmar}
                        carregando={carregando}
                    >
                       <FormTermoRecebimento
                            submitFn={editTermoRecebimento.mutate}
                            formId={termoRecebimentoFormId}
                            dados={dados}
                            errors={errors}
                       /> 
                    </FormDialog>
                </TabPanel>

            </Box>
        </Fade>

        <DialogConf 
            title={`${openConfirmar.acao} ${tipoListaRef.current}`}
            body={<Typography>Deseja {openConfirmar.acao} o(a) {tipoListaRef.current}?</Typography>}
            formId={formIdRef.current}
            open={openConfirmar.open}
            setOpen={setOpenConfirmar}
            acao={openConfirmar.acao}
        />
        </>
    );
}

export default ListaDadosContrato;