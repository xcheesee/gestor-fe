import { useState } from "react";
import { Box, MenuItem, TextField } from "@mui/material";
import CampoMasked from "../../CampoMasked";
import CampoValores from "../../CampoValores";
import { tipos_notas_reserva } from "../../../commom/utils/constants";
import { brlToFloat } from "../../../commom/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../../atomStore";
import { useErrorSnackbar } from "../../../commom/utils/hooks";

export function FormNotaReserva({
    formId,
    numContrato,
    dadosNota={},
    setOpen,
    setCarregando,
    acao,
    onSubmit
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
                    : onSubmit({formData, id: dadosNota?.id}, {
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    })
            }}
        >
            <CampoMasked
                mask="#####"
                name="numero_nota_reserva"
                label="Numero da Nota de Reserva"
                defaultValue={dadosNota?.numero_nota_reserva} 
                error={errors?.hasOwnProperty('numero_nota_reserva')}
                helperText={errors?.numero_nota_reserva ?? ""}
            />

            <TextField
                type="date"
                name="data_emissao"
                label="Data de Emissão"
                InputLabelProps={{
                    shrink: true
                }}
                defaultValue={dadosNota?.data_emissao}
                error={errors?.hasOwnProperty('data_emissao')}
                helperText={errors?.data_emissao ?? ""}
            />
            <TextField
                select
                name="tipo_nota"
                label="Tipo de Nota"
                defaultValue={dadosNota?.tipo_nota}
                error={errors?.hasOwnProperty('tipo_nota')}
                helperText={errors?.tipo_nota ?? ""}
            >
                {Object.entries(tipos_notas_reserva).map((tipo_nota, i) => (
                    <MenuItem value={tipo_nota[0]} key={`tipo-nota-${i}`} >{tipo_nota[1]}</MenuItem>
                ))} 
            </TextField>

            <CampoValores 
                name="valor"
                label="Valor da Nota de Reserva"
                defaultValue={dadosNota?.valor}
                prefix="R$ "
                error={errors?.hasOwnProperty('valor')}
                helperText={errors?.valor ?? ""}
            />
        </Box>
    )
}