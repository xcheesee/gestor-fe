import React, { useState, useRef } from 'react';
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
import BoxOutrasInformacoes from '../../../BoxOutrasInformacoes';
import DialogConfirmacao from '../../../DialogConfirmacao';
import { editaDadosContrato } from '../../../../commom/utils/api';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../../../atomStore';
import { useErrorSnackbar } from '../../../../commom/utils/hooks';

const FormOutrasInformacoes = (props) => {
    const {
        openOutrasInformacoes,
        setOpenOutrasInformacoes,
        dados,
        numContrato,
        mudancaContrato,
        setMudancaContrato
    } = props;
    const setSnackbar = useSetAtom(snackbarAtom)

    const [errors, setErrors] = useState({});
    const [carregandoEnvio, setCarregandoEnvio] = useState(false);
    const [openConfirmacao, setOpenConfirmacao] = useState({
        id: numContrato,
        open: false
    })
    const errorSnackbar = useErrorSnackbar()
    //const [infoAdicionaisEditado, setInfoAdicionaisEditado] = useState({});
    const outras_informacoes = useRef(null);

    const editaOutrasInformacoes = async (e, formInterno, id) => {
        setCarregandoEnvio(true);
        const res = await editaDadosContrato(e, dados, formInterno, id)
        if(res.status === 200) {
            setSnackbar(prev => ({
                ...prev,
                open: true,
                severity: 'success',
                message: 'Informações adicionais editadas com sucesso!',
                color: 'success'
            }));
            setOpenOutrasInformacoes(false);
        } else if (res.status === 422) { 
            setErrors(res.errors)
            //errorSnackbar.Post(e)
        } else {
            setCarregandoEnvio(false);
            setSnackbar(prev => ({
                ...prev,
                open: true,
                severity: 'error',
                message: `Erro ${res.status} - Não foi possível editar as informações adicionais`,
                color: 'error'
            }));
        }
        setMudancaContrato(!mudancaContrato);
        setCarregandoEnvio(false);
    }

    return (
        <>
        <Dialog open={openOutrasInformacoes} fullWidth>
            <DialogTitle>
                Editar informações adicionais
            </DialogTitle>

            <DialogContent>
                <BoxOutrasInformacoes 
                    outras_informacoes={outras_informacoes}
                    dados={dados}
                    editaOutrasInformacoes={editaOutrasInformacoes}
                    numContrato={numContrato}
                    errors={errors}
                    acao="editar"
                    defaultValue={dados?.outras_informacoes}
                />
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                    onClick={() => setOpenOutrasInformacoes(false)}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={() => setOpenConfirmacao({ open: true, id: numContrato })}
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
            openConfirmacao={openConfirmacao}
            setOpenConfirmacao={setOpenConfirmacao}
            acao="editar"
            formId="outras_infos_form"
            //formInterno={infoAdicionaisEditado}
            texto="informações adicionais"
        />
        </>
    );
}

export default FormOutrasInformacoes;