//import React from 'react';
//import { 
//    Dialog,
//    DialogContent,
//    DialogContentText,
//    DialogActions,
//    Button
//} from '@mui/material';
//import CloseIcon from '@mui/icons-material/Close';
//import CheckIcon from '@mui/icons-material/Check';
//import { Link } from 'react-router-dom';
//
//const DialogConfirmSair = ({ openConfirmSair, setOpenConfirmSair, acao, numContrato }) => {
//    const mensagem = acao === 'editar' ? `Tem certeza que deseja cancelar a edição do contrato # ${numContrato}?` : 'Tem certeza que deseja cancelar o envio do contrato e voltar à página principal?';
//    const caminho = acao === 'editar' ? `../contrato/${numContrato}` : '../principal';
//
//    const handleCloseConfirmSair = (event, reason) => {
//        if (reason === 'backdropClick') {
//            return;
//        } else {
//            setOpenConfirmSair(false);
//        }
//    }
//
//    return (
//        <Dialog open={openConfirmSair} onClose={handleCloseConfirmSair} fullWidth>
//            <DialogContent>
//                <DialogContentText sx={{ mt: '1rem' }}>{mensagem}</DialogContentText>
//            </DialogContent>
//            <DialogActions>
//                <Button sx={{ textTransform: 'none', color: (theme) => theme.palette.error.main }} onClick={handleCloseConfirmSair}>
//                    <CloseIcon fontSize="small" sx={{ mr: '0.2rem' }} /> Não
//                </Button>
//                <Link to={caminho}>
//                    <Button sx={{ textTransform: 'none', color: (theme) => theme.palette.success.main }}>
//                        <CheckIcon fontSize="small" sx={{ mr: '0.2rem' }} /> Sim
//                    </Button>
//                </Link>
//            </DialogActions>
//        </Dialog>
//    );
//}
//
//export default DialogConfirmSair;