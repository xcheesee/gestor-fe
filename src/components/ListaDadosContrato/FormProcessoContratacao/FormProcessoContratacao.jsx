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
import { editaDadosContrato } from '../../../commom/utils/api';

const FormProcessoContratacao = (props) => {
    const {
        dados,
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
        licitacao_modelo_id: dados?.licitacao_modelo_id,
        licitacao_modelo: dados?.licitacao_modelo,
        envio_material_tecnico: dados?.envio_material_tecnico,
        minuta_edital: dados?.minuta_edital,
        abertura_certame: dados?.abertura_certame,
        homologacao: dados?.homologacao
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

    const enviaDadosProcesso = async (e, formInterno, id) => {
        setCarregandoEnvio(true);
        const res = await editaDadosContrato(e, dados, formInterno, id)
        if(res.status === 200) {
            setOpenProcCon(false);
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Processo de contratação editado com sucesso!',
                color: 'success'
            });
        } else if(res.status === 422) {
            setErrors(res.errors);
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível editar o processo de contratação`,
                color: 'error'
            });
        }
        setCarregandoEnvio(false);
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
                    dados={dados}
                    errors={errors}
                    enviaDadosProcesso={enviaDadosProcesso}
                    numContrato={numContrato}
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
                    <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={ () => setOpenConfirmacao({ open: true, id: numContrato }) }
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
            form="form-contr"
            formInterno={{
                ...dados,
                ...processoContratacao
            }}
            texto="processo de contratação"
        />
        </>
    );
}

export default FormProcessoContratacao;