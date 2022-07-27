import React, { useState, useRef, useEffect } from 'react';
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

const FormDadosContrato = (props) => {
    const {
        formContrato,
        numContrato,
        openDadosCon,
        setOpenDadosCon,
        setSnackbar,
        mudancaContrato,
        setMudancaContrato,
        contratoEditado,
        setContratoEditado
    } = props;

    const [errors, setErrors] = useState({});
    const [error, setError] = useState(false);
    const [carregandoEnvio, setCarregandoEnvio] = useState(false);
    const processo_sei = useRef(null);
    const credor = useRef(null);
    const [tipo_objeto, setTipo_objeto] = useState(formContrato.tipo_objeto);
    const objeto = useRef(null);
    const numero_contrato = useRef(null);
    const condicao_pagamento = useRef(null);
    const prazo_a_partir_de = useRef(null);
    const numero_nota_reserva = useRef(null);
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: numContrato
    });
    // const [contratoEditado, setContratoEditado] = useState({...formContrato});

    useEffect(() => {
        setTipo_objeto(formContrato.tipo_objeto);
    }, [formContrato])

    const handleChange = (event, form, setForm) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    const editaDadosContrato = (e, formInterno, id) => {
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
                        text: 'Contrato editado com sucesso!',
                        color: 'success'
                    });
                    setOpenDadosCon(false);
                    return res.json();
                } else if (res.status === 422) { 
                    return res.json()
                        .then(data => setErrors(data.errors));
                } else {
                    setCarregandoEnvio(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar o contrato`,
                        color: 'error'
                    });
                }
            });
    }

    return (
        <>
        <Dialog open={openDadosCon} fullWidth maxWidth="md">
            <DialogTitle>
                Editar dados de contrato
            </DialogTitle>

            <DialogContent>
                {
                    contratoEditado
                    ?
                    <BoxDadosContrato 
                        errors={errors}
                        setErrors={setErrors}
                        error={error}
                        setError={setError}
                        formContrato={contratoEditado}
                        setFormContrato={setContratoEditado}
                        handleChange={handleChange}
                        processo_sei={processo_sei}
                        credor={credor}
                        tipo_objeto={tipo_objeto}
                        setTipo_objeto={setTipo_objeto}
                        objeto={objeto}
                        numero_contrato={numero_contrato}
                        condicao_pagamento={condicao_pagamento}
                        prazo_a_partir_de={prazo_a_partir_de}
                        numero_nota_reserva={numero_nota_reserva}
                        acao="editar"
                    />
                    :
                    ""
                }
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                    onClick={() => { 
                        setOpenDadosCon(false); 
                        setMudancaContrato(!mudancaContrato); 
                        // setContratoEditado({...formContrato});
                    }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onMouseDown={() => setContratoEditado({
                        ...contratoEditado,
                        processo_sei: processo_sei.current.value,
                        credor: credor.current.value,
                        tipo_objeto: tipo_objeto,
                        objeto: objeto.current.value,
                        numero_contrato: numero_contrato.current.value,
                        condicao_pagamento: condicao_pagamento.current.value,
                        prazo_a_partir_de: prazo_a_partir_de.current.value,
                        numero_nota_reserva: numero_nota_reserva.current.value
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
            fnEditar={editaDadosContrato}
            formInterno={contratoEditado}
            texto="contrato"
        />
        </>
    );
}

export default FormDadosContrato;