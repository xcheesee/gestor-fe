import React, { useState } from 'react';
import {
    Box,
    Divider,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Fade,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import FormDotacoes from './FormDotacoes';
import FormRecursos from './FormRecursos';
import { getFormData, throwablePostForm, throwablePutForm } from '../../commom/utils/api';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TabValues } from '../../commom/utils/utils';
import { dotacoesLabels } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useErrorSnackbar } from '../../commom/utils/hooks';
//import DialogConf from '../DialogConf';
import DialogDelete from '../DialogDelete';
import DialogConf from '../DialogConf';

const retornaNumDotacao = (numero_dotacao, descricao) => {
    return (
        <>
            {numero_dotacao || <p className='text-neutral-500'>Não se Aplica</p>}
            <br/>
            {descricao || ""}
        </>
    )
}

const TabDotacoes = (props) => {
    const valores = {
        numero_dotacao: retornaNumDotacao(props.numero_dotacao, props.descricao)
    }

    return <TabValues entry={valores} labels={dotacoesLabels} label="dotacao"/>
}

const ListaDotacoes = ({ numContrato }) => {
    const dotacaoFormId = "dotacao_form"
    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const dotacoes = useQuery(['dotacoes', numContrato], {
        queryFn: () => getFormData(`dotacoes/${numContrato}`)
    })

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [errors, setErrors] = useState({});
    const [openFormDotacao, setOpenFormDotacao] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openFormRecurso, setOpenFormRecurso] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: '',
        elemento: 'Dotação',
        acao: ""
    });
    const [formDotacao, setFormDotacao] = useState({
        dotacao_tipo_id: '',
        origem_recurso_id: '',
        outros_descricao: '',
    });
    const [formRecurso, setFormRecurso] = useState({
        dotacao_id: '',
        origem_recurso_id: '',
        outros_descricao: ''
    });
    const [openDelete, setOpenDelete] = useState({
        open: false,
        id: '',
        tipo_op: '',
        path: '',
    })

    // exclusão
    const handleClickExcluirDotacao = (id) => {
        setOpenDelete({
            open: true,
            id: id,
            tipo_op: 'dotacao',
            path: 'dotacao'

        })
    }

    const handleClickExcluirRecurso = (id) => {
        setOpenDelete({
            open: true,
            id: id,
            tipo_op: "recurso",
            path: 'dotacao_recurso'
        })
    }

    // edição
    const handleClickEditarDotacao = (dotacao) => {
        setFormDotacao({
            id: dotacao.id,
            dotacao_tipo_id: dotacao.dotacao_tipo_id,
            contrato_id: dotacao.contrato_id,
            numero_dotacao: dotacao.numero_dotacao,
            tipo_despesa: dotacao.tipo_despesa,
            descricao: dotacao.descricao
        });
        setOpenFormDotacao({
            open: true,
            acao: 'editar'
        });
        setAcao('editar');
    }

    const editaDotacao = async (id, formDotacao) => {
        setCarregando(true);
        try{
            await throwablePutForm({id, form: formDotacao, path: "dotacao"})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Dotação editada com sucesso!',
            });
            setFormDotacao({
                ...formDotacao,
                dotacao_tipo_id: '',
                origem_recurso_id: '',
                outros_descricao: '',
            });
            setOpenFormDotacao({
                open: false,
                acao: 'adicionar',
                elemento: 'dotacao'
            });
            setErrors({})
            queryClient.invalidateQueries(['dotacoes', numContrato])

        } catch(e) {
            errorSnackbar.Put(e)
        }
        setCarregando(false);
    }

    const handleClickEditarRecurso = (recurso) => {
        setFormRecurso({
            id: recurso.id,
            dotacao_id: recurso.dotacao_id,
            dotacao_tipo_id: recurso.dotacao_tipo_id,
            origem_recurso_id: recurso.origem_recurso_id,
            outros_descricao: recurso.outros_descricao
        });
        setOpenFormRecurso({
            open: true,
            acao: 'editar'
        });
        setAcao('editar');
    }

    const editaRecurso = async (id, formRecurso) => {
        setCarregando(true);
        try {
            await throwablePutForm({id, form:formRecurso, path:"dotacao_recurso"})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Fonte de recurso editada com sucesso!',
            });
            setFormRecurso({
                ...formRecurso,
                dotacao_id: '',
                origem_recurso_id: '',
                outros_descricao: ''
            });
            setOpenFormRecurso({
                open: false,
                acao: 'adicionar',
                elemento: 'recurso'
            });
            setErrors({})
            queryClient.invalidateQueries(['dotacoes', numContrato])
        } catch(e) {
            errorSnackbar.Put(e)
        }
        setCarregando(false);
    }
    
    // adição
    const handleClickAdicionarDotacao = () => {
        setFormDotacao({
            dotacao_tipo_id: '',
            origem_recurso_id: '',
            outros_descricao: '',
        })
        setOpenFormDotacao({
            open: true,
            acao: 'adicionar'
        });
        setAcao('adicionar');
    }

    const enviaDotacao = async (form) => {
        setCarregando(true);
        try {
            await throwablePostForm({form, path: 'dotacao'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Dotação enviada com sucesso!',
            });
            setOpenFormDotacao({
                open: false,
                acao: 'adicionar'
            });
            setFormDotacao({
                ...formDotacao,
                dotacao_tipo_id: '',
                origem_recurso_id: '',
                outros_descricao: '',
            });
            setErrors({})
            queryClient.invalidateQueries(['dotacoes', numContrato])
        } catch(e) {
            errorSnackbar.Post(e)
            if(e.status === 422) {setErrors(e.errors)}
        }
        setCarregando(false);
    }

    const handleClickAdicionarRecurso = (id) => {
        setOpenFormRecurso({ 
            open: true,
            acao: 'adicionar'
        });
        setFormRecurso({
            ...formRecurso,
            dotacao_id: id,
            origem_recurso_id: ''
        });
        setAcao('adicionar');
    }

    const enviaRecurso = async (form) => {
        setCarregando(true);
        try {
            await throwablePostForm({ form, path: 'dotacao_recurso'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Fonte de recurso enviada com sucesso!',
            });
            setOpenFormRecurso({
                open: false,
                acao: 'adicionar'
            });
            setFormRecurso({
                ...formRecurso,
                dotacao_id: '',
                origem_recurso_id: '',
                outros_descricao: ''
            });
            setErrors({})
            queryClient.invalidateQueries(['dotacoes', numContrato])
        } catch(e) {
            errorSnackbar.Post(e)
            if(e.status === 422) {setErrors(e.errors)}
        }
        setCarregando(false);
    }

    if(dotacoes?.isLoading ) return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
            <CircularProgress size={30} />
        </Box>
    )

    return (
        <Box>
            {dotacoes?.data?.data?.map((dotacao, index) => {
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
                                Dotação # {dotacao.id}
                            </Divider>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '32px' }}>
                                <Box sx={{ width: '50%' }}>
                                    <TabDotacoes
                                        numero_dotacao={dotacao.numero_dotacao}
                                        descricao={dotacao.descricao}
                                        recursos={dotacao.recursos}
                                    />
                                </Box>

                                <BotoesTab 
                                    editar={() => handleClickEditarDotacao(dotacao)}
                                    excluir={() => handleClickExcluirDotacao(dotacao.id)}
                                />
                            </Box>
                            
                            <Typography 
                                sx={{ margin: '0 1rem' }} 
                                component="pre"
                            >
                                <strong>Fonte(s) de recurso</strong>
                            </Typography>
                            
                            <Box 
                                sx={{ 
                                    margin: '1rem', 
                                    padding: '0.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }} 
                            >    
                                {dotacao.recursos.length > 0
                                ? 
                                    dotacao.recursos.map((recurso, index) => {
                                        return (
                                            <Box 
                                                sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    margin: '0.5rem',
                                                    padding: '0.5rem',
                                                    boxSizing: 'border-box',
                                                    background: '#fff'
                                                }}
                                                component={Paper}
                                                key={index}
                                                elevation={3}
                                            >
                                                <Typography sx={{ margin: '0.5rem' }}>
                                                    {
                                                        recurso.nome !== null && recurso.nome !== "Outros"
                                                        ? recurso.nome
                                                        : recurso.outros_descricao
                                                    }
                                                </Typography>

                                                <BotoesTab 
                                                    editar={() => handleClickEditarRecurso(recurso)}
                                                    excluir={() => handleClickExcluirRecurso(recurso.id)}
                                                />

                                            </Box>
                                        );
                                    })
                                : 
                                    <Typography sx={{ margin: '0.5rem' }}>
                                        Não há fontes de recurso a serem exibidas.
                                    </Typography>
                                }

                                <Box sx={{ alignSelf: 'flex-end', mt: '1rem' }}>
                                    <Button 
                                        sx={{ textTransform: 'none' }}
                                        onClick={() => handleClickAdicionarRecurso(dotacao.id)}
                                    >
                                        <AddIcon
                                            sx={{ mr: '0.2rem' }}
                                        />
                                        Adicionar fonte
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                    );
                })
            }

            <Dialog open={openFormDotacao.open} fullWidth>
                <DialogTitle>
                    {openFormDotacao.acao === 'adicionar'
                        ? "Nova dotação"
                        : "Editar dotação"
                    }
                </DialogTitle>

                <DialogContent>
                    <FormDotacoes 
                        openFormDotacao={openFormDotacao}
                        errors={errors}
                        setErrors={setErrors}
                        formDotacao={formDotacao}
                        numContrato={numContrato}
                        enviaDotacao={enviaDotacao}
                        editaDotacao={editaDotacao}
                    />
                </DialogContent>

                <DialogActions sx={{ margin: '1rem' }}>
                    <Button
                        onClick={() => {
                            setOpenFormDotacao({ ...openFormDotacao, open: false });
                            setErrors({});
                        }}
                        sx={{ textTransform: 'none', mr: '1rem', color: (theme) => theme.palette.error.main }}
                    >
                        <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                    </Button>

                    <Button
                        sx={{ textTransform: 'none' }} 
                        variant="contained"
                        onClick={() => {
                            if (openFormDotacao.acao === 'editar') {
                                setOpenConfirmacao({
                                    open: true,
                                    id: formDotacao.id,
                                    elemento: 'Dotação',
                                    acao: "Editar"
                                });
                            }
                        }}
                        form={openFormDotacao.acao === 'adicionar' ? "dotacao_form" : ""}
                        type={openFormDotacao.acao === 'adicionar' ? "submit" : ""}
                    >
                        {carregando
                            ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                            : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                        }

                        {openFormDotacao.acao === 'adicionar'
                            ? "Enviar"
                            : "Editar"
                        }
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openFormRecurso.open} fullWidth>
                <DialogTitle>
                    {openFormRecurso.acao === 'adicionar'
                        ? "Nova fonte de recurso"
                        : "Editar fonte de recurso"
                    }
                </DialogTitle>

                <DialogContent>
                    <FormRecursos 
                        openFormRecurso={openFormRecurso}
                        errors={errors}
                        formRecurso={formRecurso}
                        enviaRecurso={enviaRecurso}
                        editaRecurso={editaRecurso}
                    />
                </DialogContent>

                <DialogActions sx={{ margin: '1rem' }}>
                    <Button
                        onClick={() => setOpenFormRecurso(prev => ({...prev, open: false})) }     
                        sx={{ textTransform: 'none', mr: '1rem', color: (theme) => theme.palette.error.main }}
                    >
                        <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                    </Button>

                    <Button
                        sx={{ textTransform: 'none' }} 
                        variant="contained"
                        onClick={() => {
                            if(openFormRecurso.acao === 'editar') {
                                setOpenConfirmacao({
                                    open: true,
                                    id: formRecurso.id,
                                    elemento: 'Fonte de Recurso',
                                    acao: "Editar"
                                })
                            }
                        }}
                        type={ openFormRecurso.acao === 'adicionar' ? "submit" : ""}
                        form={ openFormRecurso.acao === 'adicionar' ? "dotacao_form" : ""}
                    >
                        {carregando
                            ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                            : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                        }

                        {openFormRecurso.acao === 'adicionar'
                            ? "Enviar"
                            : "Editar"
                        }
                    </Button>
                </DialogActions>
            </Dialog>

            <BotaoAdicionar
                fnAdicionar={handleClickAdicionarDotacao}
                texto="Adicionar dotação"
            />

            <DialogDelete 
                open={openDelete.open}
                setOpen={(bool) => setOpenDelete(prev => ({...prev, open: bool}))}
                tipo_op={openDelete.tipo_op}
                id={openDelete.id}
                carregando={carregando}
                setCarregando={setCarregando}
                queryKeys={['dotacoes']}
                deletePath={openDelete.path}
            />

            <DialogConf 
                title={`${openConfirmacao.acao} ${openConfirmacao.elemento}`}
                body={<Typography>Deseja {openConfirmacao.acao} a {openConfirmacao.elemento}</Typography>}
                formId={dotacaoFormId}
                open={openConfirmacao.open}
                setOpen={setOpenConfirmacao}
                acao={openConfirmacao.acao}
            />
        </Box>
    );
}

export default ListaDotacoes;