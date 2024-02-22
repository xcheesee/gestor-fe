import { useState } from "react";
import { FormPostNotaLiquidacao } from "./Forms/postNotaLiquidacao";
import { useQuery } from "@tanstack/react-query";
import { throwableGetData } from "../../commom/utils/api";
import { liquidacaoLabels, meses } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores } from "../../commom/utils/utils";
import { FormEditNotaLiquidacao } from "./Forms/editNotaLiquidacao";
import ListaCardElement from "../ListaCardElement";
import { Box, CircularProgress } from "@mui/material";


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
    const notas = useQuery({
        queryFn: () => throwableGetData({path: 'notas_liquidacao', contratoId: numContrato}),
        queryKey: ['notas_liquidacao']
    })

    const [carregando, setCarregando] = useState(false)
    const formId = "notas-liquidacao-form"

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
                <FormEditNotaLiquidacao
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dados={notas}
                    setCarregando={setCarregando}
                />
            }
            renderPost={(setOpenModal) => 
                <FormPostNotaLiquidacao
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    setCarregando={setCarregando}
                />
            }
        />
    )
}