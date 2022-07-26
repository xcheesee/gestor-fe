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
import BoxProcessoContratacao from '../../BoxProcessoContratacao';
import DialogConfirmacao from '../../DialogConfirmacao';

const FormProcessoContratacao = (props) => {
    const {
        formContrato,
        modelosLicitacao,
        openProcCon,
        setOpenProcCon,
        numContrato,
        setSnackbar,
        carregando,
        mudancaContrato,
        setMudancaContrato
    } = props;

    const [errors, setErrors] = useState({});
    const [processoContratacao, setProcessoContratacao] = useState({
        licitacao_modelo_id: formContrato.licitacao_modelo_id,
        licitacao_modelo: formContrato.licitacao_modelo,
        envio_material_tecnico: formContrato.envio_material_tecnico,
        minuta_edital: formContrato.minuta_edital,
        abertura_certame: formContrato.abertura_certame,
        homologacao: formContrato.homologacao
    });
    const [carregandoEnvio, setCarregandoEnvio] = useState(false);
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: numContrato
    });

    const handleChange = (event, form, setForm) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    const handleChangeModeloLicitacao = (event, form, setForm) => {
        modelosLicitacao.forEach((modeloLicitacao, index) => {
            if (modeloLicitacao.id === event.target.value) {
                setForm({
                    ...form,
                    licitacao_modelo_id: event.target.value,
                    licitacao_modelo: modelosLicitacao[index].nome
                });
            } else if (event.target.value === "") {
                setForm({
                    ...form,
                    licitacao_modelo_id: "",
                    licitacao_modelo: ""
                })
            }
        });
    }

    const editaProcContratacao = (e, formInterno, id) => {
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
                        text: 'Processo de contratação editado com sucesso!',
                        color: 'success'
                    });
                    setOpenProcCon(false);
                    return res.json();
                } else if (res.status === 422) { 
                    return res.json()
                        .then(data => setErrors(data.errors));
                } else {
                    setCarregandoEnvio(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar o processo de contratação`,
                        color: 'error'
                    });
                }
            });

        setMudancaContrato(!mudancaContrato);
    }

    return (
        <>
        <Dialog open={openProcCon}>
            <DialogTitle>
                Editar processo de contratação
            </DialogTitle>

            <DialogContent>
                <BoxProcessoContratacao 
                    errors={errors}
                    processoContratacao={processoContratacao}
                    setProcessoContratacao={setProcessoContratacao}
                    handleChangeModeloLicitacao={handleChangeModeloLicitacao}
                    modelosLicitacao={modelosLicitacao}
                    carregando={carregando}
                    handleChange={handleChange}
                    acao="editar"
                />
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                    onClick={() => setOpenProcCon(false)}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={ () => setOpenConfirmacao({ open: true, id: numContrato }) }
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
            fnEditar={editaProcContratacao}
            formInterno={{
                ...formContrato,
                ...processoContratacao
            }}
            texto="processo de contratação"
        />
        </>
    );
}

export default FormProcessoContratacao;