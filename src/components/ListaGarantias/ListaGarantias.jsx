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
import { formataData, formataValores, TabValues } from '../../commom/utils/utils';
import { deleteGarantia, getGarantias, postFormData, putFormData, throwablePostForm, throwablePutForm } from '../../commom/utils/api';
import { garantiaLabels } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const TabGarantias = (props) => {
    const valores = {
        ...props,
        valor_garantia: formataValores(props.valor_garantia),
        data_validade_garantia: formataData(props.data_validade_garantia)
    };

    return <TabValues entry={valores} labels={garantiaLabels} label="garantia" />
}

const ListaGarantias = ({ numContrato }) => {

    const queryClient = useQueryClient()
    const setSnackbar = useSetAtom(snackbarAtom)

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

    const garantias = useQuery({
        queryFn: async () => await getGarantias({numContrato}),
        queryKey: ['garantias', numContrato] 
    })

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiGarantia = async (id) => {
        
        setCarregando(true);
        try{
            await deleteGarantia({id})
            setOpenConfirmacao({ open: false, id: ''});
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Garantia excluída com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries({queryKey: ['garantias', numContrato]})
        } catch(e) {
            setSnackbar({
                open: true,
                severity: 'error',
                message: 
                    <div>
                        Não foi possível enviar.
                        <br/>
                        Erro: {e.message}
                        <br/>
                        {e.errors
                            ?Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                            :<></>
                        }
                    </div>,
                color: 'error'
            });
        }
        setCarregando(false);
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
        try{
            const res = await throwablePutForm({id, form:formGarantiaEdit, path:"garantia"})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Garantia editada com sucesso!',
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
            queryClient.invalidateQueries({queryKey: ['garantias', numContrato]})
        } catch(e) {
            setSnackbar({
                open: true,
                severity: 'error',
                message: 
                    <div>
                        Não foi possível editar.
                        <br/>
                        Erro: {e.message}
                        <br/>
                        {e.errors
                            ?Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                            :<></>
                        }
                    </div>,
                color: 'error'
            });
        }
        setCarregando(false);
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
        try {
            await throwablePostForm({form:formGarantia, path:"garantia"})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Garantia enviada com sucesso!',
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
            queryClient.invalidateQueries({queryKey: ['garantias', numContrato]})
        } catch(e) {
            setSnackbar({
                open: true,
                severity: 'error',
                message: 
                    <div>
                        Não foi possível enviar.
                        <br/>
                        Erro: {e.message}
                        <br/>
                        {e.errors
                            ?Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
                            :<></>
                        }
                    </div>,
                color: 'error'
            });
        }
        setCarregando(false);
    }

    return (
        <Box>
            {garantias.isLoading
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
                :garantias?.data?.data?.map((garantia, index) => {
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
                                    />

                                    <BotoesTab 
                                        excluir={(e) => { handleClickExcluir(garantia.id); }}
                                        editar={(e) => { handleClickEditar(e, garantia, garantia.id); }}
                                    />
                                </Box>
                            </Box>
                        </Fade>
                    ); 
                }
            )}

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