import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { throwableGetData } from "../../commom/utils/api";
import { DevolucaoLabels } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores, mascaraDevolucao } from "../../commom/utils/utils";
import { FormEditDevolucao } from "./Forms/editDevolucao";
import { FormPostDevolucao } from "./Forms/postDevolucao";
import ListaCardElement from "../ListaCardElement";
import { Box, CircularProgress } from "@mui/material";


const TabDevolucoes = (props) => {
    const valores = {
        numero_devolucao: mascaraDevolucao(props.numero_devolucao),
        data_devolucao: formataData(props.data_devolucao),
        valor: formataValores(props.valor),
    };

    return <TabValues entry={valores} labels={DevolucaoLabels} label="devolucao" />
}

export default function ListaDevolucoes({
    numContrato
}) {
    const devolucoes = useQuery({
        queryFn: () => throwableGetData({path: 'devolucoes', contratoId: numContrato}),
        queryKey: ['devolucoes']
    })
    const [carregando, setCarregando] = useState(false)

    const formId = "devolucoes-form"

    if(devolucoes?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={devolucoes}
            carregando={carregando}
            deleteProps={{
                deletePath: 'devolucao',
                queryKeys: ['devolucoes', 'totalizadores'],
                setCarregando: setCarregando
            }}
            tipo_lista="Devolução"
            TabDados={TabDevolucoes}
            renderEdit={(devolucoes, setOpenModal) => 
                <FormEditDevolucao
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dados={devolucoes}
                    setCarregando={setCarregando}
                />
            }
            renderPost={(setOpenModal) => 
                <FormPostDevolucao
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    setCarregando={setCarregando}
                />
            }
        />
    )
}