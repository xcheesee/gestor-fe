import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper
} from '@mui/material';
import FormCertidao from './FormCertidao';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';

const TabCertidoes = (props) => {
    const campos = [
        "Certidão",
        "Validade"
    ];

    const valores = [
        props.certidoes,
        props.formataData(props.validade_certidoes)
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaCertidoes = (props) => {
    const { 
        certidoes, 
        estaCarregado, 
        formataData, 
        retornaCampoValor,
        numContrato, 
        setSnackbar,
        ...other 
    } = props;

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormCertidao, setOpenFormCertidao] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formCertidao, setFormCertidao] = useState({
        contrato_id: numContrato,
        certidoes: '',
        validade_certidoes: ''
    });

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({ 
            open: true, 
            id: id 
        }); 
        setAcao('excluir');
    }

    const excluiCertidao = (id) => {
        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api/certidao/${id}`;
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

    const handleClickEditar = (e, certidao) => {
        setFormCertidao({
            id: certidao.id,
            contrato_id: certidao.contrato_id,
            certidoes: certidao.certidoes,
            validade_certidoes: certidao.validade_certidoes
        }); 
        setOpenFormCertidao({ 
            open: true, 
            acao: 'editar' 
        });
        setAcao('editar');
    }

    const editaCertidao = (id, formCertidaoEdit) => {
        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api/certidao/${id}`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formCertidaoEdit)
        }

        setCarregando(true);
        
        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Certidão editada com sucesso!',
                        color: 'success'
                    });
                    setOpenFormCertidao({ 
                        open: false, 
                        acao: 'adicionar' 
                    });
                    setFormCertidao({
                        ...formCertidao,
                        certidoes: '',
                        validade_certidoes: '',
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível editar a certidão`,
                        color: 'error'
                    });
                }
            });
    }

    const handleClickAdicionar = () => {
        setOpenFormCertidao({ 
            open: true, 
            acao: 'adicionar' 
        });
        setFormCertidao({
            contrato_id: numContrato,
            certidoes: '',
            validade_certidoes: ''
        });
    }

    const enviaCertidao = () => {
        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api/certidao`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formCertidao)
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Certidão enviada com sucesso!',
                        color: 'success'
                    });
                    setOpenFormCertidao({ 
                        open: false, 
                        acao: 'adicionar' 
                    });
                    setFormCertidao({
                        ...formCertidao,
                        certidoes: '',
                        validade_certidoes: '',
                    });
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível enviar a certidão`,
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
            {certidoes.map((certidao, index) => {
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
                            Certidão # {certidao.id}
                        </Divider>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TabCertidoes 
                                certidoes={certidao.certidoes}
                                validade_certidoes={certidao.validade_certidoes}
                                estaCarregado={estaCarregado}
                                formataData={formataData}
                                retornaCampoValor={retornaCampoValor}
                            />

                            <BotoesTab 
                                editar={(e) => { handleClickEditar(e, certidao, certidao.id); }}
                                excluir={() => { handleClickExcluir(certidao.id); }}
                            />
                        </Box>
                    </Box>
                );
            })}

            <FormCertidao 
                formCertidao={formCertidao} 
                setFormCertidao={setFormCertidao} 
                openFormCertidao={openFormCertidao}
                setOpenFormCertidao={setOpenFormCertidao}
                setSnackbar={setSnackbar}
                enviaCertidao={enviaCertidao}
                editaCertidao={editaCertidao}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
            />

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar certidão"
            />
        
            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao} 
                fnExcluir={excluiCertidao}
                fnEditar={editaCertidao}
                formInterno={formCertidao}
                carregando={carregando}
                texto="certidão"
            />
        </Box>
    );
}

export default ListaCertidoes;