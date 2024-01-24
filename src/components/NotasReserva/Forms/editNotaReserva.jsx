import { Box, MenuItem, TextField } from "@mui/material";
import CampoMasked from "../../CampoMasked";
import CampoValores from "../../CampoValores";
import { tipos_notas_reserva } from "../../../commom/utils/constants";
import { brlToFloat } from "../../../commom/utils/utils";

export function FormEditNotaReserva({
    formId,
    numContrato,
    dadosNota,
    editMutation
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
                editMutation.mutate({formData, id: dadosNota.id})
            }}
        >
            <CampoMasked
                mask="####"
                name="numero_nota_reserva"
                label="Numero da Nota de Reserva"
                defaultValue={dadosNota.numero_nota_reserva} 
            />

            <TextField
                type="date"
                name="data_emissao"
                label="Data de Emissão"
                InputLabelProps={{
                    shrink: true
                }}
                defaultValue={dadosNota.data_emissao}
            />
            <TextField
                select
                name="tipo_nota"
                label="Tipo de Nota"
                defaultValue={dadosNota.tipo_nota}
            >
                {Object.entries(tipos_notas_reserva).map((tipo_nota, i) => (
                    <MenuItem value={tipo_nota[0]} key={`tipo-nota-${i}`} >{tipo_nota[1]}</MenuItem>
                ))} 
            </TextField>
            <CampoValores 
                name="valor"
                label="Valor da Nota de Reserva"
                defaultValue={dadosNota.valor}
                prefix="R$ "
            />
        </Box>
    )
}