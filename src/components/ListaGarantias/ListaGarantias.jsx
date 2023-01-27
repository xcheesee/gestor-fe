import React, { useEffect, useState } from 'react';
import { 
    Box,
    Divider,
    Paper,
    CircularProgress,
    Fade
} from '@mui/material';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import FormGarantia from './FormGarantia';
import { formataData, formataValores } from '../../commom/utils/utils';
import { postFormData, putFormData, sendGarantiaEdit, sendNewGarantia } from '../../commom/utils/api';

const TabGarantias = (props) => {
    const {
        retornaCampoValor
    } = props;

    const campos = [
        "Instituição financeira",
        "Número do documento",
        "Valor",
        "Validade"
    ];

    const valores = [
        props.instituicao_financeira,
        props.numero_documento,
        formataValores(props.valor_garantia),
        formataData(props.data_validade_garantia)
    ];

    return retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaGarantias = (props) => {
    const {
        garantias,
        setGarantias,
        mudancaGarantias,
        setMudancaGarantias,
        carregandoGarantias,
        setCarregandoGarantias,
        estaCarregado,
        formataValores,
        retornaCampoValor,
        setSnackbar,
        numContrato
    } = props;

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormGarantia, setOpenFormGarantia] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formGarantia, setFormGarantia] = useState({
        contrato_id: numContrato,
        instituicao_financeira: '',
        numero_documento: '',
        valor_garantia: '',
        data_validade_garantia: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/garantias/${numContrato}`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }

        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                setGarantias(data.data);
                setCarregandoGarantias(false);
            })
    }, [mudancaGarantias, numContrato, setGarantias, setCarregandoGarantias])
    
    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiGarantia = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/garantia/${id}`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        
        setCarregando(true);

        fetch(url, options)
            .then(res => {
                setMudancaGarantias(!mudancaGarantias);
                if (res.ok) {
                    setOpenConfirmacao({ open: false, id: ''});
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Garantia excluída com sucesso!',
                        color: 'success'
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível excluir`,
                        color: 'error'
                    });
                }
            });
    }

    const handleClickEditar = (e, garantia) => {
        setFormGarantia({
            id: garantia.id,
            contrato_id: garantia.contrato_id,
            instituicao_financeira: garantia.instituicao_financeira,
            numero_documento: garantia.numero_documento,
            valor_garantia: garantia.valor_garantia,
            data_validade_garantia: garantia.data_validade_garantia
        });
        setOpenFormGarantia({
            open: true,
            acao: 'editar'
        });
        setAcao('editar');
    }

    const editaGarantia = async (id, formGarantiaEdit) => {
        setCarregando(true);
        const res = await putFormData(id, formGarantiaEdit, "garantia")
        if(res.status === 200) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Garantia editada com sucesso!',
                color: 'success'
            });
            setOpenFormGarantia({
                open: false,
                acao: 'adicionar'
            });
            setFormGarantia({
                ...formGarantia,
                instituicao_financeira: '',
                numero_documento: '',
                valor_garantia: '',
                data_validade_garantia: ''
            });
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível editar a garantia`,
                color: 'error'
            });
        }
        setCarregando(false);
        setMudancaGarantias(!mudancaGarantias);
    }

    const handleClickAdicionar = () => {
        setOpenFormGarantia({
            open: true,
            acao: 'adicionar'
        });
        setFormGarantia({
            contrato_id: numContrato,
            instituicao_financeira: '',
            numero_documento: '',
            valor_garantia: '',
            data_validade_garantia: ''
        });
    }

    const enviaGarantia = async (formGarantia) => {
        setCarregando(true);
        const res = await postFormData(formGarantia, "garantia")
        if (res.status === 201) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Garantia enviada com sucesso!',
                color: 'success'
            });
            setOpenFormGarantia({
                open: false,
                acao: 'adicionar'
            });
            setFormGarantia({
                ...formGarantia,
                instituicao_financeira: '',
                numero_documento: '',
                valor_garantia: '',
                data_validade_garantia: ''
            });
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar a garantia`,
                color: 'error'
            });
        }
        setMudancaGarantias(!mudancaGarantias);
        setCarregando(false);
    }

    return (
        <Box>
            {garantias.map((garantia, index) => {
                return (
                    <Fade in={true} timeout={400} key={index}>
                        <Box
                            elevation={3} 
                            component={Paper} 
                            sx={{ padding: '1rem', mb: '2rem' }}
                        >
                            <Divider
                                textAlign='right'
                                sx={{
                                    fontWeight: 'light',
                                    fontSize: '1.25rem'
                                }}
                            >
                                Garantia # {garantia.id}
                            </Divider>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TabGarantias 
                                    instituicao_financeira={garantia.instituicao_financeira}
                                    numero_documento={garantia.numero_documento}
                                    valor_garantia={garantia.valor_garantia}
                                    data_validade_garantia={garantia.data_validade_garantia}
                                    estaCarregado={estaCarregado}
                                    retornaCampoValor={retornaCampoValor}
                                    formataValores={formataValores}
                                />

                                <BotoesTab 
                                    excluir={(e) => { handleClickExcluir(garantia.id); }}
                                    editar={(e) => { handleClickEditar(e, garantia, garantia.id); }}
                                />
                            </Box>
                        </Box>
                    </Fade>
                );
            })}

            <FormGarantia 
                formGarantia={formGarantia}
                setFormGarantia={setFormGarantia}
                enviaGarantia={enviaGarantia}
                editaGarantia={editaGarantia}
                carregando={carregando}
                openFormGarantia={openFormGarantia}
                setOpenFormGarantia={setOpenFormGarantia}
                setOpenConfirmacao={setOpenConfirmacao}
                errors={errors}
                setErrors={setErrors}
            />

            {
                carregandoGarantias
                ? 
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            height: '38rem' 
                        }}>
                        <CircularProgress size={30} />
                    </Box>
                : 
                    ""
            }

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar garantia"
            />

            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao} 
                form="garantia_form"
                fnExcluir={excluiGarantia}
                fnEditar={editaGarantia}
                formInterno={formGarantia}
                carregando={carregando}
                texto="garantia"
            />
        </Box>
    );
}

export default ListaGarantias;