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

const FormGestaoFiscalizacao = (props) => {
    const {
        formFiscalizacao,
        setFormFiscalizacao,
        enviaFiscalizacao,
        carregando,
        openFormFiscalizacao,
        setOpenFormFiscalizacao,
        setOpenConfirmacao,
        errors,
        setErrors
    } = props;

    useEffect(() => {
        setErrors({});
    }, [openFormFiscalizacao.open])

    const handleInputChange = (e) => {
        setFormFiscalizacao({
            ...formFiscalizacao,
            [e.target.name]: e.target.value
        });
    }

    const handleClickConfirmar = () => {
        if (openFormFiscalizacao.acao === 'adicionar') {
            enviaFiscalizacao();
        } else if (openFormFiscalizacao.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formFiscalizacao.id
            });
        }
    }
    
    return (
        <Dialog open={openFormFiscalizacao.open} fullWidth>
            <DialogTitle>
                {openFormFiscalizacao.acao === 'adicionar'
                    ? "Nova gestão/fiscalização"
                    : "Editar gestão/fiscalização"
                }
            </DialogTitle>

            <DialogContent>
                <TextField
                    variant="outlined"
                    value={formFiscalizacao.nome_gestor}
                    name="nome_gestor"
                    onChange={handleInputChange}
                    label="Gestor"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('nome_gestor')}
                    helperText={errors.nome_gestor}
                    fullWidth
                    required
                />

                <TextField
                    variant="outlined"
                    value={formFiscalizacao.email_gestor}
                    name="email_gestor"
                    onChange={handleInputChange}
                    label="E-mail do Gestor"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('email_gestor')}
                    helperText={errors.email_gestor}
                    fullWidth
                    required
                />

                <TextField
                    variant="outlined"
                    value={formFiscalizacao.nome_fiscal}
                    name="nome_fiscal"
                    onChange={handleInputChange}
                    label="Fiscal"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('nome_fiscal')}
                    helperText={errors.nome_fiscal}
                    fullWidth
                    required
                />

                <TextField
                    variant="outlined"
                    value={formFiscalizacao.email_fiscal}
                    name="email_fiscal"
                    onChange={handleInputChange}
                    label="E-mail do Fiscal"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('email_fiscal')}
                    helperText={errors.email_fiscal}
                    fullWidth
                    required
                />

                <TextField
                    variant="outlined"
                    value={formFiscalizacao.nome_suplente}
                    name="nome_suplente"
                    onChange={handleInputChange}
                    label="Suplente"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('nome_suplente')}
                    helperText={errors.nome_suplente}
                    fullWidth
                    required
                />

                <TextField
                    variant="outlined"
                    value={formFiscalizacao.email_suplente}
                    name="email_suplente"
                    onChange={handleInputChange}
                    label="E-mail do Suplente"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('email_fiscal')}
                    helperText={errors.email_fiscal}
                    fullWidth
                    required
                />
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    onClick={() => { setOpenFormFiscalizacao({ ...openFormFiscalizacao, open: false }); }}
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
                    
                    {openFormFiscalizacao.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormGestaoFiscalizacao;