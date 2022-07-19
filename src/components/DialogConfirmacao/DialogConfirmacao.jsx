import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress
} from '@mui/material';

const DialogConfirmacao = (props) => {
    const {
        openConfirmacao,
        setOpenConfirmacao,
        acao,
        fnExcluir,
        fnEditar,
        formInterno,
        carregando,
        texto
    } = props;

    if (acao === 'excluir') {
        return (
            <Dialog open={openConfirmacao.open} fullWidth>
                <DialogTitle>
                    Excluir {texto}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirma a exclusão: 
                            <strong> {texto[0].toUpperCase() + texto.substring(1)} {`#${openConfirmacao.id}`}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        sx={{ textTransform: 'none', color: '#821f1f' }} 
                        onClick={() => { setOpenConfirmacao({ ...openConfirmacao, open: false, id: '' }); }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        sx={{ textTransform: 'none' }}
                        onClick={() => { fnExcluir(openConfirmacao.id); }}
                    >
                        {carregando
                            ? <CircularProgress size={14} sx={{ mr: '0.3rem' }} /> 
                            : ""
                        }
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        );
    } else {
        return (
            <Dialog open={openConfirmacao.open} fullWidth>
                <DialogTitle>
                    Editar {texto}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirma a edição: 
                        <strong> {texto[0].toUpperCase() + texto.substring(1)} {`#${openConfirmacao.id}`}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        sx={{ textTransform: 'none', color: '#821f1f' }} 
                        onClick={() => { setOpenConfirmacao({ ...openConfirmacao, open: false, id: '' }); }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        sx={{ textTransform: 'none' }}  
                        onClick={(e) => { 
                            fnEditar(e, formInterno, openConfirmacao.id); 
                            setOpenConfirmacao({ open: false, id: '' }); 
                        }}
                    >
                        Editar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default DialogConfirmacao;