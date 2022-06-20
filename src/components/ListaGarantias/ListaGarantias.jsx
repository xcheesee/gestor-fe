import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper
} from '@mui/material';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import FormGarantia from './FormGarantia';

const TabGarantias = (props) => {
    const {
        formataData,
        formataValores,
        retornaCampoValor,
        ...other
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
        estaCarregado,
        formataData,
        formataValores,
        retornaCampoValor,
        snackbar,
        setSnackbar,
        numContrato,
        ...other
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
    
    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiGarantia = (id) => {
        const url = `http://${process.env.REACT_APP_API_URL}/api/garantia/${id}`;
        const token = sessionStorage.getItem('access_token');
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

    const editaGarantia = (id, formGarantiaEdit) => {
        const url = `http://${process.env.REACT_APP_API_URL}/api/garantia/${id}`
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formGarantiaEdit)
        }

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if(res.ok) {
                    setCarregando(false);
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
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar a garantia`,
                        color: 'error'
                    });
                }
            });
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

    const enviaGarantia = () => {
        const url = `http://${process.env.REACT_APP_API_URL}/api/garantia/`
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formGarantia)
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
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
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível enviar a garantia`,
                        color: 'error'
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <Box>
            {garantias.map((garantia, index) => {
                return (
                    <Box 
                        key={index} 
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
                                formataData={formataData}
                                formataValores={formataValores}
                            />

                            <BotoesTab 
                                excluir={(e) => { handleClickExcluir(garantia.id); }}
                                editar={(e) => { handleClickEditar(e, garantia, garantia.id); }}
                            />
                        </Box>
                    </Box>
                );
            })}

            <FormGarantia 
                formGarantia={formGarantia}
                setFormGarantia={setFormGarantia}
                enviaGarantia={enviaGarantia}
                carregando={carregando}
                openFormGarantia={openFormGarantia}
                setOpenFormGarantia={setOpenFormGarantia}
                setOpenConfirmacao={setOpenConfirmacao}
            />

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar garantia"
            />

            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao} 
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