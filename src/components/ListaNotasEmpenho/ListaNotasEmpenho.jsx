import React, { useEffect, useState } from 'react';
import { 
    Box,
    Divider,
    Paper,
    CircularProgress,
    Fade
} from '@mui/material';
import FormNotaEmpenho from './FormNotaEmpenho';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import { formataData, formataValores } from '../../commom/utils/utils';
import { postFormData, putFormData } from '../../commom/utils/api';

const TabNotasEmpenho = (props) => {
    const campos = [
        "Tipo de Empenho",
        "Data Emissão",
        "Número da Nota de Empenho",
        "Valor de Empenho"
    ];

    const valores = [
        props.tipo_empenho,
        formataData(props.data_emissao),
        props.numero_nota,
        formataValores(props.valor_empenho)
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaNotasEmpenho = (props) => {
    const { 
        notasempenho,
        setNotasEmpenho,
        mudancaNotasEmpenho,
        setMudancaNotasEmpenho,
        carregandoNotasEmpenho,
        setCarregandoNotasEmpenho,
        estaCarregado,  
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

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/empenho_notas/${numContrato}`;
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
                setNotasEmpenho(data.data);
                setCarregandoNotasEmpenho(false);
            })
    }, [mudancaNotasEmpenho, numContrato, setNotasEmpenho, setCarregandoNotasEmpenho])

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
            setMudancaNotasEmpenho(!mudancaNotasEmpenho);
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

    const editaNotaEmpenho = async (id, formNotaEmpenhoEdit) => {
        setCarregando(true);
        const res = await putFormData(id, formNotaEmpenhoEdit, "empenho_nota")
        if (res.status === 200) {
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
        } else {
            setCarregando(false);
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível editar a nota de empenho`,
                color: 'error'
            });
        }
        setCarregando(false);
        setMudancaNotasEmpenho(!mudancaNotasEmpenho);
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

    const enviaNotaEmpenho = async (form) => {
        setCarregando(true);
        const res = await postFormData(form, "empenho_nota")
        if (res.status === 201) {
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
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar a nota de empenho`,
                color: 'error'
            });
        }
        setCarregando(false);
        setMudancaNotasEmpenho(!mudancaNotasEmpenho);
    }
    
    return (
        <Box>
            {notasempenho.map((notaempenho, index) => {
                console.log(notasempenho)
                return (
                    <Fade in={true} timeout={400} key={index}>
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
                                    retornaCampoValor={retornaCampoValor}
                                />

                                <BotoesTab 
                                    editar={(e) => { handleClickEditar(e, notaempenho, notaempenho.id); }}
                                    excluir={() => { handleClickExcluir(notaempenho.id); }}
                                />
                            </Box>
                        </Box>
                    </Fade>
                );
            })}

            <FormNotaEmpenho 
                formNotaEmpenho={formNotaEmpenho} 
                setFormNotaEmpenho={setFormNotaEmpenho} 
                openFormNotaEmpenho={openFormNotaEmpenho}
                setOpenFormNotaEmpenho={setOpenFormNotaEmpenho}
                enviaNotaEmpenho={enviaNotaEmpenho}
                editaNotaEmpenho={editaNotaEmpenho}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
                errors={errors}
                setErrors={setErrors}
            />

            {
                carregandoNotasEmpenho
                ? 
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                        <CircularProgress size={30} />
                    </Box>
                : 
                    ""
            } 

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar nota de empenho"
            />
        
            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao} 
                form="empenho_form"
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