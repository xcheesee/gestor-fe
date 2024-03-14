import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { FormNotaReserva } from "./Forms/formNotaReserva";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { throwableGetData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import { reservaLabels, tipos_notas_reserva } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores } from "../../commom/utils/utils";
import { snackbarAtom } from "../../atomStore";
import { useErrorSnackbar } from "../../commom/utils/hooks";
import ListaCardElement from "../ListaCardElement";
import { useSetAtom } from "jotai";

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
    const queryClient = useQueryClient()
    const errorSnackbar = useErrorSnackbar()
    const setSnackbar = useSetAtom(snackbarAtom)

    const [carregando, setCarregando] = useState(false)

    const formId = "notas-reserva-form"

    const notas = useQuery({
        queryFn: () => throwableGetData({path: 'notas_reserva', contratoId: numContrato}),
        queryKey: ['notas_reserva']
    })

    const postMutation = useMutation({
        mutationFn: ({formData}) => throwablePostForm({form:formData, path: 'nota_reserva'}),
        onMutate: () => setCarregando(true),
        onSuccess: (res) => {
            queryClient.invalidateQueries({queryKey: ['notas_reserva']})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Reserva enviada.", color: "success"}))
        },
        onError: (res) =>  {
            errorSnackbar.Post(res)
        },
        onSettled: () => setCarregando(false)
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form:formData, path:'nota_reserva', id: id}),
        onMutate: () => setCarregando(true),
        onSuccess: (res) => {
            queryClient.invalidateQueries({queryKey: ['notas_reserva']})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Reserva editada.", color: "success"}))
        },
        onError: (res) =>  errorSnackbar.Put(res),
        onSettled: () => setCarregando(false)
    })

    if(notas?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={notas}
            carregando={carregando}
            deleteProps={{
                deletePath: 'nota_reserva',
                queryKeys: ['notas_reserva', 'totalizadores', 'mesesExecutados'],
                setCarregando: setCarregando
            }}
            tipo_lista="Nota de reserva"
            TabDados={TabNotaReserva}
            renderEdit={(notas, setOpenModal) => 
                <FormNotaReserva
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dadosNota={notas}
                    setCarregando={setCarregando}
                    acao="Editar"
                    onSubmit={editMutation.mutate}
                />
            }
            renderPost={(setOpenModal) => 
                <FormNotaReserva
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