import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getSubprefeituras } from "../../../commom/utils/api";

export default function SubprefeituraInput({
    regiao, 
    selectedSub=null, 
    onChange=() => {},
    error=false,
    helperText
}) {
    const subprefeituras = useQuery({
        queryKey: ['subprefeituras', regiao],
        queryFn: () => getSubprefeituras({regiao}),
        enabled: !!regiao
    })

    function handleChange(event) {
        const { target: {value} } = event
        onChange(value)
    }
    return(
            <FormControl 
                fullWidth
                disabled={!subprefeituras || subprefeituras.isLoading}
                className="relative"
            >
                <InputLabel id="subpref" className="bg-white hover:px-2">Subprefeitura(s)</InputLabel>
                <Select
                    labelId="subpref"
                    id='subprefeitura_id'
                    name="subprefeitura_id"
                    multiple
                    value={selectedSub}
                    onChange={handleChange}
                    disabled={!subprefeituras || subprefeituras.isLoading}
                    error={error}
                    helperText={helperText}
                >
                    {subprefeituras?.data
                        ?.map?.((subprefeitura, i) => <MenuItem key={`sub-${i}`} value={subprefeitura.id}>{subprefeitura.nome}</MenuItem> )
                    }
                </Select>
                {subprefeituras.isLoading && !!regiao
                    ? <CircularProgress size={24} className="absolute top-[30%] left-[90%]" />
                    : <></>
                }
            </FormControl>
    )
}