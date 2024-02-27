import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { throwableGetData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import { DevolucaoLabels } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores, mascaraDevolucao } from "../../commom/utils/utils";
import ListaCardElement from "../ListaCardElement";
import { Box, CircularProgress } from "@mui/material";
import { useErrorSnackbar } from "../../commom/utils/hooks";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";
import { FormDevolucao } from "./Forms/formDevolucao";


const TabDevolucoes = (props) => {
    const valores = {
        numero_devolucao: mascaraDevolucao(props.numero_devolucao),
        data_devolucao: formataData(props.data_devolucao),
        valor: formataValores(props.valor),
    };

    return <TabValues entry={valores} labels={DevolucaoLabels} label="devolucao" />
}

export default function ListaDevolucoes({
    numContrato
}) {
    const errorSnackbar = useErrorSnackbar()
    const queryClient = useQueryClient()
    const setSnackbar = useSetAtom(snackbarAtom)

    const devolucoes = useQuery({
        queryFn: () => throwableGetData({path: 'devolucoes', contratoId: numContrato}),
        queryKey: ['devolucoes']
    })

    const [carregando, setCarregando] = useState(false)

    const formId = "devolucoes-form"

    const postMutation = useMutation({
        mutationFn: ({formData}) => throwablePostForm({form:formData, path:'devolucao'}),
        onSuccess: (res) => {
            queryClient.invalidateQueries({queryKey: ['devolucoes']})
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Devolução enviada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Post(res)
        },
        onSettled: () => setCarregando(false)
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form:formData, path:'devolucao', id}),
        onSuccess: (res) => {
            queryClient.invalidateQueries({queryKey: ['devolucoes']})
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Devolução editada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Put(res)
        },
        onSettled: () => setCarregando(false)
    })

    if(devolucoes?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={devolucoes}
            carregando={carregando}
            deleteProps={{
                deletePath: 'devolucao',
                queryKeys: ['devolucoes', 'totalizadores'],
                setCarregando: setCarregando
            }}
            tipo_lista="Devolução"
            TabDados={TabDevolucoes}
            renderEdit={(devolucoes, setOpenModal) => 
                <FormDevolucao
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dados={devolucoes}
                    setCarregando={setCarregando}
                    acao="Editar"
                    onSubmit={editMutation.mutate}
                />
            }
            renderPost={(setOpenModal) => 
                <FormDevolucao
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    setCarregando={setCarregando}
                    acao="Enviar"
                    onSubmit={postMutation.mutate}
                />
            }
        />
    )
}