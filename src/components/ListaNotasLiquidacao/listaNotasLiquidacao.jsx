import { Box, Divider, Fade, Paper } from "@mui/material";
import { useState } from "react";
import BotaoAdicionar from "../BotaoAdicionar";
import { FormPostNotaLiquidacao } from "./Forms/postNotaLiquidacao";
import FormDialog from "../FormDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { throwableDeleteForm, throwableGetData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import { liquidacaoLabels, meses } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores } from "../../commom/utils/utils";
import BotoesTab from "../BotoesTab";
import DialogDelete from "../DialogDelete";
import { FormEditNotaLiquidacao } from "./Forms/editNotaLiquidacao";
import { useErrorSnackbar } from "../../commom/utils/hooks";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";


const TabNotaLiquidacao = (props) => {
    const valores = {
        numero_nota_liquidacao: props.numero_nota_liquidacao,
        data_pagamento: formataData(props.data_pagamento),
        ano_referencia: props.ano_referencia,
        mes_referencia: meses[props.mes_referencia],
        valor: formataValores(props.valor),
    };

    return <TabValues entry={valores} labels={liquidacaoLabels} label="reserva" />
}

export default function ListaNotasLiquidacao({
    numContrato
}) {
    const setSnackbar = useSetAtom(snackbarAtom)

    const queryClient = useQueryClient()
    const notas = useQuery({
        queryFn: () => throwableGetData({path: 'notas_liquidacao', contratoId: numContrato}),
        queryKey: ['notas_liquidacao']
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

    const formId = "notas-liquidacao-form"

    const postMutation = useMutation({
        mutationFn: (notaLiq) => throwablePostForm({form:notaLiq, path:'nota_liquidacao'}),
        onSuccess: (res) => {
            setOpenPostForm(false)
            queryClient.invalidateQueries({queryKey: ['notas_liquidacao']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Liquidação enviada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Post(res)
        }
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form:formData, path:'nota_liquidacao', id}),
        onSuccess: (res) => {
            setEditForm(prev => ({...prev, open: false}))
            queryClient.invalidateQueries({queryKey: ['notas_liquidacao']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Liquidação editada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Put(res)
        }
    })

    const deleteMutation = useMutation({
        mutationFn: ({id}) => throwableDeleteForm({id: id, path: 'nota_liquidacao'}),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['notas_liquidacao'])
            setOpenDelete(prev => ({...prev, open: false}))
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Liquidação excluída.", color: "success"}))
        },
        onError: (res) => {
            errorSnackbar.Delete(res)
        }
    })

    return(
        <>
        <Box>
            {notas?.data?.data?.map( (nota,i) => {
                return (
                    <Fade in={true} timeout={400} key={`reserva-${i}`}>
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
                                Nota de Reserva # {nota.id}
                            </Divider>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TabNotaLiquidacao  {...nota} />
                                <BotoesTab 
                                    editar={(e) => setEditForm({
                                        open: true,
                                        id: nota.id,
                                        dados: nota
                                    })}
                                    excluir={() => setOpenDelete({
                                        open: true,
                                        id: nota.id
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
            tipoForm="Nota de Liquidação"
            openConfirmar={openConfirmar}
            setOpenConfirmar={setOpenConfirmar}
            formId={formId}
            carregando={postMutation.isLoading}
        >
            <FormPostNotaLiquidacao 
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
            tipoForm="Nota de Liquidação"
            openConfirmar={openConfirmar}
            setOpenConfirmar={setOpenConfirmar}
            formId={formId}
            carregando={editMutation.isLoading}
        >
            <FormEditNotaLiquidacao 
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
            tipo_op="nota de liquidação"
            fnDelete={(id) => deleteMutation.mutate({id: id})}
            carregando={deleteMutation.isLoading}
        />

        </>
    )
}