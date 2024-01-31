import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper,
    CircularProgress,
    Fade,
    Dialog
} from '@mui/material';
import FormNotaEmpenho from './FormNotaEmpenho';
import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import { 
    formataData, 
    formataValores,  
    TabValues, 
    primeiraLetraMaiuscula 
} from '../../commom/utils/utils';
import { 
    throwableDeleteForm, 
    throwableGetData, 
    throwablePostForm, 
    throwablePutForm 
} from '../../commom/utils/api';
import { emprenhoLabels, meses } from '../../commom/utils/constants';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../atomStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorSnackbar } from '../../commom/utils/hooks';
import FormPostNotaEmpenho from './FormNotaEmpenho/postNotaEmpenho';
import FormEditNotaEmpenho from './FormNotaEmpenho/editNotaEmpenho';
import ListaCardElement from '../ListaCardElement';

const TabNotasEmpenho = (props) => {
    const valores = {
        ...props,
        data_emissao: formataData(props.data_emissao),
        valor_empenho: formataValores(props.valor_empenho),
        mes_referencia: meses[props.mes_referencia]
    }

    return <TabValues entry={valores} labels={emprenhoLabels} label="empenho" />
}

const ListaNotasEmpenho = ({numContrato}) => {
    const formId = 'empenho_form'
    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormNotaEmpenho, setOpenFormNotaEmpenho] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formNotaEmpenho, setFormNotaEmpenho] = useState({
        contrato_id: numContrato,
        tipo_empenho: '',
        data_emissao: '',
        numero_nota: '',
        valor_empenho: ''
    });
    const [errors, setErrors] = useState({});

    const notasEmpenho = useQuery({
        queryKey: ['notasEmpenho', numContrato],
        queryFn: async () => await throwableGetData({path: 'empenho_notas', contratoId: numContrato})
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
                deletePath: 'nota_liquidacao',
                queryKey: 'notas_liquidacao',
                setCarregando: setCarregando
            }}
            tipo_lista="Nota de liquidação"
            TabDados={TabNotasEmpenho}
            renderEdit={(notas, setOpenModal) => 
                <FormEditNotaEmpenho
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dados={notas}
                    setCarregando={setCarregando}
                />
            }
            renderPost={(setOpenModal) => 
                <FormPostNotaEmpenho
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    setCarregando={setCarregando}
                />
            }
        />
    )
}

export default ListaNotasEmpenho;