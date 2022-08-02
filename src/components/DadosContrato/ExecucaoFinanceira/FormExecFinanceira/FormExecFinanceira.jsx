import React, { useEffect } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CampoAno from '../../../CampoAno';
import CampoValores from '../../../CampoValores';
import RefExecucaoFinanceira from '../RefExecucaoFinanceira';

const FormExecFinanceira = (props) => {
    const {
        meses,
        openFormExecFinanceira,
        setOpenFormExecFinanceira,
        formExecFinanceira,
        setFormExecFinanceira,
        errors,
        setErrors,
        carregando,
        setOpenConfirmacao,
        formataValores,
        totais
    } = props;

    useEffect(() => {
        setErrors({});
    }, [openFormExecFinanceira.open, setErrors]);

    const handleChange = (e) => {
        setFormExecFinanceira({
            ...formExecFinanceira,
            [e.target.name]: e.target.value
        });
    }
    
    const cancelar = () => {
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
        })
    }

    const confirmar = () => {
        if (openFormExecFinanceira.acao === 'adicionar') {
            setOpenConfirmacao({
                open: true,
                id: formExecFinanceira.id
            });
        }
    }

    return (
        <Dialog open={openFormExecFinanceira.open} fullWidth maxWidth="md">
            <DialogTitle>
                Novo mês de execução financeira
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', width: '50%' }}>
                    <FormControl sx={{ margin: '1rem 0', mr: '1rem' }} required fullWidth>
                        <InputLabel id="mes-label">Mês</InputLabel>
                        <Select
                            labelId="mes-label"
                            id="mes"
                            label="Mês"
                            name="mes"
                            value={formExecFinanceira.mes}
                            onChange={handleChange}
                            error={errors.hasOwnProperty('mes')}
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
                        onChange={handleChange}
                        error={errors.hasOwnProperty('ano')}
                        helperText={errors.hasOwnProperty('ano') ? errors.ano : " "}
                        required
                    />
                </Box>

                <RefExecucaoFinanceira 
                    totais={totais}
                    formataValores={formataValores}
                />

                <CampoValores 
                    label="Planejado inicial" 
                    value={formExecFinanceira.planejado_inicial}
                    name="planejado_inicial"
                    required
                    state={formExecFinanceira}
                    setState={setFormExecFinanceira}
                    checaErros={() => {}}
                    helperText={errors.hasOwnProperty('planejado_inicial') ? errors.planejado_inicial : " "}
                    error={errors.hasOwnProperty('planejado_inicial')}
                    fullWidth 
                />

                <CampoValores 
                    label="Contratado inicial" 
                    value={formExecFinanceira.contratado_inicial}
                    name="contratado_inicial"
                    required
                    state={formExecFinanceira}
                    setState={setFormExecFinanceira}
                    checaErros={() => {}}
                    helperText={errors.hasOwnProperty('contratado_inicial' ? errors.contratado_inicial : " ")}
                    error={errors.hasOwnProperty('contratado_inicial')}
                    fullWidth 
                />
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button
                    onClick={cancelar}
                    sx={{ textTransform: 'none', mr: '1rem', color: (theme) => theme.palette.error.main }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} /> Cancelar
                </Button>

                <Button
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={confirmar}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} /> 
                    }

                    {openFormExecFinanceira.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormExecFinanceira;