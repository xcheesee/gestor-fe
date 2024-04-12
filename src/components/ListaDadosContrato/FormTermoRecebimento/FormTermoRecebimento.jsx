import CampoData from "../../Inputs/CampoData"
import { termoRecebimentoLabels } from "../../../commom/utils/constants"
import { Box } from "@mui/material"

export default function FormTermoRecebimento({
    formId,
    submitFn,
    dados={},
    errors={},
}) {
    return(
        <Box
            component="form"
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                formData.append('processo_sei', dados?.processo_sei)
                formData.append('departamento_id', dados?.departamento_id)
                submitFn({formData})
            }}
            className="flex flex-col gap-4 py-2"
        >
            <CampoData
                defaultValue={dados?.termo_recebimento_provisorio ?? ""}
                label={termoRecebimentoLabels.termo_recebimento_provisorio}
                name="termo_recebimento_provisorio"
                helperText={errors?.termo_recebimento_provisorio ?? " "}
                error={errors.hasOwnProperty('termo_recebimento_provisorio')}
            />

            <CampoData
                defaultValue={dados?.termo_recebimento_definitivo ?? ""}
                label={termoRecebimentoLabels.termo_recebimento_definitivo}
                name="termo_recebimento_definitivo"
                helperText={errors?.termo_recebimento_definitivo ?? " "}
                error={errors.hasOwnProperty('termo_recebimento_definitivo')}
            />
        </Box>
    )
}