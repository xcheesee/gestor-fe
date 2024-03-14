import { Box, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { throwableGetData } from "../../../commom/utils/api";

export default function CampoRecurso({
    formRecurso={},
    errors
}) {

    const origemRecursos = useQuery({
        queryKey: ['origemRecursos'],
        queryFn: async () => await throwableGetData({path: 'origem_recursos'})
    })

    const [dadosRecurso, setDadosRecurso] = useState(formRecurso?.origem_recurso_id ?? "")
    const [outros, setOutros] = useState(formRecurso?.outros_descricao ?? "")

    const outrosDesc = dadosRecurso === 999 ?? false;

    if(origemRecursos.isLoading) return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
            <CircularProgress size={30} />
        </Box>
    )

    return(

        <>
        <FormControl
            sx={{ margin: '1rem 0', position: 'relative' }}
            error={errors.hasOwnProperty('origem_recurso_id')}
            fullWidth
        >
            <InputLabel id="dotacao_recurso-label">Fonte de recurso</InputLabel>

            <Select
                labelId="dotacao_recurso-label"
                id="origem_recurso_id"
                label="Fonte de recurso"
                value={dadosRecurso}
                name="origem_recurso_id"
                onChange={(e) => {
                    setOutros("")
                    if (e.target.value !== 999) {
                        setDadosRecurso(e.target.value);
                    } else {
                        setDadosRecurso(999);
                    }
                }}
                fullWidth
            >
                {origemRecursos?.data?.data.map((origemRecurso, index) => {
                    return (
                        <MenuItem key={index} value={origemRecurso.id}>{origemRecurso.nome}</MenuItem>
                    );
                })}
            </Select>
            <FormHelperText>
                {
                    errors.hasOwnProperty('origem_recurso_id')
                    ? errors.origem_recurso_id
                    : " "
                }
            </FormHelperText>
        </FormControl>
        
        {outrosDesc
            ?
                <TextField 
                    variant="outlined"
                    value={outros}
                    name="outros_descricao"
                    onChange={(e) => {
                        setOutros(e.target.value);
                    }}
                    label="Descrição"
                    sx={{ margin: '1rem 0' }}
                    error={errors.hasOwnProperty('outros_descricao')}
                    helperText={
                        errors.hasOwnProperty('outros_descricao')
                        ? errors.outros_descricao 
                        : "Descreva brevemente a fonte de recurso"
                    }
                    fullWidth
                    required
                />
            :
                ""
        }
        </>
    )
}