import CampoData from "../../CampoData"
import { termoRecebimentoLabels } from "../../../commom/utils/constants"
import { Box } from "@mui/material"

export default function FormTermoRecebimento({
    formId,
    defaultValue={},
    submitFn
}) {
    return(
        <Box
            component="form"
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                submitFn({formData})
            }}
            className="flex flex-col gap-4 py-2"
        >
            <CampoData
                defaultValue={defaultValue?.termo_recebimento_provisorio ?? ""}
                label={termoRecebimentoLabels.termo_recebimento_provisorio}
            />

            <CampoData
                defaultValue={defaultValue?.termo_recebimento_definitivo ?? ""}
                label={termoRecebimentoLabels.termo_recebimento_definitivo}
            />
        </Box>
    )
}