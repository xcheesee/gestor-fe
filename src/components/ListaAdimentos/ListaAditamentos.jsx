import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper
} from '@mui/material';
import FormAditamento from './FormAditamento';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';

const TabAditamentos = (props) => {
    const campos = [
        "Tipo",
        "Valor",
        "Dias Reajuste",
        "Índice reajuste",
        "Porcentagem reajuste"
    ];

    const valores = [
        props.tipo_aditamentos,
        props.formataValores(props.valor_aditamento),
        props.dias_reajuste,
        props.indice_reajuste,
        props.formataPorcentagem(props.pct_reajuste)
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaAditamentos = (props) => {
    const {
        aditamentos,
        estaCarregado,
        formataValores,
        formataData,
        formataPorcentagem,
        retornaCampoValor,
        numContrato,
        setSnackbar,
        ...other
    } = props;

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormAditamento, setOpenFormAditamento] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formAditamento, setFormAditamento] = useState({
        contrato_id: numContrato,
        tipo_aditamentos: '',
        valor_aditamento: '',
        dias_reajuste: '',
        indice_reajuste: '',
        pct_reajuste: ''
    });

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiAditamento = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/aditamento/${id}`;
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
                    setOpenConfirmacao({ open: false, id: '' })
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Aditamento excluído com sucesso!',
                        color: 'success'
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível excluir o aditamento`,
                        color: 'error'
                    });
                }
            })
    }

    const handleClickEditar = (e, aditamento) => {
        setFormAditamento({
            id: aditamento.id,
            contrato_id: aditamento.contrato_id,
            tipo_aditamentos: aditamento.tipo_aditamentos,
            valor_aditamento: aditamento.valor_aditamento,
            dias_reajuste: aditamento.dias_reajuste,
            indice_reajuste: aditamento.indice_reajuste,
            pct_reajuste: aditamento.pct_reajuste
        });
        setOpenFormAditamento({
            open: true,
            acao: 'editar'
        });
        setAcao('editar');
    }

    const editaAditamento = (id, formAditamentoEdit) => {
        const url = `${process.env.REACT_APP_API_URL}/aditamento/${id}`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formAditamentoEdit)
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Aditamento editado com sucesso!',
                        color: 'success'
                    });
                    setOpenFormAditamento({
                        open: false,
                        acao: 'adicionar'
                    });
                    setFormAditamento({
                        ...formAditamento,
                        tipo_aditamentos: '',
                        valor_aditamento: '',
                        dias_reajuste: '',
                        indice_reajuste: '',
                        pct_reajuste: ''
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar o aditamento`,
                        color: 'error'
                    });
                }
            });
    }

    const handleClickAdicionar = () => {
        setOpenFormAditamento({
            open: true,
            acao: 'adicionar'
        });
        setFormAditamento({
            contrato_id: numContrato,
            tipo_aditamentos: '',
            valor_aditamento: '',
            dias_reajuste: '',
            indice_reajuste: '',
            pct_reajuste: ''
        });
    }

    const enviaAditamento = () => {
        const url = `${process.env.REACT_APP_API_URL}/aditamento`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formAditamento)
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Aditamento enviado com sucesso!',
                        color: 'success'
                    });
                    setOpenFormAditamento({ 
                        open: false, 
                        acao: 'adicionar' 
                    });
                    setFormAditamento({
                        ...formAditamento,
                        tipo_aditamentos: '',
                        valor_aditamento: '',
                        dias_reajuste: '',
                        indice_reajuste: '',
                        pct_reajuste: ''
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível enviar o aditamento`,
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
            {aditamentos.map((aditamento, index) => {
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
                            Aditamento # {aditamento.id}
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TabAditamentos 
                                tipo_aditamentos={aditamento.tipo_aditamentos}
                                valor_aditamento={aditamento.valor_aditamento}
                                dias_reajuste={aditamento.dias_reajuste}
                                indice_reajuste={aditamento.indice_reajuste}
                                pct_reajuste={aditamento.pct_reajuste}
                                estaCarregado={estaCarregado}
                                formataValores={formataValores}
                                formataData={formataData}
                                formataPorcentagem={formataPorcentagem}
                                retornaCampoValor={retornaCampoValor}
                            />

                            <BotoesTab 
                                editar={(e) => { handleClickEditar(e, aditamento, aditamento.id); }}
                                excluir={() => { handleClickExcluir(aditamento.id); }}
                            />
                        </Box>
                    </Box>
                );
            })}

            <FormAditamento
                formAditamento={formAditamento}
                setFormAditamento={setFormAditamento}
                openFormAditamento={openFormAditamento} 
                setOpenFormAditamento={setOpenFormAditamento} 
                enviaAditamento={enviaAditamento}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
            />

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar aditamento"
            />

            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao} 
                fnExcluir={excluiAditamento}
                fnEditar={editaAditamento}
                formInterno={formAditamento}
                carregando={carregando}
                texto="aditamento"
            />
        </Box>
    );
}

export default ListaAditamentos;