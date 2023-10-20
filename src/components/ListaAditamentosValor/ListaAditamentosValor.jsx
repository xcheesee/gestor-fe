import React, { useState } from "react";
import { 
    Box, 
    Divider, 
    Paper,
    CircularProgress,
    Fade
} from "@mui/material";
import DialogConfirmacao from "../DialogConfirmacao";
import BotoesTab from "../BotoesTab";
import BotaoAdicionar from "../BotaoAdicionar";
import FormAditamentoValor from "./FomAditamentoValor/FormAditamentoValor";
import { formataData, formataValores, TabValues } from "../../commom/utils/utils";
import { throwableDeleteForm, throwableGetData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import { aditValorLabels } from "../../commom/utils/constants";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorSnackbar } from "../../commom/utils/hooks";

function TabAditamentosValor (props) {
    const valores = {
        ...props,
        valor_aditamento: formataValores(props.valor_aditamento),
        data: formataData(props.data),
        percentual: `${props.percentual}%`
    }

    return <TabValues entry={valores} labels={aditValorLabels} label='aditamento_val' />
}

function ListaAditamentosValor ({ numContrato }) {
    const aditamentoValFormId = "aditamento_val_form"
    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormAditamentos, setOpenFormAditamentos] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formAditamentos, setFormAditamentos] = useState({
        contrato_id: numContrato,
        tipo_aditamento: '',
        valor_aditamento: '',
        percentual: ''
    });
    const [errors, setErrors] = useState({});

    const aditamentos_valor = useQuery({
        queryKey: ['aditamentos_val', numContrato],
        queryFn: async () => await throwableGetData({path: 'aditamentos_valor', contratoId: numContrato}),
        onError: (res) => {
            setSnackbar({
                open: true,
                message: <div>Nao foi possivel recuperar os aditamentos de valor<br/>Erro: {res.message}</div>,
                severity: 'error',
                color: 'error'
            })
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

    const excluiAditamento = async (id) => {
        setCarregando(true);                                                                                                                                                                                                                                            
        try {
            await throwableDeleteForm({id, path: 'aditamento_valor'})
            setOpenConfirmacao({ open: false, id: '' })
            setCarregando(false);
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Aditamento excluído com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries({queryKey: ['aditamentos_val', numContrato]})
        } catch(e) {
            errorSnackbar.Delete(e)
        }
        setCarregando(false);
    }

    const handleClickEditar = (e, aditamento) => {
      setFormAditamentos({
          id: aditamento.id,
          contrato_id: aditamento.contrato_id,
          tipo_aditamento: aditamento.tipo_aditamento,
          valor_aditamento: aditamento.valor_aditamento,
          percentual: aditamento.percentual
      });
      setOpenFormAditamentos({
          open: true,
          acao: 'editar'
      });
      setAcao('editar');
    }

    const editaAditamento = async (id, formAditamentoEdit) => {
        setCarregando(true);
        try{
            await throwablePutForm({id, form: formAditamentoEdit, path: 'aditamento_valor'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Aditamento editado com sucesso!',
                color: 'success'
            });
            setOpenFormAditamentos({
                open: false,
                acao: 'adicionar'
            });
            setFormAditamentos({
                ...formAditamentos,
                tipo_aditamento: '',
                valor_aditamento: '',
                percentual: ''
            });
            queryClient.invalidateQueries({queryKey: ['aditamentos_val', numContrato]})
        } catch(e) {
            errorSnackbar.Put(e)
        }
        setCarregando(false);
    }

    const handleClickAdicionar = () => {
      setOpenFormAditamentos({
          open: true,
          acao: 'adicionar'
      });
      setFormAditamentos({
          contrato_id: numContrato,
          tipo_aditamento: '',
          valor_aditamento: '',
          percentual: ''
      });
    }

    const enviaAditamento = async (form) => {
        setCarregando(true);
        try {
            await throwablePostForm({form, path: 'aditamento_valor'})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Aditamento enviado com sucesso!',
                color: 'success'
            });
            setOpenFormAditamentos({ 
                open: false, 
                acao: 'adicionar' 
            });
            setFormAditamentos({
                ...formAditamentos,
                tipo_aditamento: '',
                valor_aditamento: '',
                percentual: ''
            });
            queryClient.invalidateQueries({queryKey: ['aditamentos_val', numContrato]})
        } catch(e) {
            errorSnackbar.Post(e)
            if(e.status === 422) {setErrors(e.errors)}
        }
        setCarregando(false);
    }

  return (
    <Box>
        {aditamentos_valor.isLoading
            ?<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                <CircularProgress size={30} />
            </Box>
            :aditamentos_valor?.data?.data?.map((aditamento, index) => {
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
                                Aditamento # {aditamento.id}
                            </Divider>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TabAditamentosValor 
                                    tipo_aditamento={aditamento.tipo_aditamento}
                                    valor_aditamento={aditamento.valor_aditamento}
                                    percentual={aditamento.percentual}
                                    data={aditamento.data_aditamento}
                                />

                                <BotoesTab 
                                    editar={(e) => { handleClickEditar(e, aditamento, aditamento.id); }}
                                    excluir={() => { handleClickExcluir(aditamento.id); }}
                                />
                            </Box>
                        </Box>
                    </Fade>
                );
            })}

            <FormAditamentoValor
                formAditamento={formAditamentos}
                setFormAditamento={setFormAditamentos}
                openFormAditamento={openFormAditamentos} 
                setOpenFormAditamento={setOpenFormAditamentos} 
                enviaAditamento={enviaAditamento}
                editaAditamento={editaAditamento}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
                errors={errors}
                setErrors={setErrors}
                formId={aditamentoValFormId}
            />

            <BotaoAdicionar 
                fnAdicionar={handleClickAdicionar}
                texto="Adicionar aditamento"
            />

            <DialogConfirmacao
                openConfirmacao={openConfirmacao} 
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                formId={aditamentoValFormId}
                fnExcluir={excluiAditamento}
                fnEditar={editaAditamento}
                formInterno={formAditamentos}
                carregando={carregando}
                texto="aditamento"
            />
        </Box>
    );
}

export default ListaAditamentosValor;
