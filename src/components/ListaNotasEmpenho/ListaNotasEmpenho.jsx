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
    throwableGetData, 
} from '../../commom/utils/api';
import { emprenhoLabels, meses } from '../../commom/utils/constants';
import { useQuery } from '@tanstack/react-query';
import FormPostNotaEmpenho from './FormNotaEmpenho/postNotaEmpenho';
import FormEditNotaEmpenho from './FormNotaEmpenho/editNotaEmpenho';
import ListaCardElement from '../ListaCardElement';

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
        mes_referencia: meses[props.mes_referencia],
    }

    return <TabValues entry={valores} labels={emprenhoLabels} label="empenho" />
}

const ListaNotasEmpenho = ({numContrato}) => {
    const formId = 'empenho_form'
    const [carregando, setCarregando] = useState(false);
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
                deletePath: 'empenho_nota',
                queryKeys: ['notasEmpenho', 'totalizadores', 'mesesExecutados'],
                setCarregando: setCarregando
            }}
            tipo_lista="Nota de Empenho"
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