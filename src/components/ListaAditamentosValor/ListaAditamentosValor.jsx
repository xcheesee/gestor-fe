import React, { useState } from "react";
import FormAditamentoValor from "./Forms";
import { formataData, formataValores, TabValues } from "../../commom/utils/utils";
import { throwableGetData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import { aditValorLabels } from "../../commom/utils/constants";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorSnackbar } from "../../commom/utils/hooks";
import ListaCardElement from "../ListaCardElement";
import { Box, CircularProgress } from "@mui/material";

function TabAditamentosValor (props) {
    const valores = {
        tipo_aditamento: props.tipo_aditamento,
        data: formataData(props.data_aditamento),
        valor_aditamento: formataValores(props.valor_aditamento),
        percentual: `${props.percentual}%`
    }

    return <TabValues entry={valores} labels={aditValorLabels} label='aditamento_val' />
}

function ListaAditamentosValor ({ numContrato }) {
    const formId = "aditamento_val_form"
    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)
   const errorSnackbar = useErrorSnackbar()

    const [carregando, setCarregando] = useState(false);
    //const [errors, setErrors] = useState({});

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

    const postMutation = useMutation({
        mutationFn: ({formData}) => throwablePostForm({form: formData, path: "aditamento_valor"}),
        onMutate: () => { setCarregando(true) },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['aditamentos_val', numContrato]})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Aditamento enviado com sucesso!',
                color: 'success'
            });

        },
        onError: (res) => { errorSnackbar.Post(res) },
        onSettled: () => { setCarregando(false) }
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form: formData, path: "aditamento_valor", id: id}),
        onMutate: () => { setCarregando(true) },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['aditamentos_val', numContrato]})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Aditamento editado com sucesso!',
                color: 'success'
            });
        },
        onError: (res) => { errorSnackbar.Put(res) },
        onSettled: () => { setCarregando(false) }
    })

    if(aditamentos_valor?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={aditamentos_valor}
            carregando={carregando}
            deleteProps={{
                deletePath: 'aditamento_valor',
                queryKey: 'aditamentos_val',
                setCarregando: setCarregando
            }}
            tipo_lista="Aditamento"
            TabDados={TabAditamentosValor}
            renderEdit={(adit, setOpenModal) => 
                <FormAditamentoValor
                    setOpen={setOpenModal}
                    acao="Editar"
                    formId={formId}
                    numContrato={numContrato}
                    dados={adit}
                    setCarregando={setCarregando}
                    onSubmit={editMutation.mutate}
                />
            }
            renderPost={(setOpenModal) => 
                <FormAditamentoValor
                    setOpen={setOpenModal}
                    acao="Enviar"
                    formId={formId}
                    numContrato={numContrato}
                    setCarregando={setCarregando}
                    onSubmit={postMutation.mutate}
                />
            }
        />
    )
}

export default ListaAditamentosValor;
