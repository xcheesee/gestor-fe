import { Autocomplete, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getFormData } from "../../commom/utils/api";

export default function CampoEmpresa() {
    const [open, setOpen] = useState(false)
    const empresaDados = useQuery({
        queryKey: ['empresas'],
        queryFn: () => getFormData("empresas"),
        enabled: open,
    })
    useEffect(() => {
        if(!open) return undefined;
    }, [open])
    return(
        <Autocomplete
            id="id"
            getOptionLabel={(option) => option.nome}
            loading={open && empresaDados.isLoading}
            options={empresaDados?.data?.data ?? []}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderInput={(params) => <TextField {...params} label="Empresa" /> }/>
    )
}