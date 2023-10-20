import React, { useState } from 'react';
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
import { formataData, TabValues } from '../../commom/utils/utils';
import { 
    getCertidoes, 
    throwableDeleteForm, 
    throwablePostForm, 
    throwablePutForm
} from '../../commom/utils/api';
import { certidaoLabels } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorSnackbar } from '../../commom/utils/hooks';

const TabCertidoes = (props) => {
    const valores = {
        ...props,
        validade_certidoes: formataData(props.validade_certidoes)
    }

    return <TabValues entry={valores} labels={certidaoLabels} label="certidao" />
}

const ListaCertidoes = ({ numContrato }) => {
    const formCertidaoId = "certidao_form"
    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

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

    const certidoes = useQuery({
        queryKey: ['certidoes', numContrato],
        queryFn: () => getCertidoes({numContrato})
    })

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({ 
            open: true, 
            id: id 
        }); 
        setAcao('excluir');
    }

    const excluiCertidao = async (id) => {
        setCarregando(true);
        try{
            await throwableDeleteForm({id, path: 'certidao'})
            setOpenConfirmacao({ open: false, id: ''});
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Certidão excluída com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries({queryKey: ['certidoes', numContrato]})
        } catch(e) {
            errorSnackbar.Delete(e)
        }
        setCarregando(false);
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
        try{
            await throwablePutForm({id:id, form:formCertidaoEdit, path:'certidao'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Certidão editada com sucesso!',
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
            queryClient.invalidateQueries({queryKey: ['certidoes', numContrato]})
        } catch(e) {
            errorSnackbar.Put(e)
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
        setCarregando(true)
        try{
            await throwablePostForm({form:formData, path: 'certidao'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Certidão enviada com sucesso!',
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
            queryClient.invalidateQueries({queryKey: ['certidoes', numContrato]})
        } catch(e) {
            errorSnackbar.Post(e)
        }
        setCarregando(false);
    }
    
    return (
        <Box>
            {certidoes.isLoading
                ?<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                    <CircularProgress size={30} />
                </Box>
                :certidoes?.data?.data?.map((certidao, index) => {
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
                formId={formCertidaoId}
                setOpenConfirmacao={setOpenConfirmacao}
                errors={errors}
                setErrors={setErrors}
            />

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar certidão"
            />
        
            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                formId={formCertidaoId}
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