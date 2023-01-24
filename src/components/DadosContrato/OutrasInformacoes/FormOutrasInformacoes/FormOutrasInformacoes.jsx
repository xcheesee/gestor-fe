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

const FormOutrasInformacoes = (props) => {
    const {
        openOutrasInformacoes,
        setOpenOutrasInformacoes,
        dados,
        numContrato,
        setSnackbar,
        formataInformacoes,
        mudancaContrato,
        setMudancaContrato
    } = props;

    const [errors, setErrors] = useState({});
    const [carregandoEnvio, setCarregandoEnvio] = useState(false);
    const [openConfirmacao, setOpenConfirmacao] = useState({
        id: numContrato,
        open: false
    })
    const [infoAdicionaisEditado, setInfoAdicionaisEditado] = useState({});
    const outras_informacoes = useRef(null);

    const editaOutrasInformacoes = (e, formInterno, id) => {
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
                setMudancaContrato(!mudancaContrato);
                if(res.ok) {
                    setCarregandoEnvio(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Informações adicionais editadas com sucesso!',
                        color: 'success'
                    });
                    setOpenOutrasInformacoes(false);
                    return res.json();
                } else if (res.status === 422) { 
                    return res.json()
                        .then(data => setErrors(data.errors));
                } else {
                    setCarregandoEnvio(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar as informações adicionais`,
                        color: 'error'
                    });
                }
            });
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
                    errors={errors}
                    acao="editar"
                    defaultValue={formataInformacoes(dados?.outras_informacoes)}
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
                    onMouseDown={() => setInfoAdicionaisEditado({
                        ...dados,
                        outras_informacoes: outras_informacoes.current.value
                    })}
                    onMouseUp={() => setOpenConfirmacao({ open: true, id: numContrato })}
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
            fnEditar={editaOutrasInformacoes}
            formInterno={infoAdicionaisEditado}
            texto="informações adicionais"
        />
        </>
    );
}

export default FormOutrasInformacoes;