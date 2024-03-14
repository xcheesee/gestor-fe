import { Box, CircularProgress } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getFormData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import { reajusteLabels } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores } from "../../commom/utils/utils";
import ListaCardElement from "../ListaCardElement";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";
import { useErrorSnackbar } from "../../commom/utils/hooks";
import FormReajustes from "./Forms/formReajustes";

const TabReajuste = (props) => {
    const valores = {
        valor_reajuste: formataValores(props.valor_reajuste),
        indice_reajuste: props.indice_reajuste,
        data_reajuste: formataData(props.data_reajuste),
    };

    return <TabValues entry={valores} labels={reajusteLabels} label="reajuste" />
}

export default function ListaReajustes ({ numContrato }) {
    const formId = 'reajuste-form'

    const setSnackbar = useSetAtom(snackbarAtom)
    const queryClient = useQueryClient()
    const errorSnackbar = useErrorSnackbar()

    const [carregando, setCarregando] = useState(false)

    const dadosReajuste = useQuery({
        queryKey: ['reajuste', numContrato], 
        queryFn: () => getFormData(`reajustes/${numContrato}`)
    })

    const putMutation = useMutation({
        mutationFn: async ({id, formData}) => await throwablePutForm({id, form:formData, path:"reajuste"}), 
        onMutate: () => setCarregando(true),
        onSuccess: async (res) => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Reajuste editado com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries(['reajuste'])
            queryClient.invalidateQueries(['mesesExecutados'])
        },
        onSettled: () => setCarregando(false)
    })

    const postMutation = useMutation({
        mutationFn: async ({formData}) => {
                return await throwablePostForm({form:formData, path: 'reajuste'})
        }, 
        onMutate: () => setCarregando(true),
        onSuccess: async (res) => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Reajuste criado com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries(['reajuste', numContrato])
            queryClient.invalidateQueries(['mesesExecutados'])
        },
        onError: async (res) => {
            errorSnackbar.Post(res)
        },
        onSettled: () => setCarregando(false)
    })


    if(dadosReajuste?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={dadosReajuste}
            carregando={carregando}
            deleteProps={{
                deletePath: 'reajuste',
                queryKeys: ['reajuste', 'mesesExecutados'],
                setCarregando: setCarregando
            }}
            tipo_lista="Reajuste"
            TabDados={TabReajuste}
            renderEdit={(reajuste, setOpenModal) => 
                <FormReajustes
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dados={reajuste}
                    setCarregando={setCarregando}
                    acao="Editar"
                    onSubmit={putMutation.mutate}
                />
            }
            renderPost={(setOpenModal) => 
                <FormReajustes
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