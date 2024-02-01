import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { FormPostNotaReserva } from "./Forms/postNotaReserva";
import { useQuery } from "@tanstack/react-query";
import { throwableGetData } from "../../commom/utils/api";
import { reservaLabels, tipos_notas_reserva } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores } from "../../commom/utils/utils";
import { FormEditNotaReserva } from "./Forms/editNotaReserva";
import ListaCardElement from "../ListaCardElement";

const TabNotaReserva = (props) => {
    const valores = {
        numero_nota_reserva: props.numero_nota_reserva,
        tipo_nota: tipos_notas_reserva[props.tipo_nota],
        data_emissao: formataData(props.data_emissao),
        valor: formataValores(props.valor),
    };

    return <TabValues entry={valores} labels={reservaLabels} label="reserva" />
}

export default function ListaNotasReserva({
    numContrato
}) {
    const [carregando, setCarregando] = useState(false)

    const formId = "notas-reserva-form"

    const notas = useQuery({
        queryFn: () => throwableGetData({path: 'notas_reserva', contratoId: numContrato}),
        queryKey: ['notas_reserva']
    })

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
                deletePath: 'nota_reserva',
                queryKey: 'notas_reserva',
                setCarregando: setCarregando
            }}
            tipo_lista="Nota de reserva"
            TabDados={TabNotaReserva}
            renderEdit={(notas, setOpenModal) => 
                <FormEditNotaReserva
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dadosNota={notas}
                    setCarregando={setCarregando}
                />
            }
            renderPost={(setOpenModal) => 
                <FormPostNotaReserva
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    setCarregando={setCarregando}
                />
            }
        />
    )
}