import React, { useState, useEffect } from 'react';
import {
    Box,
    Divider,
    Paper,
    Typography,
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import FormDotacoes from './FormDotacoes';
import FormRecursos from './FormRecursos';
import DialogConfirmacao from '../DialogConfirmacao';

const retornaNumDotacao = (numero_dotacao, descricao) => {
    return [`${numero_dotacao}\n${descricao}`];
}

const TabDotacoes = (props) => {
    const campos = [
        "Número dotação",
        "Valor",
    ];

    const valores = [
        retornaNumDotacao(props.numero_dotacao, props.descricao),
        props.formataValores(props.valor_dotacao),
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaDotacoes = (props) => {
    const {
        dotacoes,
        estaCarregado,
        formataValores,
        retornaCampoValor,
        numContrato,
        tipoDotacoes,
        origemRecursos,
        setSnackbar
    } = props;

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
        contrato_id: numContrato,
        valor_dotacao: '',
        origem_recurso_id: '',
        outros_descricao: '',
    });
    const [formRecurso, setFormRecurso] = useState({
        dotacao_id: '',
        origem_recurso_id: '',
        outros_descricao: ''
    });
    let tipos_dotacao = [];

    useEffect(() => {
        tipoDotacoes.forEach(tipoDotacao => {
            tipos_dotacao.push({
                label: 
                    `${tipoDotacao.numero_dotacao} | ${tipoDotacao.descricao} | ${tipoDotacao.tipo_despesa}`,
                id: tipoDotacao.id
            });
        })
    });

    const handleClickExcluirRecurso = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
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
                    setOpenConfirmacao({ open: false, id: '' });
                    setCarregando(false);
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        text: 'Fonte de recurso excluída com sucesso',
                        color: 'success'
                    });
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

    

    const handleClickAdicionarDotacao = () => {
        setOpenFormDotacao({
            open: true,
            acao: 'adicionar'
        });
        setAcao('adicionar');
    }

    const enviaDotacao = (form) => {
        const url = `${process.env.REACT_APP_API_URL}/dotacao`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        };

        setCarregando(true);

        fetch(url, options)
        .then(res => {
            if (res.ok) {
                setCarregando(false);
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
                    contrato_id: numContrato,
                    valor_dotacao: '',
                    origem_recurso_id: '',
                    outros_descricao: '',
                });
                return res.json();
            } else if (res.status === 422) {
                setCarregando(false);
                setSnackbar({
                    open: true,
                    severity: 'error',
                    text: `Erro ${res.status} - Não foi possível enviar a dotação`,
                    color: 'error'
                });
                return res.json()
                .then(data => setErrors(data.errors));
            } else {
                setCarregando(false);
                setSnackbar({
                    open: true,
                    severity: 'error',
                    text: `Erro ${res.status} - Não foi possível enviar a dotação`,
                    color: 'error'
                });
            }
        });
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

    const enviaRecurso = (form) => {
        const url = `${process.env.REACT_APP_API_URL}/dotacao_recurso`;
        const token = localStorage.getItem('access_token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        };

        setCarregando(true);

        fetch(url, options)
        .then(res => {
            if (res.ok) {
                setCarregando(false);
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
                return res.json();
            } else if (res.status === 422) {
                setCarregando(false);
                setSnackbar({
                    open: true,
                    severity: 'error',
                    text: `Erro ${res.status} - Não foi possível enviar a fonte de recurso`,
                    color: 'error'
                });
                return res.json()
                .then(data => setErrors(data.errors));
            } else {
                setCarregando(false);
                setSnackbar({
                    open: true,
                    severity: 'error',
                    text: `Erro ${res.status} - Não foi possível enviar a fonte de recurso`,
                    color: 'error'
                });
            }
        });
    }

    return (
        <Box>
            {dotacoes.map((dotacao, index) => {
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
                            Dotação # {dotacao.id}
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ width: '50%' }}>
                                <TabDotacoes 
                                    retornaCampoValor={retornaCampoValor}
                                    estaCarregado={estaCarregado}
                                    formataValores={formataValores}
                                    numero_dotacao={dotacao.numero_dotacao}
                                    descricao={dotacao.descricao}
                                    valor_dotacao={dotacao.valor_dotacao}
                                    recursos={dotacao.recursos}
                                />
                            </Box>

                            <BotoesTab />
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
                                border: '1px solid #cdcdcd', 
                                borderRadius: '3px',
                                background: '#f8faf8'
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
                                                border: '1px solid #cdcdcd', 
                                                borderRadius: '3px',
                                                margin: '1rem',
                                                mb: '0',
                                                padding: '0.5rem',
                                                boxSizing: 'border-box',
                                                background: '#fff'
                                            }}
                                            key={index}
                                        >
                                            <Typography sx={{ margin: '0.5rem' }}>
                                                {
                                                    recurso.nome !== null && recurso.nome !== "Outros"
                                                    ? recurso.nome
                                                    : recurso.outros_descricao
                                                }
                                            </Typography>

                                            <BotoesTab 
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
                );
            })}
            
            <FormDotacoes 
                carregando={carregando}
                openFormDotacao={openFormDotacao}
                setOpenFormDotacao={setOpenFormDotacao}
                errors={errors}
                setErrors={setErrors}
                formDotacao={formDotacao}
                setFormDotacao={setFormDotacao}
                numContrato={numContrato}
                tipos_dotacao={tipos_dotacao}
                origemRecursos={origemRecursos}
                enviaDotacao={enviaDotacao}
            />

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
            />

            <BotaoAdicionar
                fnAdicionar={handleClickAdicionarDotacao}
                texto="Adicionar dotação"
            />

            <DialogConfirmacao 
                openConfirmacao={openConfirmacao}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                fnExcluir={
                    openConfirmacao.elemento === 'dotacao'
                    ? () => {}
                    : excluiRecurso
                }
                fnEditar={
                    openConfirmacao.elemento === 'dotacao'
                    ? () => {}
                    : () => {}
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