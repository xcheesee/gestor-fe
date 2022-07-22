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
    CircularProgress,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CampoAno from '../../../CampoAno';
import CampoValores from '../../../CampoValores';

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
        setOpenConfirmacao
    } = props;

    useEffect(() => {
        setErrors({});
    }, [openFormExecFinanceira.open]);

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

                <Box 
                    sx={{
                        border: '1px solid #cdcdcd', 
                        borderRadius: '3px',
                        padding: '1rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gridTemplateRows: '1fr 1fr',
                        columnGap: '2rem',
                        rowGap: '2rem',
                        mb: '2rem'
                    }}
                >
                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Valor do contrato
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            ---
                        </Typography>
                    </Typography>
                    
                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Valor de reserva
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            ---
                        </Typography>
                    </Typography>
                    
                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Valor das dotações
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            ---
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Valor total de empenho
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            ---
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Total planejado
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            ---
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Valor dos aditamentos
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            ---
                        </Typography>
                    </Typography>
                </Box>

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