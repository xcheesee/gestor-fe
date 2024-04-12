import { Box, TextField } from "@mui/material";
import CampoMasked from "../../Inputs/CampoMasked";
import CampoValores from "../../Inputs/CampoValores";
import { brlToFloat } from "../../../commom/utils/utils";
import { useState } from "react";

export function FormDevolucao({
    formId,
    numContrato,
    dados,
    setOpen,
    setCarregando,
    onSubmit,
    acao
}) {
    const [errors, setErrors] = useState({})

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
            <CampoMasked
                mask="##.####"
                name="numero_devolucao"
                label="Numero de Devolução"
                defaultValue={dados?.numero_devolucao}
                error={errors?.hasOwnProperty('numero_devolucao')}
                helperText={errors?.numero_devolucao ?? ""}
            />

            <TextField
                type="date"
                name="data_devolucao"
                error={errors?.hasOwnProperty('data_devolucao')}
                helperText={errors?.data_devolucao ?? ""}
                label="Data de Devolução"
                defaultValue={dados?.data_devolucao ?? ""}
                InputLabelProps={{
                    shrink: true
                }}
            />

            <CampoValores 
                name="valor"
                error={errors?.hasOwnProperty('valor')}
                helperText={errors?.valor ?? ""}
                label="Valor da Devolução"
                defaultValue={dados?.valor ?? ""}
                prefix="R$ "
            />
        </Box>
    )
}