import React, { useEffect } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
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
        enviaGarantia,
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
            enviaGarantia();
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
                <TextField
                    variant="outlined"
                    value={formGarantia.instituicao_financeira}
                    name="instituicao_financeira"
                    onChange={handleInputChange}
                    label="Instituição financeira"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('instituicao_financeira')}
                    helperText={errors.instituicao_financeira}
                    fullWidth
                    required
                />

                <TextField
                    variant="outlined"
                    value={formGarantia.numero_documento}
                    name="numero_documento"
                    onChange={handleInputChange}
                    label="Número do documento"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('numero_documento')}
                    helperText={errors.numero_documento}
                    fullWidth
                    required
                />

                <CampoValores 
                    label="Valor"
                    value={formGarantia.valor_garantia}
                    state={formGarantia}
                    setState={setFormGarantia}
                    name="valor_garantia"
                    checaErros={() => {}}
                    error={errors.hasOwnProperty('valor_garantia')}
                    helperText={errors.valor_garantia}
                    fullWidth
                    required
                />

                <CampoData 
                    label="Validade"
                    value={formGarantia.data_validade_garantia}
                    name="data_validade_garantia"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    error={errors.hasOwnProperty('data_validade_garantia')}
                    helperText={errors.data_validade_garantia}
                    fullWidth
                    required
                />
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