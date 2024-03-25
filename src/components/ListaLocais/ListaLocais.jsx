import React, { useState } from 'react';
import { 
    Box,
    CircularProgress,
} from '@mui/material';
import { throwableGetData, throwablePostForm, throwablePutForm } from '../../commom/utils/api';
import { TabValues } from '../../commom/utils/utils';
import { locaisLabels } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorSnackbar } from '../../commom/utils/hooks';
import ListaCardElement from '../ListaCardElement';
import FormRegionalizacao from './Forms/formRegionalizacao';


const TabLocaisServico = (props) => {
    const dicionarioRegioes = {
        "CO": "Centro-Oeste",
        "L": "Leste",
        "N": "Norte",
        "S": "Sul"
    }

    const valores = {
        regiao: dicionarioRegioes[props.regiao],
        subprefeituras: props?.subprefeitura?.length !== 0 
            ? props?.subprefeitura?.map( (entry,i) => <div key={`locais-i-${i}`}>{entry.subprefeitura.nome}</div>) 
            : "---"
        ,
        distrito: props?.distrito,
        unidade: props?.unidade
    }

    return <TabValues entry={valores} labels={locaisLabels} label='locais' />
}

const ListaLocais = ({ numContrato }) => {

    const formId = "local_form"
    const queryClient = useQueryClient()

    const locais = useQuery({
        queryKey: ['locaisContrato', numContrato],
        queryFn: async () => await throwableGetData({path: 'servicoslocais', contratoId: numContrato}),
        onError: (res) => {
            errorSnackbar.Get(res)
            return []
        }
    })

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const [carregando, setCarregando] = useState(false);
    const [errors, setErrors] = useState({});

    const postMutation = useMutation({
        mutationFn: ({formData}) => throwablePostForm({form: formData, path: 'servicolocal'}),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Regionalização enviado com sucesso!',
            });
            queryClient.invalidateQueries({queryKey: ['locaisContrato', numContrato]})
        },
        onError: (res) => {
            errorSnackbar.Post(res)
        },
        onSettled: () => setCarregando(false)
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form: formData, id: id, path: 'servicolocal'}),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Regionalização editada com sucesso!',
            });
            queryClient.invalidateQueries({queryKey: ['locaisContrato', numContrato]})
        },
        onError: (res) => {
            errorSnackbar.Put(res)
        },
        onSettled: () => setCarregando(false)

    })

    if(locais?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={locais}
            carregando={carregando}
            deleteProps={{
                deletePath: 'servicolocal',
                queryKeys: ['locaisContrato'],
                setCarregando: setCarregando
            }}
            tipo_lista="Regionalização"
            TabDados={TabLocaisServico}
            renderEdit={(locais, setOpenModal) => 
                <FormRegionalizacao
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
                <FormRegionalizacao
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

export default ListaLocais;