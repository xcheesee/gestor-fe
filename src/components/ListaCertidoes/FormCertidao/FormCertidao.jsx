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

const FormCertidao = (props) => {
    const { 
        formCertidao, 
        setFormCertidao, 
        openFormCertidao, 
        setOpenFormCertidao, 
        enviaCertidao,
        editaCertidao,
        carregando,
        setOpenConfirmacao,
        errors,
        setErrors
    } = props;

    useEffect(() => {
        setErrors({});
    }, [openFormCertidao.open, setErrors]);

    const handleInputChange = (e) => {
        setFormCertidao({
            ...formCertidao,
            [e.target.name]: e.target.value
        });
    }

    const handleClickConfirmar = () => {
        if (openFormCertidao.acao === 'adicionar') {
            return
        } else if (openFormCertidao.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formCertidao.id
            });
        }
    }

    return (
        <Dialog open={openFormCertidao.open} fullWidth>
            <DialogTitle>
                {openFormCertidao.acao === 'adicionar'
                    ? "Nova certidão"
                    : "Editar certidão"
                }
            </DialogTitle>

            <DialogContent>
                <Box
                    component='form'
                    id='certidao_form'
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        formData.append("contrato_id", formCertidao.contrato_id)
                        openFormCertidao.acao === "adicionar" ? enviaCertidao(formData) : editaCertidao(e, formData, formCertidao.id)
                    }}
                >
                    <TextField
                        variant="outlined"
                        value={formCertidao.certidoes}
                        name="certidoes"
                        onChange={handleInputChange}
                        label="Certidão"
                        sx={{ margin: '1rem 0' }}
                        error={errors.hasOwnProperty('certidoes')}
                        helperText={errors.hasOwnProperty('certidoes') ? errors.certidoes : "Ex: Certidão negativa de débitos"}
                        fullWidth
                        required
                    />

                    <CampoData
                        label="Validade"
                        defaultValue={formCertidao.validade_certidoes}
                        name="validade_certidoes"
                        onChange={handleInputChange}
                        margin="1rem 0"
                        error={errors.hasOwnProperty('validade_certidoes')}
                        helperText={errors.validade_certidoes}
                        fullWidth
                        required
                    />

                </Box>
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    onClick={() => { setOpenFormCertidao({ ...openFormCertidao, open: false }); }}
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    type={openFormCertidao.acao === 'adicionar' ? 'submit' : ""}
                    form={openFormCertidao.acao === 'adicionar' ? 'certidao_form' : ""}
                    variant="contained"
                    onClick={handleClickConfirmar}    
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                    }
                    
                    {openFormCertidao.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormCertidao;