import React, { useEffect, useState } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    TextField,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import CampoData from '../../CampoData';
import CampoValores from '../../CampoValores';

const FormNotaEmpenho = (props) => {
    const { 
        formNotaEmpenho, 
        setFormNotaEmpenho, 
        openFormNotaEmpenho, 
        setOpenFormNotaEmpenho, 
        enviaNotaEmpenho,
        editaNotaEmpenho,
        carregando,
        setOpenConfirmacao,
        errors,
        setErrors
    } = props;

    const [tipo_empenho, setTipoEmpenho] = useState(formNotaEmpenho.tipo_empenho);

    useEffect(() => {
        setErrors({});
        // setTipoEmpenho('');
        // if (openFormNotaEmpenho.acao === "editar") {
        //     setTipoEmpenho(formNotaEmpenho.tipo_empenho);
        // }
    }, [openFormNotaEmpenho.open]);

    const handleInputChange = (e) => {
        setFormNotaEmpenho({
            ...formNotaEmpenho,
            [e.target.name]: e.target.value
        });
    }

    const handleChangeTipoEmpenho = (valor) => {
        setTipoEmpenho(valor);
        console.log(valor);
    }

    const handleClickConfirmar = () => {
        if (openFormNotaEmpenho.acao === 'adicionar') {
        } else if (openFormNotaEmpenho.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formNotaEmpenho.id
            });
        }
    }

    return (
        <Dialog open={openFormNotaEmpenho.open} fullWidth>
            <DialogTitle>
                {openFormNotaEmpenho.acao === 'adicionar'
                    ? "Nova nota de empenho"
                    : "Editar nota de empenho"
                }
            </DialogTitle>

            <DialogContent>
                <Box
                    component="form"
                    id="empenho_form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        formData.append("contrato_id", formNotaEmpenho.contrato_id)
                        openFormNotaEmpenho.acao === 'adicionar' ? enviaNotaEmpenho(formData) : editaNotaEmpenho(formNotaEmpenho.id, formData)
                    }}>

                    <FormControl 
                        sx={{ margin: '1rem 0' }}
                        error={errors.hasOwnProperty('tipo_empenho')}
                        fullWidth 
                        required
                    >
                        <InputLabel id="tipo_empenho-label">Tipo de Empenho</InputLabel>
                        <Select
                            labelId="tipo_empenho-label"
                            id="tipo_empenho"
                            label="Tipo de Empenho"
                            value={formNotaEmpenho.tipo_empenho}
                            name="tipo_empenho"
                            onChange={handleInputChange}
                            fullWidth
                            required
                        >
                            <MenuItem value={"complemento"}>Complemento</MenuItem>
                            <MenuItem value={"cancelamento"}>Cancelamento</MenuItem>
                            <MenuItem value={"novo_empenho"}>Novo Empenho</MenuItem>
                        </Select>
                    <FormHelperText>{errors.tipo_empenho}</FormHelperText>
                    </FormControl>

                    <CampoData
                        label="Data de Emissão da Nota"
                        defaultValue={formNotaEmpenho.data_emissao}
                        name="data_emissao"
                        onChange={handleInputChange}
                        margin="1rem 0"
                        error={errors.hasOwnProperty('data_emissao')}
                        helperText={errors.data_emissao}
                        fullWidth
                        required
                    />

                    <TextField
                        variant="outlined"
                        defaultValue={formNotaEmpenho.numero_nota}
                        name="numero_nota"
                        label="Número da Nota de Empenho"
                        sx={{ margin: '1rem 0' }}
                        error={errors.hasOwnProperty('numero_nota')}
                        helperText={errors.hasOwnProperty('numero_nota') ? errors.tipo_empenho : "Ex: 1234"}
                        fullWidth
                        required
                    />

                    <CampoValores
                        label="Valor de empenho"
                        defaultValue={formNotaEmpenho.valor_empenho}
                        name="valor_empenho"
                        checaErros={() => {}}
                        error={errors.hasOwnProperty('valor_garantia')}
                        helperText={errors.valor_empenho}
                        required
                        fullWidth
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    onClick={() => { setOpenFormNotaEmpenho({ ...openFormNotaEmpenho, open: false }); }}
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={handleClickConfirmar}  
                    form={openFormNotaEmpenho.acao === 'adicionar' ? "empenho_form" : ""} 
                    type={openFormNotaEmpenho.acao === 'adicionar' ? "submit" : ""}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                    }
                    
                    {openFormNotaEmpenho.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormNotaEmpenho;