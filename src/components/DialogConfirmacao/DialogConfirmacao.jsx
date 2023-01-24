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
        formInterno,
        carregando,
        texto,
        form,
        ...other
    } = props;

    if (acao === 'excluir') {
        return (
            <Dialog open={openConfirmacao.open} fullWidth className='p-4'>
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
                        className='text-neutral-600'
                        sx={{ textTransform: 'none' }} 
                        onClick={() => { setOpenConfirmacao({ ...openConfirmacao, open: false, id: '' }); }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        className='bg-red-600'
                        variant='contained'
                        sx={{ textTransform: 'none' }}
                        onClick={() => { fnExcluir(openConfirmacao.id); }}
                    >
                        {carregando
                            ? <CircularProgress size={14} sx={{ mr: '0.3rem' }} color="color" /> 
                            : ""
                        }
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        );
    } else if (acao === 'adicionarExecFin') {
        return (
            <Dialog open={openConfirmacao.open} fullWidth>
                <DialogTitle>
                    Adicionar {texto}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirma a adição do {texto}
                            {
                                formInterno.mes !== '' && formInterno.ano !== ''
                                ? <strong> {other.meses[formInterno.mes - 1].toLowerCase()} de {formInterno.ano}</strong>
                                : ''
                            }
                        ?
                        <br/> 
                        <br />
                        Não será possível editar os dados dos campos <strong>planejado inicial </strong> 
                        e <strong>contratado incial</strong> posteriormente.
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
                            other.fnAdicionar();
                            setOpenConfirmacao({ open: false, id: '' }); 
                        }}
                    >
                        Enviar
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
                        type="submit"
                        form={form}
                        onClick={(e) => { 
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