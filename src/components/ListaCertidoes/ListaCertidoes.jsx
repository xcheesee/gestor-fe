import React, { useEffect, useState } from 'react';
import { 
    Box,
    Divider,
    Paper,
    CircularProgress,
    Fade
} from '@mui/material';
import FormCertidao from './FormCertidao';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import { formataData } from '../../commom/utils/utils';
import { sendCertidaoEdit, sendNewCertidao } from '../../commom/utils/api';

const TabCertidoes = (props) => {
    const campos = [
        "Certidão",
        "Validade"
    ];

    const valores = [
        props.certidoes,
        formataData(props.validade_certidoes)
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaCertidoes = (props) => {
    const { 
        certidoes,
        setCertidoes,
        mudancaCertidoes,
        setMudancaCertidoes,
        carregandoCertidoes,
        setCarregandoCertidoes,
        estaCarregado, 
        retornaCampoValor,
        numContrato, 
        setSnackbar
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
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/certidoes/${numContrato}`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                setCertidoes(data.data);
                setCarregandoCertidoes(false);
            })
    }, [mudancaCertidoes, numContrato, setCertidoes, setCarregandoCertidoes]);

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({ 
            open: true, 
            id: id 
        }); 
        setAcao('excluir');
    }

    const excluiCertidao = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/certidao/${id}`;
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
            setMudancaCertidoes(!mudancaCertidoes);
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

    const editaCertidao = async (e, formCertidaoEdit, id) => {

        setCarregando(true);
        setMudancaCertidoes(!mudancaCertidoes);
        const res = await sendCertidaoEdit(e, formCertidaoEdit, id)
        if (res.status === 200) {
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
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível editar a certidão`,
                color: 'error'
            });
        }
        setCarregando(false);
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

    const enviaCertidao = async (formData) => {
        setMudancaCertidoes(!mudancaCertidoes);
        setCarregando(true)
        const res = await sendNewCertidao(formData)
        if (res.status === 201) {
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
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar a certidão`,
                color: 'error'
            });
        }
        setCarregando(false);
    }
    
    return (
        <Box>
            {certidoes.map((certidao, index) => {
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
                                Certidão # {certidao.id}
                            </Divider>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TabCertidoes 
                                    certidoes={certidao.certidoes}
                                    validade_certidoes={certidao.validade_certidoes}
                                    estaCarregado={estaCarregado}
                                    retornaCampoValor={retornaCampoValor}
                                />

                                <BotoesTab 
                                    editar={(e) => { handleClickEditar(e, certidao, certidao.id); }}
                                    excluir={() => { handleClickExcluir(certidao.id); }}
                                />
                            </Box>
                        </Box>
                    </Fade>
                );
            })}

            <FormCertidao 
                formCertidao={formCertidao} 
                setFormCertidao={setFormCertidao} 
                openFormCertidao={openFormCertidao}
                setOpenFormCertidao={setOpenFormCertidao}
                editaCertidao={editaCertidao}
                enviaCertidao={enviaCertidao}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
                errors={errors}
                setErrors={setErrors}
            />

            {
                carregandoCertidoes
                ? 
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                        <CircularProgress size={30} />
                    </Box>
                : 
                    ""
            }   
            
            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar certidão"
            />
        
            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                form="certidao_form"
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