import React, { useState } from 'react';
import { 
    Box,
    CircularProgress,
} from '@mui/material';
import FormCertidao from './Forms/formCertidao';
import { formataData, TabValues } from '../../commom/utils/utils';
import { 
    getCertidoes, 
    throwablePostForm, 
    throwablePutForm
} from '../../commom/utils/api';
import { certidaoLabels } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorSnackbar } from '../../commom/utils/hooks';
import ListaCardElement from '../ListaCardElement';

const TabCertidoes = (props) => {
    const valores = {
        certidoes: props.certidoes,
        validade_certidoes: formataData(props.validade_certidoes)
    }

    return <TabValues entry={valores} labels={certidaoLabels} label="certidao" />
}

const ListaCertidoes = ({ numContrato }) => {
    const formId = "certidao_form"
    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const [carregando, setCarregando] = useState(false);
    //const [errors, setErrors] = useState({});

    const certidoes = useQuery({
        queryKey: ['certidoes', numContrato],
        queryFn: () => getCertidoes({numContrato})
    })

    const postMutation = useMutation({
        mutationFn: ({formData}) => throwablePostForm({form: formData, path: 'certidao'}),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Certidão enviada com sucesso!',
            });
            queryClient.invalidateQueries({queryKey: ['certidoes', numContrato]})
        },
        onError: (res) => {
            errorSnackbar.Post(res)
        },
        onSettled: () => setCarregando(false)
    })

    const editMutation = useMutation({
        mutationFn: ({formData, id}) => throwablePutForm({form: formData, id: id, path: 'certidao'}),
        onMutate: () => setCarregando(true),
        onSuccess: () => {
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Certidão editada com sucesso!',
            });
            queryClient.invalidateQueries({queryKey: ['certidoes', numContrato]})
        },
        onError: (res) => {
            errorSnackbar.Put(res)
        },
        onSettled: () => setCarregando(false)

    })

    if(certidoes?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={certidoes}
            carregando={carregando}
            deleteProps={{
                deletePath: 'certidao',
                queryKeys: ['certidoes'],
                setCarregando: setCarregando
            }}
            tipo_lista="Certidão"
            TabDados={TabCertidoes}
            renderEdit={(dados, setOpenModal) => 
                <FormCertidao
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
                <FormCertidao
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

export default ListaCertidoes;