import { Autocomplete, CircularProgress, Menu, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getFormData } from "../../commom/utils/api";

export default function CampoEmpresa() {
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const openAnchor = Boolean(anchorEl)
    const empresaDados = useQuery({
        queryKey: ['empresas'],
        queryFn: () => getFormData("empresas"),
        enabled: open,
    })
    const loading = open && empresaDados.isLoading

    return(
        <>
            <Menu>
                
            </Menu>
            <Autocomplete
                id="id"
                getOptionLabel={(option) => option.nome}
                loading={loading}
                options={empresaDados?.data?.data ?? []}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        label="Empresa" 
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                            ),
                        }}
                />)}
            />
        </>
    )
}