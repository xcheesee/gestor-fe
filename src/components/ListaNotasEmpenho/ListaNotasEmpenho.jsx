import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper
} from '@mui/material';
import FormNotaEmpenho from './FormNotaEmpenho';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';

const TabNotasEmpenho = (props) => {
    const campos = [
        "Tipo de Empenho",
        "Data Emissão",
        "Número da Nota de Empenho",
        "Valor de Empenho"
    ];

    const valores = [
        props.tipo_empenho,
        props.formataData(props.data_emissao),
        props.numero_nota,
        props.formataValores(props.valor_empenho)
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaNotasEmpenho = (props) => {
    const { 
        notasempenho, 
        estaCarregado, 
        formataData, 
        formataValores, 
        retornaCampoValor,
        numContrato, 
        setSnackbar
    } = props;

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormNotaEmpenho, setOpenFormNotaEmpenho] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formNotaEmpenho, setFormNotaEmpenho] = useState({
        contrato_id: numContrato,
        tipo_empenho: '',
        data_emissao: '',
        numero_nota: '',
        valor_empenho: ''
    });
    const [errors, setErrors] = useState({});

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({ 
            open: true, 
            id: id 
        }); 
        setAcao('excluir');
    }

    const excluiNotaEmpenho = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/empenho_nota/${id}`;
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
            if (res.ok) {
                setOpenConfirmacao({ open: false, id: ''});
                setCarregando(false);
                setSnackbar({
                    open: true,
                    severity: 'success',
                    text: 'Nota de Empenho excluída com sucesso!',
                    color: 'success'
                });
                return res.json();
            } else {
                setCarregando(false);
                setSnackbar({
                    open: true,
                    severity: 'error',
                    text: `Erro ${res.status} - Não foi possível excluir a nota de empenho`,
                    color: 'error'
                });
            }
        })
    }

    const handleClickEditar = (e, notaempenho) => {
        setFormNotaEmpenho({
            id: notaempenho.id,
            contrato_id: notaempenho.contrato_id,
            tipo_empenho: notaempenho.tipo_empenho,
            data_emissao: notaempenho.data_emissao,
            numero_nota: notaempenho.numero_nota,
            valor_empenho: notaempenho.valor_empenho
        }); 
        setOpenFormNotaEmpenho({ 
            open: true, 
            acao: 'editar' 
        });
        setAcao('editar');
    }

    const editaNotaEmpenho = (e, formNotaEmpenhoEdit, id) => {
        const url = `${process.env.REACT_APP_API_URL}/empenho_nota/${id}`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formNotaEmpenhoEdit)
        }

        setCarregando(true);
        
        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Nota de Empenho editada com sucesso!',
                        color: 'success'
                    });
                    setOpenFormNotaEmpenho({ 
                        open: false, 
                        acao: 'adicionar' 
                    });
                    setFormNotaEmpenho({
                        ...formNotaEmpenho,
                        tipo_empenho: '',
                        data_emissao: '',
                        numero_nota: '',
                        valor_empenho: ''
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar a nota de empenho`,
                        color: 'error'
                    });
                }
            });
    }

    const handleClickAdicionar = () => {
        setOpenFormNotaEmpenho({ 
            open: true, 
            acao: 'adicionar' 
        });
        setFormNotaEmpenho({
            contrato_id: numContrato,
            tipo_empenho: '',
            data_emissao: '',
            numero_nota: '',
            valor_empenho: ''
        });
    }

    const enviaNotaEmpenho = () => {
        const url = `${process.env.REACT_APP_API_URL}/empenho_nota`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formNotaEmpenho)
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Nota de Empenho enviada com sucesso!',
                        color: 'success'
                    });
                    setOpenFormNotaEmpenho({ 
                        open: false, 
                        acao: 'adicionar' 
                    });
                    setFormNotaEmpenho({
                        ...formNotaEmpenho,
                        tipo_empenho: '',
                        data_emissao: '',
                        numero_nota: '',
                        valor_empenho: ''
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível enviar a nota de empenho`,
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
            {notasempenho.map((notaempenho, index) => {
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
                            Nota de Empenho # {notaempenho.id}
                        </Divider>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TabNotasEmpenho 
                                tipo_empenho={notaempenho.tipo_empenho}
                                data_emissao={notaempenho.data_emissao}
                                numero_nota={notaempenho.numero_nota}
                                valor_empenho={notaempenho.valor_empenho}
                                estaCarregado={estaCarregado}
                                formataData={formataData}
                                formataValores={formataValores}
                                retornaCampoValor={retornaCampoValor}
                            />

                            <BotoesTab 
                                editar={(e) => { handleClickEditar(e, notaempenho, notaempenho.id); }}
                                excluir={() => { handleClickExcluir(notaempenho.id); }}
                            />
                        </Box>
                    </Box>
                );
            })}

            <FormNotaEmpenho 
                formNotaEmpenho={formNotaEmpenho} 
                setFormNotaEmpenho={setFormNotaEmpenho} 
                openFormNotaEmpenho={openFormNotaEmpenho}
                setOpenFormNotaEmpenho={setOpenFormNotaEmpenho}
                enviaNotaEmpenho={enviaNotaEmpenho}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
                errors={errors}
                setErrors={setErrors}
            />

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar nota de empenho"
            />
        
            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao} 
                fnExcluir={excluiNotaEmpenho}
                fnEditar={editaNotaEmpenho}
                formInterno={formNotaEmpenho}
                carregando={carregando}
                texto="nota de empenho"
            />
        </Box>
    );
}

export default ListaNotasEmpenho;