import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper
} from '@mui/material';
import FormRecOrcamentario from './FormRecOrcamentario';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';

const TabRecursoOrcamentario = (props) => {
    const campos = [
        "Nota de empenho",
        "Saldo de empenho",
        "Dotação orçamentária"
    ];

    const valores = [
        props.nota_empenho,
        props.formataValores(props.saldo_empenho),
        props.formataValores(props.dotacao_orcamentaria)
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaRecOrcamentario = (props) => {
    const {
        recOrcamentarios,
        estaCarregado,
        formataValores,
        retornaCampoValor,
        numContrato,
        setSnackbar,
        ...other
    } = props;

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormRecOrcamentario, setOpenFormRecOrcamentario] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formRecOrcamentario, setFormRecOrcamentario] = useState({
        contrato_id: numContrato,
        nota_empenho: '',
        saldo_empenho: '',
        dotacao_orcamentaria: ''
    });

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiRecOrcamentario = (id) => {
        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api/recursoorcamentario/${id}`;
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
                    setOpenConfirmacao({ open: false, id: '' });
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Certidão excluída com sucesso!',
                        color: 'success'
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível excluir a certidão`,
                        color: 'error'
                    });
                }
            })
    }

    const handleClickEditar = (e, recOrcamentario) => {
        setFormRecOrcamentario({
            id: recOrcamentario.id,
            contrato_id: recOrcamentario.contrato_id,
            nota_empenho: recOrcamentario.nota_empenho,
            saldo_empenho: recOrcamentario.saldo_empenho,
            dotacao_orcamentaria: recOrcamentario.dotacao_orcamentaria
        });
        setOpenFormRecOrcamentario({
            open: true,
            acao: 'editar'
        });
        setAcao('editar');
    }

    const editaRecOrcamentario = (id, formRecOrcamentarioEdit) => {
        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api/recursoorcamentario/${id}`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formRecOrcamentarioEdit)
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Recurso orçamentário editado com sucesso!',
                        color: 'success'
                    });
                    setOpenFormRecOrcamentario({
                        open: false,
                        acao: 'adicionar'
                    });
                    setFormRecOrcamentario({
                        ...formRecOrcamentario,
                        nota_empenho: '',
                        saldo_empenho: '',
                        dotacao_orcamentaria: ''
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar os dados de recurso orçamentário`,
                        color: 'error'
                    });
                }
            });
    }

    const handleClickAdicionar = () => {
        setOpenFormRecOrcamentario({
            open: true,
            acao: 'adicionar'
        });
        setFormRecOrcamentario({
            contrato_id: numContrato,
            nota_empenho: '',
            saldo_empenho: '',
            dotacao_orcamentaria: ''
        });
    }

    const enviaRecOrcamentario = () => {
        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api/recursoorcamentario`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formRecOrcamentario)
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Recurso orçamentário enviado com sucesso!',
                        color: 'success'
                    });
                    setOpenFormRecOrcamentario({
                        open: false,
                        acao: 'adicionar'
                    });
                    setFormRecOrcamentario({
                        ...formRecOrcamentario,
                        nota_empenho: '',
                        saldo_empenho: '',
                        dotacao_orcamentaria: ''
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível registrar o recurso orçamentário`,
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
            {recOrcamentarios.map((recOrcamentario, index) => {
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
                            Recurso orçamentário # {recOrcamentario.id}
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TabRecursoOrcamentario 
                                nota_empenho={recOrcamentario.nota_empenho}
                                saldo_empenho={recOrcamentario.saldo_empenho}
                                dotacao_orcamentaria={recOrcamentario.dotacao_orcamentaria}
                                estaCarregado={estaCarregado}
                                formataValores={formataValores}
                                retornaCampoValor={retornaCampoValor}
                            />

                            <BotoesTab 
                                editar={(e) => { handleClickEditar(e, recOrcamentario, recOrcamentario.id); }}
                                excluir={() => { handleClickExcluir(recOrcamentario.id); }}
                            />
                        </Box>
                    </Box>
                );
            })}

            <FormRecOrcamentario 
                formRecOrcamentario={formRecOrcamentario}
                setFormRecOrcamentario={setFormRecOrcamentario}
                openFormRecOrcamentario={openFormRecOrcamentario} 
                setOpenFormRecOrcamentario={setOpenFormRecOrcamentario} 
                setSnackbar={setSnackbar}
                enviaRecOrcamentario={enviaRecOrcamentario}
                editaRecOrcamentario={editaRecOrcamentario}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
            />

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar recurso orçamentário"
            />

            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao} 
                fnExcluir={excluiRecOrcamentario}
                fnEditar={editaRecOrcamentario}
                formInterno={formRecOrcamentario}
                carregando={carregando}
                texto="recurso orçamentário"
            />
        </Box>
    );
}

export default ListaRecOrcamentario;