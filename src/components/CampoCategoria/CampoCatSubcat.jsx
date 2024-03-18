import { Box, CircularProgress, MenuItem, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { throwableGetData } from "../../commom/utils/api";
import { useState } from "react";
import LoadingInput from "../LoadingInput/loadingInput";
import { contratoLabels } from "../../commom/utils/constants";

export default function CampoCatSubcat({
    errors={},
    defaultValue={}
}) {
    const [selectedCategoria, setSelectedCategoria] = useState(defaultValue?.categoria ?? "")
    const [selectedSubcat, setSelectedSubcat] = useState(defaultValue?.subcategoria ?? "")

    const categorias = useQuery({
        queryFn: () => throwableGetData({path: 'categorias'}),
        queryKey: ['categorias']
    })

    const subCategorias = useQuery({
        queryFn: () => throwableGetData({path: `subcategorias/${selectedCategoria}`}),
        queryKey: ['subcategorias', selectedCategoria],
        enabled: !!selectedCategoria
    })

    function CategoriaSelect() {
        if(categorias.isLoading) return (
            <LoadingInput label={contratoLabels.categoria}/>
        )

        return (
            <TextField
                select
                fullWidth
                label={contratoLabels.categoria}
                name="categoria_id"
                helperText={errors?.categoria ?? " "}
                error={errors?.hasOwnProperty("categoria")}
                value={selectedCategoria}
                onChange={(e) => {
                    setSelectedCategoria(e.target.value)
                    setSelectedSubcat("")
                }}
            >
                {
                    categorias.isLoading
                    ? <Box className="w-full h-full flex justify-center"><CircularProgress size={24}/></Box>
                    : categorias.data?.data?.map((categoria) => (
                    <MenuItem value={categoria.id}>{categoria.nome}</MenuItem>
                ))}
            </TextField>
        )
    }

    function SubcategoriaSelect() {
        if(subCategorias.isLoading && !!selectedCategoria) return (
            <LoadingInput label={contratoLabels.subcategoria}/>
        )
        return (
            <TextField
                select
                fullWidth
                name="subcategoria_id"
                value={selectedSubcat}
                onChange={(e) => setSelectedSubcat(e.target.value)}
                helperText={errors?.subcategoria ?? " "}
                error={errors?.hasOwnProperty("subcategoria")}
                disabled={!selectedCategoria}
                label={selectedCategoria ? contratoLabels.subcategoria : "Selecione uma categoria"}
            >
                {subCategorias.isLoading
                    ? <Box className="w-full h-full flex justify-center"><CircularProgress size={24}/></Box>
                    :subCategorias.data?.data?.map((subcategoria) => (
                    <MenuItem value={subcategoria.id}>{subcategoria.nome}</MenuItem>
                ))}
            </TextField>
        )
    }
    return(
        <>
        <CategoriaSelect />
        <SubcategoriaSelect />
        </>
    )
}