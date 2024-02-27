import { useQuery } from "@tanstack/react-query"
import { getDistritos } from "../../../commom/utils/api"
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useEffect, useState } from "react"

export default function DistritoInput({
    subpref, 
    defaultValue,
    error=false,
    helperText
}) {
    const distritos = useQuery({
        queryKey: ['distritos', subpref],
        queryFn: () => getDistritos({subpref}),
        enabled: !!subpref
    })
    const [distrito, setDistrito] = useState(defaultValue)
    useEffect(() => {
        if(subpref.length === 0) {
            setDistrito()
        }
    }, [subpref])
    return(
            <FormControl 
                fullWidth
                disabled={!distritos?.data || distritos.isLoading || subpref.length === 0}
                className="relative"
            >
                <InputLabel id="dist" className="bg-white hover:px-2">Distrito</InputLabel>
                <Select
                    labelId="dist"
                    id='ditrito_id'
                    name="distrito_id"
                    value={distrito ?? ""}
                    onChange={(event) => setDistrito(event.target.value) }
                    //multiple
                    //value={selectedSubs}
                    //onChange={handleChange}
                    disabled={!distritos?.data || distritos.isLoading || subpref.length === 0}
                    error={error}
                    helperText={helperText}
                >
                    {distritos?.data
                        ?.map?.((distrito, i) => <MenuItem key={`dist-${i}`} value={distrito.id}>{distrito.nome}</MenuItem> )
                    }
                </Select>
                {distritos.isLoading && subpref.length !== 0
                    ? <CircularProgress size={24} className="absolute top-[30%] left-[90%]" />
                    : <></>
                }
            </FormControl>
    )
}