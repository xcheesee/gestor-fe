import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getFormData } from "../../commom/utils/api";
import { reajusteLabels } from "../../commom/utils/constants";
import { TabValues, formataData, formataValores } from "../../commom/utils/utils";
import ListaCardElement from "../ListaCardElement";
import FormPostReajustes from "./Forms/postReajustes";
import FormEditReajustes from "./Forms/editReajustes";

const TabReajuste = (props) => {
    const valores = {
        valor_reajuste: formataValores(props.valor_reajuste),
        indice_reajuste: props.indice_reajuste,
        data_reajuste: formataData(props.data_reajuste),
    };

    return <TabValues entry={valores} labels={reajusteLabels} label="reajuste" />
}

export default function ListaReajustes ({ numContrato }) {
    const formId = 'reajuste-form'

    const dadosReajuste = useQuery({
        queryKey: ['reajuste', numContrato], 
        queryFn: () => getFormData(`reajustes/${numContrato}`)
    })

    const [carregando, setCarregando] = useState(false)

    if(dadosReajuste?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

    return (
        <ListaCardElement
            formId={formId}
            dadosArr={dadosReajuste}
            carregando={carregando}
            deleteProps={{
                deletePath: 'reajuste',
                queryKeys: ['reajuste'],
                setCarregando: setCarregando
            }}
            tipo_lista="Reajuste"
            TabDados={TabReajuste}
            renderEdit={(reajuste, setOpenModal) => 
                <FormEditReajustes
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    dados={reajuste}
                    setCarregando={setCarregando}
                />
            }
            renderPost={(setOpenModal) => 
                <FormPostReajustes
                    setOpen={setOpenModal}
                    formId={formId}
                    numContrato={numContrato}
                    setCarregando={setCarregando}
                />
            }
        />
    )
}