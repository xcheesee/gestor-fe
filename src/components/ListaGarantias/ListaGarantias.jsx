import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper,
    CircularProgress,
    Fade
} from '@mui/material';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import FormGarantia from './Forms/formGarantia';
import { formataData, formataValores, TabValues } from '../../commom/utils/utils';
import { getGarantias, throwableDeleteForm, throwablePostForm, throwablePutForm } from '../../commom/utils/api';
import { garantiaLabels } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorSnackbar } from '../../commom/utils/hooks';
import ListaCardElement from '../ListaCardElement';

const TabGarantias = (props) => {
    const valores = {
        //...props,
        instituicao_financeira: props.instituicao_financeira,
        numero_documento: props.numero_documento,
        valor_garantia: formataValores(props.valor_garantia),
        data_validade_garantia: formataData(props.data_validade_garantia),
    };

    return <TabValues entry={valores} labels={garantiaLabels} label="garantia" />
}

const ListaGarantias = ({ numContrato }) => {

    const formId = 'garantia-form'

    const queryClient = useQueryClient()
    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const [carregando, setCarregando] = useState(false);
    const [errors, setErrors] = useState({});

    const garantias = useQuery({
        queryFn: async () => await getGarantias({numContrato}),
        queryKey: ['garantias', numContrato] 
    })

    const postMutation = useMutation({
        mutationFn: ({formData}) => throwablePostForm({form: formData, path: 'garantia'}),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Garantia enviada com sucesso!',
            });
            queryClient.invalidateQueries({queryKey: ['garantias', numContrato]})
        },
        onError: (res) => {
            errorSnackbar.Post(res)
        },
        onSettled: () => setCarregando(false)
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form: formData, id: id, path: 'garantia'}),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Garantia editada com sucesso!',
            });
            queryClient.invalidateQueries({queryKey: ['garantias', numContrato]})
        },
        onError: (res) => {
            errorSnackbar.Put(res)
        },
        onSettled: () => setCarregando(false)

    })

    if(garantias?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={garantias}
            carregando={carregando}
            deleteProps={{
                deletePath: 'garantia',
                queryKeys: ['garantias'],
                setCarregando: setCarregando
            }}
            tipo_lista="Garantia"
            TabDados={TabGarantias}
            renderEdit={(locais, setOpenModal) => 
                <FormGarantia
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dados={locais}
                    setCarregando={setCarregando}
                    acao="Editar"
                    onSubmit={editMutation.mutate}
                />
            }
            renderPost={(setOpenModal) => 
                <FormGarantia
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

export default ListaGarantias;