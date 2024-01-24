import React, { useState } from 'react';
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
import FormLocais from './FormLocais';
import { throwableDeleteForm, throwableGetData, throwablePostForm, throwablePutForm } from '../../commom/utils/api';
import { TabValues } from '../../commom/utils/utils';
import { locaisLabels } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorSnackbar } from '../../commom/utils/hooks';

const dicionarioRegioes = {
    "CO": "Centro-Oeste",
    "L": "Leste",
    "N": "Norte",
    "S": "Sul"
}

const TabLocaisServico = (props) => {
    const valores = {
        ...props,
        regiao: dicionarioRegioes[props.regiao],
        subprefeituras: props.subprefeituras.length !== 0 
            ? props.subprefeituras.map( (entry,i) => <div key={`locais-i-${i}`}>{entry.subprefeitura.nome}</div>) 
            : "---"
    }

    return <TabValues entry={valores} labels={locaisLabels} label='locais' />
}

const ListaLocais = ({ numContrato }) => {

    const formLocalId = "local_form"
    const queryClient = useQueryClient()

    const locais = useQuery({
        queryKey: ['locaisContrato', numContrato],
        queryFn: async () => await throwableGetData({path: 'servicoslocais', contratoId: numContrato}),
        onError: (res) => {
            errorSnackbar.Get(res)
            return []
        }
    })

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormLocal, setOpenFormLocal] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formLocal, setFormLocal] = useState({
        contrato_id: numContrato,
        regiao: '',
        subprefeitura_id: '',
        distrito_id: '',
        unidade: '',
        subprefeitura: []
    });
    const [errors, setErrors] = useState({});
    

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiLocal = async (id) => {
        setCarregando(true);

        try {
            await throwableDeleteForm({id, path: 'servicolocal'})
            setOpenConfirmacao({ open: false, id: '' });
            setCarregando(false);
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Regionalização excluída com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries({queryKey: ['locaisContrato', numContrato]})
        } catch(e) {
            errorSnackbar.Delete(e)
        }

        setCarregando(false);
    }

    const handleClickEditar = (e, local) => {
        console.log(local)
        setFormLocal({
            id: local.id,
            contrato_id: local.contrato_id,
            regiao: local.regiao,
            subprefeitura_id: local.subprefeitura_id,
            distrito_id: local.distrito_id,
            unidade: local.unidade,
            subprefeitura: local.subprefeitura
        });
        setOpenFormLocal({
            open: true,
            acao: 'editar'
        });
        setAcao('editar');
    }

    const editaLocal = async (id, formLocalEdit) => {
        setCarregando(true);
        try {
            await throwablePutForm({id, form: formLocalEdit, path: 'servicolocal'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Regionalização editado com sucesso!',
                color: 'success'
            });
            setOpenFormLocal({
                open: false,
                acao: 'adicionar'
            });
            setFormLocal({
                ...formLocal,
                regiao: '',
                subprefeitura_id: '',
                distrito_id: '',
                unidade: '',
                subprefeitura: []
            });
            queryClient.invalidateQueries({queryKey: ['locaisContrato', numContrato]})
        } catch(e) {
            errorSnackbar.Put(e)
        }
        setCarregando(false);
    }

    const handleClickAdicionar = () => {
        setOpenFormLocal({
            open: true,
            acao: 'adicionar'
        });
        setFormLocal({
            contrato_id: numContrato,
            regiao: '',
            subprefeitura_id: [],
            distrito_id: '',
            unidade: '',
            subprefeitura: []
        })
        setAcao('adicionar');
    }

    const enviaLocal = async (form) => {
        setCarregando(true);
        try {
            await throwablePostForm({form: form, path: 'servicolocal'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Regionalização enviado com sucesso!',
                color: 'success'
            });
            setOpenFormLocal({
                open: false,
                acao: 'adicionar'
            });
            setFormLocal({
                ...formLocal,
                regiao: '',
                subprefeitura_id: '',
                distrito_id: '',
                unidade: '',
                subprefeitura: []
            });
            queryClient.invalidateQueries({queryKey: ['locaisContrato', numContrato]})
        } catch(e) {
            errorSnackbar.Post(e)
            if(e.status === 422) {setErrors(e.errors);}
        }
        setCarregando(false);
    }

    return (
        <Box>
            {locais.isLoading
                ?<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                    <CircularProgress size={30} />
                </Box>
                :locais?.data?.data?.map((local, index) => {
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
                                    Regionalização # {local.id}
                                </Divider>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <TabLocaisServico 
                                        regiao={local.regiao}
                                        subprefeituras={local.subprefeitura}
                                        distrito={local.distrito}
                                        unidade={local.unidade}
                                    />

                                    <BotoesTab 
                                        editar={(e) => { handleClickEditar(e, local); }}
                                        excluir={() => { handleClickExcluir(local.id); }}
                                    />
                                </Box>
                            </Box>
                        </Fade>
                    )
                })
            }

            <FormLocais 
                formLocal={formLocal}
                //setFormLocal={setFormLocal}
                openFormLocal={openFormLocal}
                setOpenFormLocal={setOpenFormLocal}
                enviaLocal={enviaLocal}
                editaLocal={editaLocal}
                //carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                errors={errors}
                setErrors={setErrors}
                formId={formLocalId}
            />

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar local"
            />

            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                formId={formLocalId}
                fnExcluir={excluiLocal}
                //fnEditar={editaLocal}
                carregando={carregando}
                texto="regionalização"
            />
        </Box>
    );
}

export default ListaLocais;