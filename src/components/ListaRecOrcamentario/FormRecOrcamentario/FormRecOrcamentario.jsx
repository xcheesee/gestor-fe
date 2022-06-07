import React from 'react';
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
import CampoValores from '../../CampoValores';

const FormRecOrcamentario = (props) => {
    const {
        formRecOrcamentario, 
        setFormRecOrcamentario, 
        openFormRecOrcamentario, 
        setOpenFormRecOrcamentario, 
        setSnackbar, 
        enviaRecOrcamentario,
        editaRecOrcamentario,
        carregando,
        setOpenConfirmacao,
    } = props;

    const handleInputChange = (e) => {
        setFormRecOrcamentario({
            ...formRecOrcamentario,
            [e.target.name]: e.target.value
        });
    }

    const handleClickConfirmar = () => {
        if (openFormRecOrcamentario.acao === 'adicionar') {
            enviaRecOrcamentario();
        } // else if (openFormRecOrcamentario.acao === 'editar') {
        //     setOpenConfirmacao({
        //         open: true,
        //         id: formRecOrcamentario.id
        //     });
        // }
    }
    
    return (
        <Dialog open={openFormRecOrcamentario.open} fullWidth>
            <DialogTitle>
                {openFormRecOrcamentario.acao === 'adicionar'
                    ? "Novo recurso orçamentário"
                    : "Editar recurso orçamentário"
                }
            </DialogTitle>

            <DialogContent>
                <TextField
                    variant="outlined"
                    value={formRecOrcamentario.nota_empenho}
                    name="nota_empenho"
                    onChange={handleInputChange}
                    label="Nota de empenho"
                    helperText=""
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                    required
                />

                <CampoValores
                    index=""
                    label="Saldo de empenho"
                    value={formRecOrcamentario.saldo_empenho}
                    state={formRecOrcamentario}
                    setState={setFormRecOrcamentario}
                    name="saldo_empenho"
                    onChange={(e) => { handleInputChange(e); }}
                    checaErros={() => {}}
                    helperText=""
                    required
                    fullWidth
                />

                <CampoValores
                    index=""
                    label="Dotação orçamentária"
                    value={formRecOrcamentario.dotacao_orcamentaria}
                    state={formRecOrcamentario}
                    setState={setFormRecOrcamentario}
                    name="dotacao_orcamentaria"
                    onChange={(e) => { handleInputChange(e); }}
                    checaErros={() => {}}
                    helperText=""
                    required
                    fullWidth
                />
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button
                    onClick={() => { setOpenFormRecOrcamentario({ ...openFormRecOrcamentario, open: false }); }}
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

                    {openFormRecOrcamentario.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormRecOrcamentario;