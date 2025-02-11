import { Box, MenuItem, TextField } from "@mui/material"
import SubprefeituraInput from "../SubprefeituraInput";
import DistritoInput from "../DistritoInput";
import { useState } from "react";

export default function FormRegionalizacao({
    numContrato,
    acao,
    dados={},
    formId,
    onSubmit,
    setOpen
}) {

    const [errors, setErrors] = useState({})
    const [regiao, setRegiao] = useState(dados.regiao);
    const [subpref, setSubpref] = useState(
        !!dados?.subprefeitura 
            ? dados?.subprefeitura.map( entry => entry.subprefeitura_id) 
            : (dados?.subprefeitura_id ?? []) 
    )

    const handleChangeRegiao = (valor) => {
        setRegiao(valor);
        setSubpref([])
    }

    return(
        <Box
            component="form"
            id={formId}
            className='grid gap-4 mt-4'
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                formData.append("contrato_id", numContrato)
                acao === 'Enviar' 
                    ? onSubmit({formData},{
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    }) 
                    : onSubmit({formData, id: dados.id}, {
                        onSuccess: () => setOpen(false),
                        onError: (res) => setErrors(res.errors)
                    })
            }}>


            <TextField
                select
                label="Região"
                value={regiao}
                onChange={(e) => { handleChangeRegiao(e.target.value); }}
                name="regiao"
                id="regiao"
                fullWidth
                error={errors?.hasOwnProperty('regiao')}
                helperText={errors?.regiao ?? ""}
            >
                <MenuItem value={"CO"}>Centro-Oeste</MenuItem>
                <MenuItem value={"L"}>Leste</MenuItem>
                <MenuItem value={"N"}>Norte</MenuItem>
                <MenuItem value={"S"}>Sul</MenuItem>
            </TextField>

            <SubprefeituraInput 
                regiao={regiao} 
                selectedSub={subpref} 
                onChange={ (value) => setSubpref( typeof value === 'string' ? value.split(',') : value) }
                error={errors?.hasOwnProperty('subprefeitura')}
                helperText={errors?.subprefeitura ?? ""}
            />

            <DistritoInput 
                subpref={subpref} 
                defaultValue={dados?.distrito_id} 
                error={errors?.hasOwnProperty('distrito_id')}
                helperText={errors?.distrito_id ?? ""}
            />

            <TextField
                variant="outlined"
                defaultValue={dados.unidade}
                name="unidade"
                label="Unidade"
                error={errors?.hasOwnProperty('unidade')}
                helperText={errors?.unidade ?? ""}
                fullWidth
            />
        </Box>
    )
}