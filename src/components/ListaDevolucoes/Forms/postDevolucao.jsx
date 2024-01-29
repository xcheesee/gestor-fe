import { Box, TextField } from "@mui/material";
import CampoMasked from "../../CampoMasked";
import CampoValores from "../../CampoValores";
import { brlToFloat } from "../../../commom/utils/utils";

export function FormPostDevolucao({
    formId,
    numContrato,
    postMutation,
}) {

    return(
        <Box
            className="grid gap-4 py-2"
            component="form"
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const val = formData.get('valor')
                const formatted = brlToFloat(val)
                formData.set('valor', formatted)
                formData.append('contrato_id', numContrato)
                postMutation.mutate({formData})
            }}
        >
            <CampoMasked
                mask="##.####"
                name="numero_devolucao"
                label="Numero de Devolução"
            />

            <TextField
                type="date"
                name="data_devolucao"
                label="Data de Devolução"
                InputLabelProps={{
                    shrink: true
                }}
            />

            <CampoValores 
                name="valor"
                label="Valor da Devolução"
                prefix="R$ "
            />
        </Box>
    )
}