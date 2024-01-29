import { Box, Divider, Fade, Paper } from "@mui/material";
import { useState } from "react";
import BotaoAdicionar from "../BotaoAdicionar";
import FormDialog from "../FormDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { throwableDeleteForm, throwableGetData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import { liquidacaoLabels, meses } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores } from "../../commom/utils/utils";
import BotoesTab from "../BotoesTab";
import DialogDelete from "../DialogDelete";
import { useErrorSnackbar } from "../../commom/utils/hooks";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";
import { FormEditDevolucao } from "./Forms/editDevolucao";
import { FormPostDevolucao } from "./Forms/postDevolucao";


const TabDevolucoes = (props) => {
    const valores = {
        numero_nota_liquidacao: props.numero_nota_liquidacao,
        data_pagamento: formataData(props.data_pagamento),
        ano_referencia: props.ano_referencia,
        mes_referencia: meses[props.mes_referencia],
        valor: formataValores(props.valor),
    };

    return <TabValues entry={valores} labels={liquidacaoLabels} label="reserva" />
}

export default function ListaDevolucoes({
    numContrato
}) {
    const setSnackbar = useSetAtom(snackbarAtom)

    const queryClient = useQueryClient()
    const devolucoes = useQuery({
        queryFn: () => throwableGetData({path: '', contratoId: numContrato}),
        queryKey: ['devolucoes']
    })

    const [openPostForm, setOpenPostForm] = useState(false)
    const [editForm, setEditForm] = useState({
        open: false,
        id: '',
        dados: {}
    })
    const [openConfirmar, setOpenConfirmar] = useState(false)
    const [openDelete, setOpenDelete] = useState({
        open: false,
        id: ''
    })
    const errorSnackbar = useErrorSnackbar()

    const formId = "devolucoes-form"

    const postMutation = useMutation({
        mutationFn: (formData) => throwablePostForm({form:formData, path:''}),
        onSuccess: (res) => {
            setOpenPostForm(false)
            queryClient.invalidateQueries({queryKey: ['devolucoes']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Devolucao enviada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Post(res)
        }
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form:formData, path:'', id}),
        onSuccess: (res) => {
            setEditForm(prev => ({...prev, open: false}))
            queryClient.invalidateQueries({queryKey: ['devolucoes']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Devolucao editada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Put(res)
        }
    })

    const deleteMutation = useMutation({
        mutationFn: ({id}) => throwableDeleteForm({id: id, path: ''}),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['devolucoes'])
            setOpenDelete(prev => ({...prev, open: false}))
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Devolucao excluida.", color: "success"}))
        },
        onError: (res) => {
            errorSnackbar.Delete(res)
        }
    })

    return(
        <>
        <Box>
            {devolucoes?.data?.data?.map( (devolucao, i) => {
                return (
                    <Fade in={true} timeout={400} key={`devolucao-${i}`}>
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
                                Devolucao # {devolucao.id}
                            </Divider>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TabDevolucoes  {...devolucao} />
                                <BotoesTab 
                                    editar={(e) => setEditForm({
                                        open: true,
                                        id: devolucao.id,
                                        dados: devolucao
                                    })}
                                    excluir={() => setOpenDelete({
                                        open: true,
                                        id: devolucao.id
                                    })}
                                />
                            </Box>
                        </Box>
                    </Fade>
                )
            }) }
            <BotaoAdicionar
                fnAdicionar={() => setOpenPostForm(true)}
            />
        </Box>


        <FormDialog
            open={openPostForm}
            setOpen={setOpenPostForm}
            acao="Enviar"
            onClick={() => setOpenConfirmar(true)}
            tipoForm="Devolução"
            openConfirmar={openConfirmar}
            setOpenConfirmar={setOpenConfirmar}
            formId={formId}
            carregando={postMutation.isLoading}
        >
            <FormPostDevolucao 
                setOpen={setOpenPostForm}
                formId={formId}
                numContrato={numContrato}
                postMutation={postMutation}
            />
        </FormDialog>

        <FormDialog
            open={editForm.open}
            setOpen={(bool) => setEditForm(prev => ({...prev, open: bool}))}
            acao="Editar"
            onClick={() => setOpenConfirmar(true)}
            tipoForm="Devolução"
            openConfirmar={openConfirmar}
            setOpenConfirmar={setOpenConfirmar}
            formId={formId}
            carregando={editMutation.isLoading}
        >
            <FormEditDevolucao 
                setOpen={(bool) => setEditForm(prev => ({...prev, open: bool}))}
                formId={formId}
                numContrato={numContrato}
                dados={editForm.dados}
                editMutation={editMutation}
            />
        </FormDialog>

        <DialogDelete 
            open={openDelete.open}
            id={openDelete.id}
            setOpen={(bool) => setOpenDelete(prev => ({...prev, open: bool}))}
            tipo_op="devolucao"
            fnDelete={(id) => deleteMutation.mutate({id: id})}
            carregando={deleteMutation.isLoading}
        />

        </>
    )
}