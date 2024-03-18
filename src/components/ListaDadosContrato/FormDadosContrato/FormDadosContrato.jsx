import React, { useState } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import BoxDadosContrato from '../../BoxDadosContrato';
import DialogConfirmacao from '../../DialogConfirmacao';
import { editaDadosContrato } from '../../../commom/utils/api';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../../atomStore';

const FormDadosContrato = (props) => {
    const {
        dados,
        numContrato,
        openDadosCon,
        setOpenDadosCon,
        mudancaContrato,
        setMudancaContrato,
    } = props;

    const [errors, setErrors] = useState({});
    const [error, setError] = useState(false);
    const [focusError, setFocusError] = useState('')
    const [carregandoEnvio, setCarregandoEnvio] = useState(false);
    const departamentos = JSON.parse(localStorage.getItem('departamentos'));
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: numContrato
    });

    const setSnackbar = useSetAtom(snackbarAtom)

    const enviaDadosContrato = async (e, formInterno, id) => {
        setCarregandoEnvio(true);
        const res = await editaDadosContrato(e, dados, formInterno, id)
        console.log(res)
        if(res.status === 200) {
            setOpenDadosCon(false);
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Contrato editado com sucesso!',
                color: 'success'
            });
        } else if(res.status === 422) {
            setErrors(res.errors);
            setFocusError(Object.keys(errors)[0])
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                message: 
                    <div>
                        Não foi possível editar o contrato
                        <br/>
                        Erro: ${res.message}
                    </div>,
                color: 'error'
            });
        }
        setCarregandoEnvio(false);
        setMudancaContrato(!mudancaContrato);
    }

    return (
        <>
        <Dialog open={openDadosCon} fullWidth maxWidth="md">
            <DialogTitle>
                Editar dados de contrato
            </DialogTitle>

            <DialogContent>
                <BoxDadosContrato 
                    errors={errors}
                    setErrors={setErrors}
                    error={error}
                    setError={setError}
                    dados={dados}
                    departamentos={departamentos}
                    enviaDadosContrato={enviaDadosContrato}
                    numContrato={numContrato}
                    focusError={focusError}
                    setFocusError={setFocusError}
                    acao="editar"
                />
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                    onClick={() => { 
                        setOpenDadosCon(false); 
                    }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={() => setOpenConfirmacao({ open: true, id: numContrato })}
                    disabled={error}
                >
                    {carregandoEnvio
                        ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                    }
                    Editar
                </Button>
            </DialogActions>
        </Dialog>
        
        <DialogConfirmacao 
            formId='contrato-form'
            openConfirmacao={openConfirmacao}
            setOpenConfirmacao={setOpenConfirmacao}
            acao="editar"
            formInterno={dados}
            texto="contrato"
        />
        </>
    );
}

export default FormDadosContrato;