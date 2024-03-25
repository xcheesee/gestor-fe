import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { throwableGetData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import { liquidacaoLabels, meses } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores } from "../../commom/utils/utils";
import ListaCardElement from "../ListaCardElement";
import { Box, CircularProgress } from "@mui/material";
import { useErrorSnackbar } from "../../commom/utils/hooks";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";
import { FormNotaLiquidacao } from "./Forms/formNotaLiquidacao";


const TabNotaLiquidacao = (props) => {
    const valores = {
        numero_nota_liquidacao: props.numero_nota_liquidacao,
        data_pagamento: formataData(props.data_pagamento),
        ano_referencia: props.ano_referencia,
        mes_referencia: meses[props.mes_referencia-1],
        valor: formataValores(props.valor),
    };

    return <TabValues entry={valores} labels={liquidacaoLabels} label="reserva" />
}

export default function ListaNotasLiquidacao({
    numContrato
}) {
    const errorSnackbar = useErrorSnackbar()
    const queryClient = useQueryClient()
    const setSnackbar = useSetAtom(snackbarAtom)

    const notas = useQuery({
        queryFn: () => throwableGetData({path: 'notas_liquidacao', contratoId: numContrato}),
        queryKey: ['notas_liquidacao']
    })

    const [carregando, setCarregando] = useState(false)
    const formId = "notas-liquidacao-form"

    const postMutation = useMutation({
        mutationFn: ({formData}) => throwablePostForm({form:formData, path:'nota_liquidacao'}),
        onMutate: () => setCarregando(true),
        onSuccess: (res) => {
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
            queryClient.invalidateQueries({queryKey: ['notas_liquidacao']})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Liquidação enviada."}))
        },
        onError: (res) =>  {
            errorSnackbar.Post(res)
        },
        onSettled: () => setCarregando(false)
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form:formData, path:'nota_liquidacao', id}),
        onMutate: () => setCarregando(true),
        onSuccess: (res) => {
            queryClient.invalidateQueries({queryKey: ['notas_liquidacao']})
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Nota de Liquidação editada."}))
        },
        onError: (res) =>  {
            errorSnackbar.Put(res)
        },
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
                deletePath: 'nota_liquidacao',
                queryKeys: ['notas_liquidacao', 'totalizadores', 'mesesExecutados'],
                setCarregando: setCarregando
            }}
            tipo_lista="Nota de liquidação"
            TabDados={TabNotaLiquidacao}
            renderEdit={(notas, setOpenModal) => 
                <FormNotaLiquidacao
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dados={notas}
                    setCarregando={setCarregando}
                    acao="Editar"
                    onSubmit={editMutation.mutate}
                />
            }
            renderPost={(setOpenModal) => 
                <FormNotaLiquidacao
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