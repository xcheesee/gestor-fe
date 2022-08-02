import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Divider, 
    Paper,
    IconButton,
    Tooltip,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import DialogDetalhes from './DialogDetalhes/DialogDetalhes';
import FormExecFinanceira from './FormExecFinanceira';
import DialogConfirmacao from '../../DialogConfirmacao';

const ExecucaoFinanceira = (props) => {
    const execucao_financeira = typeof props.execucao_financeira != 'undefined' ? props.execucao_financeira : [];
    const [carregando, setCarregando] = useState(false);
    const [detalheExecFin, setDetalheExecFin] = useState({});
    const [openDetalhes, setOpenDetalhes] = useState(false);
    const [openFormExecFinanceira, setOpenFormExecFinanceira] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [acao, setAcao] = useState('adicionarExecFin');
    const [formExecFinanceira, setFormExecFinanceira] = useState({
        contrato_id: props.numContrato,
        mes: '',
        ano: '',
        planejado_inicial: '',
        contratado_inicial: '',
        valor_reajuste: '',
        valor_aditivo: '',
        valor_cancelamento: '',
        empenhado: '',
        executado: ''
    });
    const [errors, setErrors] = useState({});

    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    const detalhaExecucaoFinanceira = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/execucao_financeira/${id}`;
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
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    return res.json()
                    .then(data => { 
                        setDetalheExecFin(data.data); 
                        setOpenDetalhes(true);
                    });
                }
            })
    }

    const handleClickAdicionarMes = () => {
        setOpenFormExecFinanceira({
            open: true,
            acao: 'adicionar'
        });
        setFormExecFinanceira({
            contrato_id: props.numContrato,
            mes: '',
            ano: '',
            planejado_inicial: '',
            contratado_inicial: '',
            valor_reajuste: '',
            valor_aditivo: '',
            valor_cancelamento: '',
            empenhado: '',
            executado: ''
        });
        setAcao('adicionarExecFin');
    }

    const enviaMes = () => {
        const url = `${process.env.REACT_APP_API_URL}/execucao_financeira`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formExecFinanceira)
        }

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                props.setMudancaContrato(!props.mudancaContrato);
                if (res.ok) {
                    setCarregando(false);
                    props.setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Mês de execução financeira enviado com sucesso!',
                        color: 'success'
                    });
                    setOpenFormExecFinanceira({
                        open: false,
                        acao: 'adicionar'
                    });
                    setFormExecFinanceira({
                        ...formExecFinanceira,
                        mes: '',
                        ano: '',
                        planejado_inicial: '',
                        contratado_inicial: '',
                        valor_reajuste: '',
                        valor_aditivo: '',
                        valor_cancelamento: '',
                        empenhado: '',
                        executado: ''
                    });
                    return res.json();
                } else if (res.status === 422) {
                    setCarregando(false);
                    props.setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível enviar o mês de execução`,
                        color: 'error'
                    });
                    return res.json()
                        .then(data => setErrors(data.errors));
                } else {
                    setCarregando(false);
                    props.setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível enviar o mês de execução`,
                        color: 'error'
                    });
                }
            })
            .catch(err => console.log(err));
    }

    const Conteudo = () => {
        if (Object.keys(execucao_financeira).length > 0) {
            return (
                <Box
                    component={Paper} 
                    elevation={5}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#F8FAF8',
                        margin: '2rem 0', 
                    }}
                >
                    <Box
                        sx={{ 
                            padding: '1rem',
                            display: 'flex',
                            overflow: 'auto',
                            mb: '1rem'
                        }} 
                    >
                        {Object.keys(execucao_financeira).map((execucao, index) => {
                            return (
                                <Box
                                    elevation={3}
                                    component={Paper}
                                    sx={{ 
                                        padding: '1rem',
                                        minWidth: '16rem',
                                        mr: '1rem'
                                    }}
                                    key={index}
                                >
                                    <Divider
                                        textAlign='right'
                                        sx={{
                                            fontWeight: 'light',
                                            fontSize: '1rem',
                                            mb: '1rem'
                                        }}
                                    >
                                        {execucao_financeira[execucao].mes}
                                    </Divider>
                                    
                                    <Box sx={{ display: 'flex' }}>
                                        <Box>
                                            <Typography sx={{ fontWeight: 'medium' }} component="span">
                                                Planejado
                                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                                    {props.formataValores(execucao_financeira[execucao].planejado)}
                                                </Typography>
                                            </Typography>
                        
                                            <Typography sx={{ fontWeight: 'medium' }} component="span">
                                                Contratado
                                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                                    {props.formataValores(execucao_financeira[execucao].contratado)}
                                                </Typography>
                                            </Typography>
                        
                                            <Typography sx={{ fontWeight: 'medium' }} component="span">
                                                Empenhado
                                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                                    {props.formataValores(execucao_financeira[execucao].empenhado)}
                                                </Typography>
                                            </Typography>
                        
                                            <Typography sx={{ fontWeight: 'medium' }} component="span">
                                                Executado
                                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                                    {props.formataValores(execucao_financeira[execucao].executado)}
                                                </Typography>
                                            </Typography>
                        
                                            <Typography sx={{ fontWeight: 'medium' }} component="span">
                                                Saldo
                                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                                    {props.formataValores(execucao_financeira[execucao].saldo)}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                        
                                        <Box 
                                            sx={{ 
                                                alignSelf: 'flex-end', 
                                                width: '100%', 
                                                display: 'flex', 
                                                justifyContent: 'flex-end' 
                                            }}
                                        >
                                            <Tooltip title="Detalhes" arrow>
                                                <Box>
                                                    <IconButton
                                                        onClick={() => detalhaExecucaoFinanceira(execucao_financeira[execucao].id)}
                                                        disabled={carregando}
                                                    >
                                                        <ManageSearchIcon />
                                                    </IconButton>
                                                </Box>
                                            </Tooltip>
                                            
                                            <Tooltip title="Editar" arrow>
                                                <IconButton>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                    
                    <Box
                        sx={{
                            alignSelf: 'flex-end',
                            padding: '1rem',
                            pt: 0,
                        }}
                    >
                        <Button
                            sx={{
                                textTransform: 'none'
                            }}
                            onClick={handleClickAdicionarMes}
                        >
                            <AddIcon sx={{ mr: '0.2rem' }} />
                            Adicionar mês
                        </Button>
                    </Box>
                </Box>
            );
        } else {
            return (
                <Box
                    component={Paper} 
                    elevation={5}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#F8FAF8',
                        margin: '2rem 0', 
                    }}
                >
                    <Typography sx={{ margin: '1rem' }}>
                        Nenhum dado de execução financeira disponível para este contrato
                    </Typography>

                    <Box
                        sx={{
                            alignSelf: 'flex-end',
                            padding: '1rem',
                            pt: 0,
                        }}
                    >
                        <Button
                            sx={{
                                textTransform: 'none',
                            }}
                            onClick={handleClickAdicionarMes}
                        >
                            <AddIcon sx={{ mr: '0.2rem' }} />
                            Adicionar mês
                        </Button>
                    </Box>
                </Box>
            );
        }
    }
    
    return (
        <Box>
            <Typography variant="h2" sx={{ fontSize: '2rem', margin: '2rem 0 0 0' }}>
                Execução Financeira do Contrato
            </Typography>

            <Conteudo />

            <DialogDetalhes 
                detalhes={detalheExecFin}
                openDetalhes={openDetalhes}
                setOpenDetalhes={setOpenDetalhes}
                formataValores={props.formataValores}
            />

            <FormExecFinanceira 
                meses={meses}
                openFormExecFinanceira={openFormExecFinanceira}
                setOpenFormExecFinanceira={setOpenFormExecFinanceira}
                formExecFinanceira={formExecFinanceira}
                setFormExecFinanceira={setFormExecFinanceira}
                errors={errors}
                setErrors={setErrors}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
                formataValores={props.formataValores}
                totais={props.totais}
            />

            <DialogConfirmacao 
                openConfirmacao={openConfirmacao}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                fnExcluir={() => {}}
                fnEditar={() => {}}
                fnAdicionar={enviaMes}
                formInterno={formExecFinanceira}
                carregando={carregando}
                texto="mês de execução financeira"
                meses={meses}
            />
        </Box>
    );
}

export default ExecucaoFinanceira;