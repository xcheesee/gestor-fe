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

const FormDadosEmpresa = (props) => {
    const {
        formContrato,
        setFormContrato,
        numContrato,
        openDadosEmpresa,
        setOpenDadosEmpresa,
        setSnackbar
    } = props;

    const [errors, setErrors] = useState({});
    const [error, setError] = useState(false);
    const [carregandoEnvio, setCarregandoEnvio] = useState(false);
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: numContrato
    });
    const [contatoEditado, setContatoEditado] = useState({});
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

    const editaDadosEmpresa = (e, formInterno, id) => {
        const url = `${process.env.REACT_APP_API_URL}/contrato/${id}`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formInterno)
        };

        setCarregandoEnvio(true);

        fetch(url, options)
            .then(res => {
                if(res.ok) {
                    setCarregandoEnvio(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Contato editado com sucesso!',
                        color: 'success'
                    });
                    setOpenDadosEmpresa(false);
                    return res.json();
                } else if (res.status === 422) { 
                    return res.json()
                        .then(data => setErrors(data.errors));
                } else {
                    setCarregandoEnvio(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar os dados de contato`,
                        color: 'error'
                    });
                }
            });
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
                    formContrato={formContrato}
                    setFormContrato={setFormContrato}
                    nome_empresa={nome_empresa}
                    email_empresa={email_empresa}
                    checaErrosEmail={checaErrosEmail}
                    acao="editar"
                />
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                    onClick={() => setOpenDadosEmpresa(false)}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onMouseDown={() => setContatoEditado({
                        ...formContrato,
                        nome_empresa: nome_empresa.current.value,
                        email_empresa: email_empresa.current.value
                    })}
                    onMouseUp={() => setOpenConfirmacao({ open: true, id: numContrato })}
                    disabled={error}
                >
                    {carregandoEnvio
                        ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} /> 
                    }
                    Editar
                </Button>
            </DialogActions>
        </Dialog>
        
        <DialogConfirmacao 
            openConfirmacao={openConfirmacao}
            setOpenConfirmacao={setOpenConfirmacao}
            acao="editar"
            fnEditar={editaDadosEmpresa}
            formInterno={contatoEditado}
            texto="contato"
        />
        </>
    );
}

export default FormDadosEmpresa;