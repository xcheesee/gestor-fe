import React, { useEffect } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import CampoData from '../../CampoData';
import CampoValores from '../../CampoValores';

const FormGarantia = (props) => {
    const {
        formGarantia,
        setFormGarantia,
        openFormGarantia,
        setOpenFormGarantia,
        //numContrato,
        enviaGarantia,
        editaGarantia,
        carregando,
        setOpenConfirmacao,
        errors,
        setErrors
    } = props;

    useEffect(() => {
        setErrors({});
    }, [openFormGarantia.open])

    const handleInputChange = (e) => {
        setFormGarantia({
            ...formGarantia,
            [e.target.name]: e.target.value
        })
    }

    const handleClickConfirmar = () => {
        if (openFormGarantia.acao === 'adicionar') {
            // enviaGarantia();
        } else if (openFormGarantia.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formGarantia.id
            });
        }
    }

    return (
        <Dialog open={openFormGarantia.open} fullWidth>
            <DialogTitle>
                {openFormGarantia.acao === 'adicionar'
                    ? "Nova garantia"
                    : "Editar garantia"
                }
            </DialogTitle>

            <DialogContent>
                <Box
                    component="form"
                    id="garantia_form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        formData.append("contrato_id", formGarantia.contrato_id)
                        openFormGarantia.acao === "adicionar"? enviaGarantia(formData) : editaGarantia(formGarantia.id, formData)
                    }}>
                    <TextField
                        variant="outlined"
                        defaultValue={formGarantia.instituicao_financeira ?? ""}
                        name="instituicao_financeira"
                        // onChange={handleInputChange}
                        label="Instituição financeira"
                        sx={{ margin: '1rem 0' }}
                        error={errors.hasOwnProperty('instituicao_financeira')}
                        helperText={errors.instituicao_financeira}
                        fullWidth
                        required
                    />

                    <TextField
                        variant="outlined"
                        defaultValue={formGarantia.numero_documento ?? ""}
                        name="numero_documento"
                        // onChange={handleInputChange}
                        label="Número do documento"
                        sx={{ margin: '1rem 0' }}
                        error={errors.hasOwnProperty('numero_documento')}
                        helperText={errors.numero_documento}
                        fullWidth
                        required
                    />

                    <CampoValores 
                        label="Valor"
                        defaultValue={formGarantia.valor_garantia ?? ""}
                        name="valor_garantia"
                        checaErros={() => {}}
                        error={errors.hasOwnProperty('valor_garantia')}
                        helperText={errors.valor_garantia}
                        fullWidth
                        required
                    />

                    <CampoData 
                        label="Validade"
                        defaultValue={formGarantia.data_validade_garantia ?? ""}
                        name="data_validade_garantia"
                        onChange={handleInputChange}
                        margin="1rem 0"
                        error={errors.hasOwnProperty('data_validade_garantia')}
                        helperText={errors.data_validade_garantia}
                        fullWidth
                        required
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    onClick={() => { setOpenFormGarantia({ ...openFormGarantia, open: false }); }}
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    type={openFormGarantia.acao === 'adicionar' ? "submit" : ""}
                    form={openFormGarantia.acao === 'adicionar' ? "garantia_form" : ""}
                    onClick={handleClickConfirmar}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                    }
                    
                    {openFormGarantia.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormGarantia;