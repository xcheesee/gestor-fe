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
import BoxContatoEmpresa from '../../../BoxContatoEmpresa';
import DialogConfirmacao from '../../../DialogConfirmacao';
import * as EmailValidator from 'email-validator';
import { editaDadosContrato } from '../../../../commom/utils/api';

const FormDadosEmpresa = (props) => {
    const {
        dados,
        // setdados,
        numContrato,
        openDadosEmpresa,
        setOpenDadosEmpresa,
        setSnackbar,
        mudancaContrato,
        setMudancaContrato
    } = props;

    const [errors, setErrors] = useState({});
    const [error, setError] = useState(false);
    const [carregandoEnvio, setCarregandoEnvio] = useState(false);
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: numContrato
    });
    const [contatoEditado, setContatoEditado] = useState({...dados});
    const nome_empresa = useRef(null);
    const email_empresa = useRef(null);

    const checaErrosEmail = (event) => {
        if (EmailValidator.validate(event.target.value) === true) {
            const errorsTemp = {...errors};
            delete errorsTemp.email_empresa;
            setErrors(errorsTemp);
            setError(false);
        } else {
            setErrors({
                ...errors,
                email_empresa: "Insira um e-mail válido"
            });
            setError(true);
        }
    }

    const editaDadosEmpresa = async (e, formInterno, id) => {
        setCarregandoEnvio(true);
        const res = await editaDadosContrato(e, dados, formInterno, id)
        if(res.status === 200) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Contato editado com sucesso!',
                color: 'success'
            });
            setOpenDadosEmpresa(false);
        } else if (res.status === 422) { 
            setErrors(res.errors)
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível editar os dados de contato`,
                color: 'error'
            });
        }

        setMudancaContrato(!mudancaContrato);
        setCarregandoEnvio(false);
    }

    return (
        <>
        <Dialog open={openDadosEmpresa}>
            <DialogTitle>
                Editar dados da empresa
            </DialogTitle>

            <DialogContent>
                <BoxContatoEmpresa 
                    errors={errors}
                    dados={dados}
                    email_empresa={email_empresa}
                    editaDadosEmpresa={editaDadosEmpresa}
                    numContrato={numContrato}
                    checaErrosEmail={checaErrosEmail}
                    acao="editar"
                    edicao={true}
                    formInterno={contatoEditado}
                    setFormInterno={setContatoEditado}
                />
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                    onClick={() => setOpenDadosEmpresa(false)}
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
            openConfirmacao={openConfirmacao}
            setOpenConfirmacao={setOpenConfirmacao}
            acao="editar"
            form='dados_empresa_form'
            // fnEditar={editaDadosEmpresa}
            // formInterno={contatoEditado}
            texto="contato"
        />
        </>
    );
}

export default FormDadosEmpresa;