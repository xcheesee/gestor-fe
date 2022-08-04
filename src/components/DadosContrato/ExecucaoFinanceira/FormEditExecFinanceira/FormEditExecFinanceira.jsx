import React, { useState, useEffect, forwardRef } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress,
    Typography,
    Tooltip,
    TextField,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import CampoAno from '../../../CampoAno';
import CampoValores from '../../../CampoValores';
import RefExecucaoFinanceira from '../RefExecucaoFinanceira';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        isNumericString
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
      />
    );
});

NumberFormatCustom.propTypes = {
    onChange: PropTypes.func.isRequired,
};

const FormEditExecFinanceira = (props) => {
    const {
        meses,
        openEditExecFinanceira,
        setOpenEditExecFinanceira,
        formExecFinanceira,
        errors,
        setErrors,
        carregando,
        setCarregando,
        formataValores,
        setSnackbar,
        mudancaContrato,
        setMudancaContrato
    } = props;

    const [execucaoEditado, setExecucaoEditado] = useState({ ...formExecFinanceira });
    const [openExcluir, setOpenExcluir] = useState(false);
    const [openEditar, setOpenEditar] = useState(false);
    const [totais, setTotais] = useState([]);
    const [formEnvio, setFormEnvio] = useState({});

    useEffect(() => {
        setExecucaoEditado({ ...formExecFinanceira });
    }, [setExecucaoEditado, formExecFinanceira])

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/contrato_totais/${execucaoEditado.contrato_id}?execucao_id=${execucaoEditado.id}`;
        const token = localStorage.getItem('access_token');
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'GET'
        };

        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                setTotais(data.data);
            })
    }, [execucaoEditado.contrato_id, execucaoEditado.id, openEditExecFinanceira])

    const cancelar = () => {
        setOpenEditExecFinanceira(false);
        setErrors({});
        setExecucaoEditado({
            ...execucaoEditado,
            mes: '',
            ano: '',
            planejado_inicial: '',
            contratado_inicial: '',
            valor_reajuste: 0,
            valor_aditivo: 0,
            valor_cancelamento: 0,
            empenhado: 0,
            executado: 0
        });
    }

    const confirmar = () => {
        let cancelamento = 
            parseFloat(execucaoEditado.empenhado) - parseFloat(execucaoEditado.executado) > 0
            ? (parseFloat(execucaoEditado.empenhado) - parseFloat(execucaoEditado.executado))
            : parseFloat(0)
        
        setOpenEditar(true);
        setFormEnvio({
            contrato_id: execucaoEditado.contrato_id,
            mes: execucaoEditado.mes,
            ano: execucaoEditado.ano,
            planejado_inicial: execucaoEditado.planejado_inicial,
            contratado_inicial: execucaoEditado.contratado_inicial,
            valor_reajuste: execucaoEditado.valor_reajuste,
            valor_aditivo: execucaoEditado.valor_aditivo,
            empenhado: execucaoEditado.empenhado,
            executado: execucaoEditado.executado,
            valor_cancelamento: cancelamento
        });
    }

    const editaMes = () => {
        const url = `${process.env.REACT_APP_API_URL}/execucao_financeira/${execucaoEditado.id}`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formEnvio)
        };

        setCarregando(true);
        setOpenEditar(false);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Mês de execução financeira editado com sucesso!',
                        color: 'success'
                    });
                    cancelar();
                    setMudancaContrato(!mudancaContrato);
                    return res.json();
                } else if (res.status === 422) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Error ${res.status} - Não foi possível editar o mês de execução`,
                        color: 'error'
                    });
                    return res.json()
                        .then(data => setErrors(data.errors));
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar o mês de exeucação`,
                        color: 'error'
                    });
                }
            })
    }

    const handleClickExcluir = () => {
        setOpenExcluir(true);
    }

    const excluiMes = () => {
        const url = `${process.env.REACT_APP_API_URL}/execucao_financeira/${execucaoEditado.id}`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        setCarregando(true);
        setOpenExcluir(false);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Mês de execução excluído com sucesso!',
                        color: 'success'
                    });
                    setMudancaContrato(!mudancaContrato);
                    setOpenEditExecFinanceira(false);
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível excluir o mês de execução`,
                        color: 'error'
                    });
                    setOpenEditExecFinanceira(false);
                }
            })
            .catch(err => console.log(err));
    }

    const DialogExcluir = () => {
        return (
            <Dialog open={openExcluir}>
                <DialogTitle>
                    Excluir mês de execução financeira
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Confirma a exclusão do mês de execucao financeira 
                        <strong> {meses[execucaoEditado.mes - 1]} de {execucaoEditado.ano}</strong>?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button 
                        sx={{ 
                            textTransform: 'none', 
                            color: (theme) => theme.palette.error.main 
                        }}
                        onClick={() => setOpenExcluir(false)}
                    >
                        Cancelar
                    </Button>

                    <Button 
                        sx={{ textTransform: 'none' }} 
                        onClick={excluiMes}
                    >
                        {
                            carregando
                            ? <CircularProgress sx={{ mr: '0.3rem' }} size="0.7rem" />
                            : ""
                        }
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    const DialogEditar = () => {
        return (
            <Dialog open={openEditar}>
                <DialogTitle>
                    Confirmação de edição
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Confirma a edição do mês de execução financeira 
                        <strong> {meses[execucaoEditado.mes - 1]} de {execucaoEditado.ano}</strong>?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button 
                        sx={{ 
                            textTransform: 'none', 
                            color: (theme) => theme.palette.error.main 
                        }}
                        onClick={() => setOpenEditar(false)}
                    >
                        Cancelar
                    </Button>

                    <Button 
                        sx={{ textTransform: 'none' }} 
                        onClick={editaMes}
                    >
                        {
                            carregando
                            ? <CircularProgress sx={{ mr: '0.3rem' }} size="0.7rem" />
                            : ""
                        }
                        Editar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Box>
        <DialogExcluir />
        <DialogEditar />
        <Dialog open={openEditExecFinanceira} fullWidth maxWidth="md">
            <DialogTitle>
                Editar mês de execução financeira
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', width: '50%', alignItems: 'center' }}>
                    <FormControl sx={{ margin: '1rem 0', mr: '1rem' }} fullWidth>
                        <InputLabel id="mes-label" disabled>Mês</InputLabel>
                        <Select
                            labelId="mes-label"
                            id="mes"
                            label="Mês"
                            name="mes"
                            value={execucaoEditado.mes}
                            error={errors.hasOwnProperty('mes')}
                            disabled
                        >
                            {meses.map((mes, index) => {
                                return (
                                    <MenuItem key={index} value={index + 1}>{mes}</MenuItem>
                                );
                            })}
                        </Select>

                        <FormHelperText>{errors.hasOwnProperty('mes') ? errors.mes : " "}</FormHelperText>
                    </FormControl>

                    <CampoAno 
                        label="Ano"
                        name="ano"
                        value={execucaoEditado.ano}
                        error={errors.hasOwnProperty('ano')}
                        helperText={errors.hasOwnProperty('ano') ? errors.ano : " "}
                        disabled
                    />
                </Box>

                <RefExecucaoFinanceira 
                    totais={totais}
                    formataValores={formataValores}
                />

                <CampoValores 
                    label="Planejado inicial" 
                    value={execucaoEditado.planejado_inicial}
                    name="planejado_inicial"
                    state={execucaoEditado}
                    setState={setExecucaoEditado}
                    checaErros={() => {}}
                    helperText={errors.hasOwnProperty('planejado_inicial') ? errors.planejado_inicial : " "}
                    error={errors.hasOwnProperty('planejado_inicial')}
                    fullWidth 
                    disabled
                />

                <CampoValores 
                    label="Contratado inicial" 
                    value={execucaoEditado.contratado_inicial}
                    name="contratado_inicial"
                    state={execucaoEditado}
                    setState={setExecucaoEditado}
                    checaErros={() => {}}
                    helperText={errors.hasOwnProperty('contratado_inicial' ? errors.contratado_inicial : " ")}
                    error={errors.hasOwnProperty('contratado_inicial')}
                    fullWidth 
                    disabled
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', margin: '1rem 0', mb: 0 }}>
                    <CampoValores 
                        label="Valor reajuste" 
                        value={execucaoEditado.valor_reajuste ? execucaoEditado.valor_reajuste : 0}
                        name="valor_reajuste"
                        state={execucaoEditado}
                        setState={setExecucaoEditado}
                        checaErros={() => {}}
                        helperText={errors.hasOwnProperty('valor_reajuste') ? errors.valor_reajuste : " "}
                        error={errors.hasOwnProperty('valor_reajuste')}
                        fullWidth
                    />

                    <CampoValores 
                        label="Valor aditivo" 
                        value={execucaoEditado.valor_aditivo ? execucaoEditado.valor_aditivo : 0}
                        name="valor_aditivo"
                        state={execucaoEditado}
                        setState={setExecucaoEditado}
                        checaErros={() => {}}
                        helperText={errors.hasOwnProperty('valor_aditivo') ? errors.valor_aditivo : " "}
                        error={errors.hasOwnProperty('valor_aditivo')}
                        fullWidth
                    />

                    <TextField 
                        label="Reprogramação/cancelamento" 
                        value={
                            parseFloat(execucaoEditado.empenhado) - parseFloat(execucaoEditado.executado) > 0
                            ? (parseFloat(execucaoEditado.empenhado) - parseFloat(execucaoEditado.executado))
                            : 0
                        }
                        helperText={
                            errors.hasOwnProperty('valor_cancelamento') 
                            ? errors.valor_cancelamento 
                            : " "
                        }
                        error={errors.hasOwnProperty('valor_cancelamento')}
                        sx={{ margin: '1rem 0' }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            inputComponent: NumberFormatCustom,
                        }}
                        fullWidth
                        disabled
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', margin: '1rem 0', mt: 0 }}>
                    <CampoValores 
                        label="Empenhado" 
                        value={execucaoEditado.empenhado ? execucaoEditado.empenhado : 0}
                        name="empenhado"
                        state={execucaoEditado}
                        setState={setExecucaoEditado}
                        checaErros={() => {}}
                        helperText={errors.hasOwnProperty('empenhado') ? errors.empenhado : " "}
                        error={errors.hasOwnProperty('empenhado')}
                        fullWidth
                    />

                    <CampoValores 
                        label="Executado" 
                        value={execucaoEditado.executado ? execucaoEditado.executado : '0'}
                        name="executado"
                        state={execucaoEditado}
                        setState={setExecucaoEditado}
                        checaErros={() => {}}
                        helperText={errors.hasOwnProperty('executado') ? errors.executado : " "}
                        error={errors.hasOwnProperty('executado')}
                        fullWidth
                    />
                </Box>

                <Box 
                    sx={{
                        border: '1px solid #cdcdcd', 
                        borderRadius: '3px',
                        padding: '1rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        columnGap: '2rem',
                        rowGap: '2rem',
                        mb: '2rem'
                    }}
                >
                    <Typography 
                        sx={{ 
                            fontWeight: 'medium', 
                            color:
                                parseFloat(totais.valor_empenhos) + parseFloat(execucaoEditado.empenhado) < 0
                                ? (theme) => theme.palette.error.main
                                : ''
                        }} 
                        component="span"
                    >
                        Total empenhado
                        <Typography 
                            sx={{ 
                                padding: '0 1rem', 
                                mb: '0.5rem'    
                            }}>
                            {
                                execucaoEditado.empenhado 
                                ? formataValores(parseFloat(totais.total_empenhado) + parseFloat(execucaoEditado.empenhado))
                                : formataValores(parseFloat(totais.total_empenhado))
                            }
                        </Typography>
                    </Typography>
                    
                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Total executado
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {
                                execucaoEditado.executado 
                                ? formataValores(parseFloat(totais.total_executado) + parseFloat(execucaoEditado.executado))
                                : formataValores(parseFloat(totais.total_executado))
                            }
                        </Typography>
                    </Typography>
                    
                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Contratado atualizado
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {formataValores(
                                parseFloat(execucaoEditado.contratado_inicial) 
                                + parseFloat(execucaoEditado.valor_aditivo ? execucaoEditado.valor_aditivo : 0)
                                + parseFloat(execucaoEditado.valor_reajuste ? execucaoEditado.valor_reajuste : 0)
                                - (parseFloat(execucaoEditado.empenhado ? execucaoEditado.empenhado : 0) 
                                - parseFloat(execucaoEditado.executado ? execucaoEditado.executado : 0) < 0 
                                    ? 0 
                                    : parseFloat(execucaoEditado.empenhado ? execucaoEditado.empenhado : 0) 
                                      - parseFloat(execucaoEditado.executado ? execucaoEditado.executado : 0)
                                )
                            )}
                        </Typography>
                    </Typography>

                    <Typography 
                        sx={{ 
                            fontWeight: 'medium', 
                            color:
                                parseFloat(execucaoEditado.empenhado) - parseFloat(execucaoEditado.executado) < 0
                                ? (theme) => theme.palette.error.main
                                : ''
                        }} 
                        component="span"
                    >
                        Saldo empenho
                        <Typography 
                            sx={{ 
                                padding: '0 1rem', 
                                mb: '0.5rem'
                            }}>
                            {formataValores(
                                parseFloat(execucaoEditado.empenhado ? execucaoEditado.empenhado : 0) 
                                - parseFloat(execucaoEditado.executado ? execucaoEditado.executado : 0)
                            )}
                        </Typography>
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions 
                sx={{ 
                    margin: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                }}
            >
                <Tooltip title="Excluir mês" placement="top" arrow>
                    <Button 
                        sx={{ textTransform: 'none' }}
                        variant="contained"
                        color="error"
                        onClick={handleClickExcluir}
                    >
                        <DeleteIcon />
                    </Button>
                </Tooltip>

                <Box>
                    <Button
                        onClick={cancelar}
                        sx={{ textTransform: 'none', mr: '1rem', color: (theme) => theme.palette.error.main }}
                    >
                        <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                    </Button>

                    <Button
                        sx={{ textTransform: 'none' }} 
                        variant="contained"
                        onClick={confirmar}
                    >
                        {carregando
                            ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                            : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                        }

                        Editar
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
        </Box>
    );
}

export default FormEditExecFinanceira;