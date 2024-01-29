import { Box, CircularProgress, Divider, Fade, Paper } from "@mui/material";
import { useState } from "react";
import BotaoAdicionar from "../BotaoAdicionar";
import { FormPostNotaReserva } from "./Forms/postNotaReserva";
import FormDialog from "../FormDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { throwableDeleteForm, throwableGetData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import BotoesTab from "../BotoesTab";
import { reservaLabels, tipos_notas_reserva } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores } from "../../commom/utils/utils";
import DialogDelete from "../DialogDelete";
import { FormEditNotaReserva } from "./Forms/editNotaReserva";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";
import { useErrorSnackbar } from "../../commom/utils/hooks";

const TabNotaReserva = (props) => {
    const valores = {
        numero_nota_reserva: props.numero_nota_reserva,
        tipo_nota: tipos_notas_reserva[props.tipo_nota],
        data_emissao: formataData(props.data_emissao),
        valor: formataValores(props.valor),
    };

    return <TabValues entry={valores} labels={reservaLabels} label="reserva" />
}

export default function ListaNotasReserva({
    numContrato
}) {
    const setSnackbar = useSetAtom(snackbarAtom)
    const queryClient = useQueryClient()

    const [openPostForm, setOpenPostForm] = useState(false)
    const [editForm, setEditForm] = useState({
        open: false,
        id: "",
        dados: {}
    })
    const [openDelete, setOpenDelete] = useState({
        open: false,
        id: ""
    })
    const [openConfirmar, setOpenConfirmar] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const errorSnackbar = useErrorSnackbar()

    const formId = "notas-reserva-form"

    const notas = useQuery({
        queryFn: () => throwableGetData({path: 'notas_reserva', contratoId: numContrato}),
        queryKey: ['notas_reserva']
    })

    const postMutation = useMutation({
        mutationFn: (notaReserva) => throwablePostForm({form:notaReserva, path:'nota_reserva'}),
        onSuccess: (res) => {
            setOpenPostForm(false)
            queryClient.invalidateQueries({queryKey: ['notas_reserva']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Reserva enviada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Post(res)
        }
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form:formData, path:'nota_reserva', id: id}),
        onSuccess: (res) => {
            setEditForm(prev => ({...prev, open: false}))
            queryClient.invalidateQueries({queryKey: ['notas_reserva']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Reserva editada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Put(res)
        }
    })

    const deleteMutation = useMutation({
        mutationFn: ({id}) => throwableDeleteForm({id: id, path: 'nota_reserva'}),
        onSuccess: () => {
            setOpenDelete(prev => ({...prev, open: false}))
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Reserva excluida.", color: "success"}))
            setCarregando(false)
            queryClient.invalidateQueries(['notas_reserva'])

        },
        onError: (res) => {
            setCarregando(false)
            errorSnackbar.Delete(res)
        }
    })

    if(notas?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

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
                                <TabNotaReserva  {...nota} />
                                <BotoesTab 
                                    editar={(e) => { setEditForm({
                                        open: true,
                                        id: nota.id,
                                        dados: nota
                                    }) }}
                                    excluir={() => { setOpenDelete({
                                        open: true,
                                        id: nota.id
                                    }) }}
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
            tipoForm="Nota de Reserva"
            openConfirmar={openConfirmar}
            setOpenConfirmar={setOpenConfirmar}
            formId={formId}
            carregando={postMutation.isLoading}
        >
            <FormPostNotaReserva 
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
            tipoForm="Nota de Reserva"
            openConfirmar={openConfirmar}
            setOpenConfirmar={setOpenConfirmar}
            formId={formId}
            carregando={editMutation.isLoading}
        >
            <FormEditNotaReserva 
                setOpen={(bool) => setEditForm(prev => ({...prev, open: bool}))}
                formId={formId}
                numContrato={numContrato}
                dadosNota={editForm.dados}
                editMutation={editMutation}
            />
        </FormDialog>

        <DialogDelete 
            open={openDelete.open}
            setOpen={(bool) => setOpenDelete(prev => ({...prev, open: bool}))}
            tipo_op="nota de reserva"
            id={openDelete.id}
            carregando={deleteMutation.isLoading}
            fnDelete={(id) => {
                setCarregando(true)
                deleteMutation.mutate({id})
            }}
        />

        </>
    )
}