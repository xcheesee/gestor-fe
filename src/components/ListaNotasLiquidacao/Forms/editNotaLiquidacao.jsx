import { Box, MenuItem, TextField } from "@mui/material";
import CampoMasked from "../../CampoMasked";
import CampoValores from "../../CampoValores";
import { useState } from "react";
import { meses } from "../../../commom/utils/constants";
import { brlToFloat } from "../../../commom/utils/utils";

export function FormEditNotaLiquidacao({
    formId,
    numContrato,
    dados,
    editMutation,
}) {

    const [dataPagamento, setDataPagamento] = useState(dados?.data_pagamento ?? "")
    const [mesReferencia, setMesReferencia] = useState(dados?.mes_referencia ?? "")
    const [anoReferencia, setAnoReferencia] = useState(dados?.ano_referencia ?? "")
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
                editMutation.mutate({formData, id: dados.id})
            }}
        >
            <CampoMasked
                mask="####"
                name="numero_nota_liquidacao"
                label="Numero da Nota de Liquidação"
                defaultValue={dados?.numero_nota_liquidacao}
            />

            <TextField
                type="date"
                name="data_pagamento"
                value={dataPagamento}
                onChange={(e) => {
                    const dataArr = e.target.value.split('-')
                    setDataPagamento(e.target.value)
                    setMesReferencia(+dataArr[1]-1)
                    setAnoReferencia(+dataArr[0])
                }}
                label="Data de Pagamento"
                InputLabelProps={{
                    shrink: true
                }}
            />

            <TextField
                select
                fullWidth
                label="Mês de Referência"
                name='mes_referencia'
                value={mesReferencia}
                onChange={(e) => {
                    setMesReferencia(e.target.value)
                }}
            >
                {meses.map((mes, i) => {
                    return(
                        <MenuItem key={`mes-ref-${i}`} value={i} className=''>{mes}</MenuItem>

                    )
                })}
            </TextField>

            <CampoMasked
                label="Ano de Referência"
                fullWidth
                mask="####"
                value={anoReferencia}
                onChange={(e) => {
                    setAnoReferencia(e.target.value)
                }}
                name="ano_referencia"
            />

            <CampoValores 
                name="valor"
                label="Valor da Nota de Liquidação"
                defaultValue={dados.valor}
                prefix="R$ "
            />
        </Box>
    )
}