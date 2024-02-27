import React, { useState } from 'react';
import { 
    Box,
    CircularProgress,
} from '@mui/material';
import { 
    formataData, 
    formataValores,  
    TabValues, 
} from '../../commom/utils/utils';
import { 
    throwableGetData, throwablePostForm, throwablePutForm, 
} from '../../commom/utils/api';
import { emprenhoLabels, meses } from '../../commom/utils/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ListaCardElement from '../ListaCardElement';
import { useErrorSnackbar } from '../../commom/utils/hooks';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import FormNotaEmpenho from './FormNotaEmpenho/FormNotaEmpenho';

const tipos_empenho = {
    cancelamento: "Cancelamento",
    complemento: "Complemento",
    novo_empenho: "Novo Empenho"
}

const TabNotasEmpenho = (props) => {
    const valores = {
        ...props,
        tipo_empenho: tipos_empenho[props.tipo_empenho],
        data_emissao: formataData(props.data_emissao),
        valor_empenho: formataValores(props.valor_empenho),
        ano_referencia: props.ano_referencia,
        mes_referencia: meses[props.mes_referencia-1],
    }

    return <TabValues entry={valores} labels={emprenhoLabels} label="empenho" />
}

const ListaNotasEmpenho = ({numContrato}) => {
    const formId = 'empenho_form'
    const queryClient = useQueryClient()
    const errorSnackbar = useErrorSnackbar()
    const setSnackbar = useSetAtom(snackbarAtom)

    const [carregando, setCarregando] = useState(false);

    const notasEmpenho = useQuery({
        queryKey: ['notasEmpenho', numContrato],
        queryFn: async () => await throwableGetData({path: 'empenho_notas', contratoId: numContrato})
    })

    const postMutation = useMutation({
        mutationFn: ({formData}) => throwablePostForm({form: formData, path: 'empenho_nota'}),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Nota de Empenho enviada com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries({queryKey: ['notasEmpenho', numContrato]})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
        },
        onError: (res) => errorSnackbar.Post(res),
        onSettled: () => setCarregando(false)
        
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({id: id, form: formData, path: 'empenho_nota'}),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Nota de Empenho editada com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries({queryKey: ['notasEmpenho', numContrato]})
            queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
            queryClient.invalidateQueries({queryKey: ['totalizadores']})
        },
        onError: (res) => errorSnackbar.Put(res),
        onSettled: () => setCarregando(false)
        
    })

    if(notasEmpenho?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={notasEmpenho}
            carregando={carregando}
            deleteProps={{
                deletePath: 'empenho_nota',
                queryKeys: ['notasEmpenho', 'totalizadores', 'mesesExecutados'],
                setCarregando: setCarregando
            }}
            tipo_lista="Nota de Empenho"
            TabDados={TabNotasEmpenho}
            renderEdit={(notas, setOpenModal) => 
                <FormNotaEmpenho
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
                <FormNotaEmpenho
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

export default ListaNotasEmpenho;