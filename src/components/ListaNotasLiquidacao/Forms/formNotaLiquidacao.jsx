import { Box, MenuItem, TextField } from "@mui/material";
import CampoMasked from "../../Inputs/CampoMasked";
import CampoValores from "../../Inputs/CampoValores";
import { useState } from "react";
import { meses } from "../../../commom/utils/constants";
import { brlToFloat } from "../../../commom/utils/utils";

export function FormNotaLiquidacao({
    formId,
    numContrato,
    dados={},
    setOpen,
    setCarregando,
    acao,
    onSubmit
}) {
    const [errors, setErrors] = useState({})
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
                acao === 'Enviar' 
                    ? onSubmit({formData},{
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    }) 
                    : onSubmit({formData, id: dados?.id}, {
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    })
            }}
        >
            <CampoMasked
                mask="#####"
                name="numero_nota_liquidacao"
                label="Numero da Nota de Liquidação"
                defaultValue={dados?.numero_nota_liquidacao}
                error={errors?.hasOwnProperty('numero_nota_liquidacao')}
                helperText={errors?.numero_nota_liquidacao ?? ""}
            />

            <TextField
                type="date"
                name="data_pagamento"
                error={errors?.hasOwnProperty('data_pagamento')}
                helperText={errors?.data_pagamento ?? ""}
                value={dataPagamento}
                onChange={(e) => {
                    const dataArr = e.target.value.split('-')
                    setDataPagamento(e.target.value)
                    setMesReferencia(+dataArr[1])
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
                error={errors?.hasOwnProperty('mes_referencia')}
                helperText={errors?.mes_referencia ?? ""}
                value={mesReferencia}
                onChange={(e) => setMesReferencia(e.target.value)}
            >
                {meses.map((mes, i) => {
                    return(
                        <MenuItem key={`mes-ref-${i+1}`} value={i+1} className=''>{mes}</MenuItem>
                    )
                })}
            </TextField>

            <CampoMasked
                label="Ano de Referência"
                fullWidth
                mask="####"
                value={anoReferencia}
                onChange={(e) => setAnoReferencia(e.target.value)}
                name="ano_referencia"
                error={errors?.hasOwnProperty('ano_referencia')}
                helperText={errors?.ano_referencia ?? ""}
            />

            <CampoValores 
                name="valor"
                error={errors?.hasOwnProperty('valor')}
                helperText={errors?.valor ?? ""}
                label="Valor da Nota de Liquidação"
                defaultValue={dados?.valor}
                prefix="R$ "
            />
        </Box>
    )
}