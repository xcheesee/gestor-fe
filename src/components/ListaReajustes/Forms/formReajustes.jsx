import { Box, TextField } from "@mui/material";
import CampoValores from "../../Inputs/CampoValores";
import CampoData from "../../Inputs/CampoData";
import { reajusteLabels } from "../../../commom/utils/constants";
import { brlToFloat } from "../../../commom/utils/utils";
import { useState } from "react";

export default function FormReajustes({
    dados,
    setOpen,
    formId,
    numContrato,
    onSubmit,
    acao
}) {
    const [errors, setErrors] = useState({})

    return(
        <Box
            className="grid gap-8 py-2"
            component="form"
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const val = formData.get('valor_reajuste')
                const formatted = brlToFloat(val)
                formData.set('valor_reajuste', formatted)
                formData.append('contrato_id', numContrato)
                acao === 'Enviar' 
                    ? onSubmit({formData},{
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    }) 
                    : onSubmit({formData, id: dados.id}, {
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    })
            }}
        >
            <CampoValores
                defaultValue={dados?.valor_reajuste}
                name="valor_reajuste"
                label={reajusteLabels.valor_reajuste}
                checaErros={() => {}}
                prefix="R$ "
                error={errors?.hasOwnProperty('valor_reajuste')}
                helperText={errors?.valor_reajuste ?? ""}
                fullWidth
            />

            <TextField
                variant="outlined"
                defaultValue={dados?.indice_reajuste}
                name="indice_reajuste"
                label={reajusteLabels.indice_reajuste}
                error={errors?.hasOwnProperty('indice_reajuste')}
                helperText={errors?.indice_reajuste ?? ""}
                fullWidth
            />

            <CampoData
                label="Data Reajuste"
                defaultValue={dados?.data_reajuste}
                name="data_reajuste"
                error={errors?.hasOwnProperty('data_reajuste')}
                helperText={errors?.data_reajuste ?? ""}
                fullWidth
            />
        </Box>
    )
}