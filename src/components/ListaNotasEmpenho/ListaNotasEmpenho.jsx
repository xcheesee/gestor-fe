import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper,
    CircularProgress,
    Fade,
    Dialog
} from '@mui/material';
import FormNotaEmpenho from './FormNotaEmpenho';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import { 
    formataData, 
    formataValores,  
    TabValues, 
    primeiraLetraMaiuscula 
} from '../../commom/utils/utils';
import { 
    throwableDeleteForm, 
    throwableGetData, 
    throwablePostForm, 
    throwablePutForm 
} from '../../commom/utils/api';
import { emprenhoLabels, meses } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorSnackbar } from '../../commom/utils/hooks';

const TabNotasEmpenho = (props) => {
    const valores = {
        ...props,
        data_emissao: formataData(props.data_emissao),
        valor_empenho: formataValores(props.valor_empenho),
        mes_referencia: meses[props.mes_referencia]
    }

    return <TabValues entry={valores} labels={emprenhoLabels} label="empenho" />
}

const ListaNotasEmpenho = ({numContrato}) => {
    const empenhoFormId = 'empenho_form'
    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

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

    const notasEmpenho = useQuery({
        queryKey: ['notasEmpenho', numContrato],
        queryFn: async () => await throwableGetData({path: 'empenho_notas', contratoId: numContrato})
    })
    console.log(notasEmpenho.data)

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({ 
            open: true, 
            id: id 
        }); 
        setAcao('excluir');
    }

    const excluiNotaEmpenho = async (id) => {
        setCarregando(true);
        try{
            await throwableDeleteForm({id, path: 'empenho_nota'})
            setOpenConfirmacao({ open: false, id: ''});
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Nota de Empenho excluída com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries({queryKey: ['notasEmpenho', numContrato]})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
        } catch(e) {
            errorSnackbar.Delete(e)
        }
        setCarregando(false);
    }

    const handleClickEditar = (e, notaempenho) => {
        setFormNotaEmpenho({ ...notaempenho }); 
        setOpenFormNotaEmpenho({ 
            open: true, 
            acao: 'editar' 
        });
        setErrors({})
        setAcao('editar');
    }

    const editaNotaEmpenho = async (id, formNotaEmpenhoEdit) => {
        setCarregando(true);
        try {
            await throwablePutForm({ id, form: formNotaEmpenhoEdit, path: 'empenho_nota'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Nota de Empenho editada com sucesso!',
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
            queryClient.invalidateQueries({queryKey: ['notasEmpenho', numContrato]})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
        } catch(e) {
            errorSnackbar.Put(e)
            //setErrors(e.errors)
        }
        setCarregando(false);
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
        setAcao('adicionar')
        setErrors({})
    }

    const enviaNotaEmpenho = async (form) => {
        setCarregando(true);
        try {
            setErrors({})
            await throwablePostForm({form, path: 'empenho_nota'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Nota de Empenho enviada com sucesso!',
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
            queryClient.invalidateQueries({queryKey: ['notasEmpenho', numContrato]})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
        } catch(e) {
            errorSnackbar.Post(e)
            //setErrors(e.errors)
        }
        setCarregando(false);
    }
    
    return (
        <Box>
            {notasEmpenho.isLoading
                ?<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                    <CircularProgress size={30} />
                </Box>
                :notasEmpenho?.data?.data?.map((notaempenho, index) => {
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
                                        tipo_empenho={(notaempenho?.tipo_empenho?.split("_"))?.reduce((acc, val) => acc + ` ${primeiraLetraMaiuscula(val)}`, "") }
                                        data_emissao={notaempenho.data_emissao}
                                        numero_nota={notaempenho.numero_nota}
                                        valor_empenho={notaempenho.valor_empenho}
                                        mes_referencia={notaempenho.mes_referencia}
                                        ano_referencia={notaempenho.ano_referencia}
                                    />

                                    <BotoesTab 
                                        editar={(e) => { handleClickEditar(e, notaempenho, notaempenho.id); }}
                                        excluir={() => { handleClickExcluir(notaempenho.id); }}
                                    />
                                </Box>
                            </Box>
                        </Fade>
                    );
                })
            }

            <Dialog open={openFormNotaEmpenho.open} fullWidth>
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
                    //setErrors={setErrors}
                    formId={empenhoFormId}
                />
            </Dialog>

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar nota de empenho"
            />
        
            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao} 
                formId={empenhoFormId}
                fnExcluir={excluiNotaEmpenho}
                carregando={carregando}
                texto="nota de empenho"
            />
        </Box>
    );
}

export default ListaNotasEmpenho;