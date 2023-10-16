import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import FormGestaoFiscalizacao from './FormGestaoFiscalizacao';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import { throwableDeleteForm, throwableGetData, throwablePostForm, throwablePutForm } from '../../commom/utils/api';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import { TabValues } from '../../commom/utils/utils';
import { fiscLabels } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorSnackbar } from '../../commom/utils/hooks';

const TabFiscalizacao = (props) => {
    return <TabValues entry={props} labels={fiscLabels} label="fiscalizacao "/>;
}

const ListaFiscalizacoes = ({ numContrato }) => {

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()
    const queryClient = useQueryClient()
    const formFiscalizacaoId = "fisc_form"

    const handleClickConfirmar = () => {
        if (openFormFiscalizacao.acao === 'adicionar') {
            enviaFiscalizacao();
        } else if (openFormFiscalizacao.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formFiscalizacao.id
            });
        }
    }
    
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
    const [errors, setErrors] = useState({});

    const fiscalizacoes = useQuery({
        queryKey: ['fiscalizacoes', numContrato],
        queryFn: () => throwableGetData({path: `gestaofiscalizacoes`, contratoId: numContrato}),
        onError: (res) => {
            errorSnackbar.Get(res)
            //setSnackbar({
            //    open: true,
            //    message: <div>Nao foi possivel recuperar fiscalização<br/>Erro: {res.message}</div>,
            //    severity: 'error',
            //    color: 'error'
            //})
            return []
        }
    })

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiFiscalizacao = async (id) => {
        setCarregando(true);
        try {
            await throwableDeleteForm({id, path:'gestaofiscalizacao'})
            setOpenConfirmacao({ open: false, id: ''});
            setCarregando(false);
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Gestão/fiscalização excluída com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries({queryKey: ['fiscalizacoes', numContrato]})
        } catch(e) {
            errorSnackbar.Delete(e)
            //setSnackbar({
            //    open: true,
            //    severity: 'error',
            //    message: 
            //        <div>
            //            Não foi possível excluir.
            //            <br/>
            //            Erro: {e.message}
            //            <br/>
            //            {e.errors
            //                ?Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
            //                :<></>
            //            }
            //        </div>,
            //    color: 'error'
            //});
        }
        setCarregando(false);
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

    const editaFiscalizacao = async (id, formFiscalizacaoEdit) => {
        setCarregando(true);
        try{
            await throwablePutForm({id, form: formFiscalizacaoEdit, path: 'gestaofiscalizacao'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Gestão/fiscalização editada com sucesso!',
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
            queryClient.invalidateQueries({queryKey: ['fiscalizacoes', numContrato]})
        } catch(e) {
            errorSnackbar.Put(e)
            //setSnackbar({
            //    open: true,
            //    severity: 'error',
            //    message: 
            //        <div>
            //            Não foi possível excluir.
            //            <br/>
            //            Erro: {e.message}
            //            <br/>
            //            {e.errors
            //                ?Object.values(e.errors).map( (erro, i) => (<div key={`erro-${i}`}>{erro}</div>))
            //                :<></>
            //            }
            //        </div>,
            //    color: 'error'
            //});
        }
        setCarregando(false);
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

    const enviaFiscalizacao = async (formFisc) => {
        setCarregando(true);

        try {
            await throwablePostForm({form: formFisc, path: "gestaofiscalizacao"})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Gestão/fiscalização enviada com sucesso!',
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
            queryClient.invalidateQueries({queryKey: ['fiscalizacoes', numContrato]})
        } catch(e) {
            errorSnackbar.Post(e)
            //setSnackbar({
            //    open: true,
            //    severity: 'error',
            //    message: <div>Não foi possível enviar a gestão/fiscalização<br/>Erro {e.message}</div>,
            //    color: 'error'
            //});
            if(e.status === 422) { setErrors(e.errors); }
        }

        setCarregando(false);
    }

    return (
        <Box>
            {fiscalizacoes.isLoading
                ?<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                        <CircularProgress size={30} />
                    </Box>
                :fiscalizacoes?.data?.data?.map((fiscalizacao, index) => {
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
                                />

                                <BotoesTab 
                                    excluir={(e) => { handleClickExcluir(fiscalizacao.id); }}
                                    editar={(e) => { handleClickEditar(e, fiscalizacao, fiscalizacao.id); }}
                                />
                            </Box>
                        </Box>
                    </Fade>
                ); })
            }

            <Dialog open={openFormFiscalizacao.open} fullWidth>
                <DialogTitle>
                    {openFormFiscalizacao.acao === 'adicionar'
                        ? "Nova gestão/fiscalização"
                        : "Editar gestão/fiscalização"
                    }
                </DialogTitle>
                <DialogContent>
                    <FormGestaoFiscalizacao 
                        formFiscalizacao={formFiscalizacao}
                        enviaFiscalizacao={enviaFiscalizacao}
                        editaFiscalizacao={editaFiscalizacao}
                        openFormFiscalizacao={openFormFiscalizacao}
                        errors={errors}
                        setErrors={setErrors}
                        formId={formFiscalizacaoId}
                    />
                </DialogContent>
                <DialogActions sx={{ margin: '1rem' }}>
                    <Button
                        onClick={() => { setOpenFormFiscalizacao({ ...openFormFiscalizacao, open: false }); }}
                        sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                    >
                        <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                    </Button>
                    <Button
                        sx={{ textTransform: 'none' }}
                        variant="contained"
                        onClick={handleClickConfirmar}
                        type={openFormFiscalizacao.acao === 'adicionar' ? "submit" : ""}
                        form={openFormFiscalizacao.acao === 'adicionar' ? "fisc_form" : ""}
                    >
                        {carregando
                            ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                            : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" />
                        }
            
                        {openFormFiscalizacao.acao === 'adicionar'
                            ? "Enviar"
                            : "Editar"
                        }
                    </Button>
                </DialogActions>
            </Dialog>

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar gestão/fiscalização"
            />

            <DialogConfirmacao 
                openConfirmacao={openConfirmacao}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                formId={formFiscalizacaoId}
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