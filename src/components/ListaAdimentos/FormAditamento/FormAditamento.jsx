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
    TextField,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import CampoValores from '../../CampoValores';
import CampoPorcentagem from '../../CampoPorcentagem';

const FormAditamento = (props) => {
    const {
        formAditamento,
        setFormAditamento,
        openFormAditamento,
        setOpenFormAditamento,
        enviaAditamento,
        carregando,
        setOpenConfirmacao,
        errors,
        setErrors
    } = props;

    useEffect(() => {
        setErrors({});
    }, [openFormAditamento.open]);

    const handleInputChange = (e) => {
        setFormAditamento({
            ...formAditamento,
            [e.target.name]: e.target.value
        })
    }

    const handleClickConfirmar = () => {
        if (openFormAditamento.acao === 'adicionar') {
            enviaAditamento();
        } else if (openFormAditamento.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formAditamento.id
            });
        }
    }

    return (
        <Dialog open={openFormAditamento.open} fullWidth>
            <DialogTitle>
                {openFormAditamento.acao === 'adicionar'
                    ? "Novo aditamento"
                    : "Editar aditamento"
                }
            </DialogTitle>

            <DialogContent>
                <FormControl 
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('tipo_aditamentos')}
                    fullWidth 
                >
                    <InputLabel id="tipo_aditamentos-label">Tipo</InputLabel>
                    <Select
                        labelId="tipo_aditamentos-label"
                        id="tipo_aditamentos"
                        label="Tipo"
                        value={formAditamento.tipo_aditamentos}
                        name="tipo_aditamentos"
                        onChange={handleInputChange}
                        required
                        fullWidth
                    >
                        <MenuItem value="Acréscimo de valor">Acréscimo de valor</MenuItem>
                        <MenuItem value="Redução de valor">Redução de valor</MenuItem>
                        <MenuItem value="Prorrogação de prazo">Prorrogação de prazo</MenuItem>
                        <MenuItem value="Supressão de prazo">Supressão de prazo</MenuItem>
                        <MenuItem value="Suspensão">Suspensão</MenuItem>
                        <MenuItem value="Rescisão">Rescisão</MenuItem>
                    </Select>
                    <FormHelperText>{errors.tipo_aditamentos}</FormHelperText>
                </FormControl>

                <CampoValores
                    index=""
                    label="Valor"
                    value={formAditamento.valor_aditamento}
                    state={formAditamento}
                    setState={setFormAditamento}
                    name="valor_aditamento"
                    onChange={(e) => { handleInputChange(e); }}
                    checaErros={() => {}}
                    error={errors.hasOwnProperty('valor_aditamento')}
                    helperText={errors.valor_aditamento}
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={formAditamento.dias_reajuste}
                    name="dias_reajuste"
                    onChange={handleInputChange}
                    label="Dias Reajuste"
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                />

                <TextField
                    variant="outlined"
                    value={formAditamento.indice_reajuste}
                    name="indice_reajuste"
                    onChange={handleInputChange}
                    label="Índice Reajuste"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('indice_reajuste')}
                    helperText={errors.indice_reajuste}
                    fullWidth
                />

                <CampoPorcentagem 
                    label="Porcentagem reajuste"
                    value={formAditamento.pct_reajuste}
                    name="pct_reajuste"
                    state={formAditamento}
                    setState={setFormAditamento}
                    error={errors.hasOwnProperty('pct_reajuste')}
                    helperText={errors.pct_reajuste}
                    fullWidth
                />

            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button
                    onClick={() => { setOpenFormAditamento({ ...openFormAditamento, open: false }); }}
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} /> Cancelar
                </Button>

                <Button
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={handleClickConfirmar}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} /> 
                    }

                    {openFormAditamento.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormAditamento;