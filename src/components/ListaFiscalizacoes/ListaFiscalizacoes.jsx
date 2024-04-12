import React, { useState } from 'react';
import { 
    Box,
} from '@mui/material';
import { throwableGetData, throwablePostForm, throwablePutForm } from '../../commom/utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { TabValues } from '../../commom/utils/utils';
import { fiscLabels } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorSnackbar } from '../../commom/utils/hooks';
import ListaCardElement from '../ListaCardElement';
import FormFiscalizacoes from './Forms/formFiscalizacoes';

const TabFiscalizacao = (props) => {
    const values = {
        nome_gestor: props.nome_gestor,
        email_gestor: props.email_gestor,
        nome_fiscal: props.nome_fiscal,
        email_fiscal: props.email_fiscal,
        nome_suplente: props.nome_suplente,
        email_suplente: props.email_suplente
    }

    return <TabValues entry={values} labels={fiscLabels} label="fiscalizacao "/>;
}

const ListaFiscalizacoes = ({ numContrato }) => {

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()
    const queryClient = useQueryClient()
    const formId = "fisc_form"

    const [carregando, setCarregando] = useState(false);
    const [errors, setErrors] = useState({});

    const fiscalizacoes = useQuery({
        queryKey: ['fiscalizacoes', numContrato],
        queryFn: () => throwableGetData({path: `gestaofiscalizacoes`, contratoId: numContrato}),
        onError: (res) => {
            errorSnackbar.Get(res)
            return []
        }
    })

    const postMutation = useMutation({
        mutationFn: ({formData}) => throwablePostForm({form: formData, path: 'gestaofiscalizacao'}),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Fiscalização enviado com sucesso!',
            });
            queryClient.invalidateQueries({queryKey: ['fiscalizacoes', numContrato]})
        },
        onError: (res) => {
            errorSnackbar.Post(res)
        },
        onSettled: () => setCarregando(false)
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form: formData, id: id, path: 'gestaofiscalizacao'}),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Fiscalização editada com sucesso!',
            });
            queryClient.invalidateQueries({queryKey: ['fiscalizacoes', numContrato]})
        },
        onError: (res) => {
            errorSnackbar.Put(res)
        },
        onSettled: () => setCarregando(false)

    })

    if(fiscalizacoes?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={fiscalizacoes}
            carregando={carregando}
            deleteProps={{
                deletePath: 'gestaofiscalizacao',
                queryKeys: ['fiscalizacoes'],
                setCarregando: setCarregando
            }}
            tipo_lista="Fiscalização"
            TabDados={TabFiscalizacao}
            renderEdit={(dados, setOpenModal) => 
                <FormFiscalizacoes
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dados={dados}
                    setCarregando={setCarregando}
                    acao="Editar"
                    onSubmit={editMutation.mutate}
                />
            }
            renderPost={(setOpenModal) => 
                <FormFiscalizacoes
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

export default ListaFiscalizacoes;