import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper
} from '@mui/material';
import FormGestaoFiscalizacao from './FormGestaoFiscalizacao';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';

const TabFiscalizacao = (props) => {
    const campos = [
        "Gestor",
        "E-mail Gestor",
        "Fiscal",
        "E-mail Fiscal",
        "Suplente",
        "E-mail Suplente"
    ];

    const valores = [
        props.nome_gestor,
        props.email_gestor,
        props.nome_fiscal,
        props.email_fiscal,
        props.nome_suplente,
        props.email_suplente
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaFiscalizacoes = (props) => {
    const {
        fiscalizacoes,
        estaCarregado,
        retornaCampoValor,
        snackbar,
        setSnackbar,
        numContrato,
        ...other
    } = props;
    
    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormFiscalizacao, setOpenFormFiscalizacao] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formFiscalizacao, setFormFiscalizacao] = useState({
        contrato_id: numContrato,
        nome_gestor: '',
        email_gestor: '',
        nome_fiscal: '',
        email_fiscal: '',
        nome_suplente: '',
        email_suplente: ''
    });

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiFiscalizacao = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/gestaofiscalizacao/${id}`
        const token = sessionStorage.getItem('access_token');
        const option = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        setCarregando(true);

        fetch(url, option)
            .then(res => {
                if (res.ok) {
                    setOpenConfirmacao({ open: false, id: ''});
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Gestão/fiscalização excluída com sucesso!',
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

    const handleClickEditar = (e, fiscalizacao) => {
        setFormFiscalizacao({
            id: fiscalizacao.id,
            contrato_id: fiscalizacao.contrato_id,
            nome_gestor: fiscalizacao.nome_gestor,
            email_gestor: fiscalizacao.email_gestor,
            nome_fiscal: fiscalizacao.nome_fiscal,
            email_fiscal: fiscalizacao.email_fiscal,
            nome_suplente: fiscalizacao.nome_suplente,
            email_suplente: fiscalizacao.email_suplente
        });
        setOpenFormFiscalizacao({
            open: true,
            acao: 'editar'
        });
        setAcao('editar');
    }

    const editaFiscalizacao = (id, formFiscalizacaoEdit) => {
        const url = `${process.env.REACT_APP_API_URL}/gestaofiscalizacao/${id}`
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formFiscalizacaoEdit)
        }

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if(res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Gestão/fiscalização editada com sucesso!',
                        color: 'success'
                    });
                    setOpenFormFiscalizacao({
                        open: false,
                        acao: 'adicionar'
                    });
                    setFormFiscalizacao({
                        ...formFiscalizacao,
                        nome_gestor: '',
                        email_gestor: '',
                        nome_fiscal: '',
                        email_fiscal: '',
                        nome_suplente: '',
                        email_suplente: ''
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar a gestão/fiscalização`,
                        color: 'error'
                    });
                }
            });
    }

    const handleClickAdicionar = () => {
        setOpenFormFiscalizacao({
            open: true,
            acao: 'adicionar'
        });
        setFormFiscalizacao({
            contrato_id: numContrato,
            nome_gestor: '',
            email_gestor: '',
            nome_fiscal: '',
            email_fiscal: '',
            nome_suplente: '',
            email_suplente: ''
        });
    }

    const enviaFiscalizacao = () => {
        const url = `${process.env.REACT_APP_API_URL}/gestaofiscalizacao`
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formFiscalizacao)
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Gestão/fiscalização enviada com sucesso!',
                        color: 'success'
                    });
                    setOpenFormFiscalizacao({
                        open: false,
                        acao: 'adicionar'
                    });
                    setFormFiscalizacao({
                        ...formFiscalizacao,
                        nome_gestor: '',
                        email_gestor: '',
                        nome_fiscal: '',
                        email_fiscal: '',
                        nome_suplente: '',
                        email_suplente: ''
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível enviar a gestão/fiscalização`,
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
            {fiscalizacoes.map((fiscalizacao, index) => {
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
                            Gestão/fiscalização # {fiscalizacao.id}
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TabFiscalizacao 
                                nome_gestor={fiscalizacao.nome_gestor}
                                email_gestor={fiscalizacao.email_gestor}
                                nome_fiscal={fiscalizacao.nome_fiscal}
                                email_fiscal={fiscalizacao.email_fiscal}
                                nome_suplente={fiscalizacao.nome_suplente}
                                email_suplente={fiscalizacao.email_suplente}
                                retornaCampoValor={retornaCampoValor}
                                estaCarregado={estaCarregado}
                            />

                            <BotoesTab 
                                excluir={(e) => { handleClickExcluir(fiscalizacao.id); }}
                                editar={(e) => { handleClickEditar(e, fiscalizacao, fiscalizacao.id); }}
                            />
                        </Box>
                    </Box>
                );
            })}

            <FormGestaoFiscalizacao 
                formFiscalizacao={formFiscalizacao}
                setFormFiscalizacao={setFormFiscalizacao}
                enviaFiscalizacao={enviaFiscalizacao}
                carregando={carregando}
                openFormFiscalizacao={openFormFiscalizacao}
                setOpenFormFiscalizacao={setOpenFormFiscalizacao}
                setOpenConfirmacao={setOpenConfirmacao}
            />

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar gestão/fiscalização"
            />

            <DialogConfirmacao 
                openConfirmacao={openConfirmacao}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                fnExcluir={excluiFiscalizacao}
                fnEditar={editaFiscalizacao}
                formInterno={formFiscalizacao}
                carregando={carregando}
                texto="gestão/fiscalização"
            />
        </Box>
    );
}

export default ListaFiscalizacoes;