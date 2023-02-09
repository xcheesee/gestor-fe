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
import DialogConfirmacao from '../DialogConfirmacao';
import { getFormData, postFormData, putFormData } from '../../commom/utils/api';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RetornaCampoValor } from '../../commom/utils/utils';

const retornaNumDotacao = (numero_dotacao, descricao) => {
    return [`${numero_dotacao}\n${descricao}`];
}

const TabDotacoes = (props) => {
    const campos = [
        "Número dotação",
    ];

    const valores = [
        retornaNumDotacao(props.numero_dotacao, props.descricao),
    ];

    return <RetornaCampoValor campos={campos} valores={valores} />
}

const ListaDotacoes = (props) => {
    const {
        numContrato,
        origemRecursos,
        setSnackbar
    } = props;

    const queryClient = useQueryClient()
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
        elemento: 'dotacao'
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

    // exclusão
    const handleClickExcluirDotacao = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id,
            elemento: 'dotacao'
        });
        setAcao('excluir');
    }

    const excluiDotacao = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/dotacao/${id}`;
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
                    setOpenConfirmacao({ open: false, id: '', elemento: 'dotacao' });
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Dotação excluída com sucesso',
                        color: 'success'
                    });
                    queryClient.invalidateQueries(['dotacoes', numContrato])
                    setErrors({})
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível excluir a dotação`,
                        color: 'error'
                    });
                }
            })
    }

    const handleClickExcluirRecurso = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id,
            elemento: 'recurso'
        });
        setAcao('excluir');
    }

    const excluiRecurso = (id) => {
        const url = `${process.env.REACT_APP_API_URL}/dotacao_recurso/${id}`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        setCarregando(true);

        fetch(url, options)
            .then(res => {
                if (res.ok) {
                    setOpenConfirmacao({ open: false, id: '', elemento: 'dotacao' });
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Fonte de recurso excluída com sucesso',
                        color: 'success'
                    });
                    setErrors({})
                    queryClient.invalidateQueries(['dotacoes', numContrato])
                    return res.json();
                } else {
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        text: `Erro ${res.status} - Não foi possível excluir a fonte de recurso`,
                        color: 'error'
                    });
                }
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
        const res = await putFormData(id, formDotacao, "dotacao")
        if (res.status === 200) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Dotação editada com sucesso!',
                color: 'success'
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
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível editar a dotação`,
                color: 'error'
            });
        }
        setCarregando(false);
        queryClient.invalidateQueries(['dotacoes', numContrato])
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
        const res = await putFormData(id, formRecurso, "dotacao_recurso")
        if (res.status === 200) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Fonte de recurso editada com sucesso!',
                color: 'success'
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
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível editar a fonte de recurso`,
                color: 'error'
            });
        }
        setCarregando(false);
        queryClient.invalidateQueries(['dotacoes', numContrato])
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
        const res = await postFormData(form, "dotacao")
        if (res.status === 201) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Dotação enviada com sucesso!',
                color: 'success'
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
        } else if (res.status === 422) {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar a dotação`,
                color: 'error'
            });
            setErrors(res.errors)
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar a dotação`,
                color: 'error'
            });
        }
        setCarregando(false);
        queryClient.invalidateQueries(['dotacoes', numContrato])
    }

    const handleClickAdicionarRecurso = (id) => {
        setOpenFormRecurso({ 
            open: true,
            acao: 'adicionar'
        });
        setFormRecurso({
            ...formRecurso,
            dotacao_id: id
        });
        setAcao('adicionar');
    }

    const enviaRecurso = async (form) => {
        setCarregando(true);
        const res = await postFormData(form, "dotacao_recurso")
        if (res.status === 201) {
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Fonte de recurso enviada com sucesso!',
                color: 'success'
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
        } else if (res.status === 422) {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar a fonte de recurso`,
                color: 'error'
            });
            setErrors(res.errors)
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível enviar a fonte de recurso`,
                color: 'error'
            });
        }
        setCarregando(false);
        queryClient.invalidateQueries(['dotacoes', numContrato])
    }

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

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                    background: '#f8faf8'
                                }} 
                                component={Paper}
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
            })}

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
                        formDotacao={formDotacao}
                        setFormDotacao={setFormDotacao}
                        numContrato={numContrato}
                        origemRecursos={origemRecursos}
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
                                    elemento: 'dotacao'
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

            <FormRecursos 
                openFormRecurso={openFormRecurso}
                setOpenFormRecurso={setOpenFormRecurso}
                carregando={carregando}
                errors={errors}
                setErrors={setErrors}
                formRecurso={formRecurso}
                setFormRecurso={setFormRecurso}
                origemRecursos={origemRecursos}
                enviaRecurso={enviaRecurso}
                editaRecurso={editaRecurso}
                setOpenConfirmacao={setOpenConfirmacao}
            />

            {
                dotacoes.isLoading
                ? 
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                        <CircularProgress size={30} />
                    </Box>
                : 
                    ""
            }

            <BotaoAdicionar
                fnAdicionar={handleClickAdicionarDotacao}
                texto="Adicionar dotação"
            />

            <DialogConfirmacao 
                openConfirmacao={openConfirmacao}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                form="dotacao_form"
                fnExcluir={
                    openConfirmacao.elemento === 'dotacao'
                    ? excluiDotacao
                    : excluiRecurso
                }
                fnEditar={
                    openConfirmacao.elemento === 'dotacao'
                    ? () => editaDotacao(formDotacao.id, formDotacao)
                    : () => editaRecurso(formRecurso.id, formRecurso)
                }
                formInterno={
                    openConfirmacao.elemento === 'dotacao'
                    ? formDotacao
                    : formRecurso
                }
                carregando={carregando}
                texto={
                    openConfirmacao.elemento === 'dotacao'
                    ? "dotação"
                    : "fonte de recurso"
                }
            />
        </Box>
    );
}

export default ListaDotacoes;