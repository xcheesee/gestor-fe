import { Autocomplete, Button, ButtonBase, CircularProgress, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { getFormData } from "../../commom/utils/api";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./style.css"

function CardEmpresa({empresa}) {
    return(
        <Paper
            elevation={2}
            className="p-4 w-full" sx={{backgroundColor: "hsl(175, 50%, 92%)"}}>
                <Typography className="font-bold text-xl" sx={{color: "hsl(175, 50%, 20%)"}}>{empresa.nome}</Typography>
                <Typography className="pl-4" sx={{color: "hsl(175, 50%, 40%)"}}>{empresa.cnpj_formatado}</Typography>
                <Box className="flex justify-between px-2 pt-6">
                    <Typography sx={{color: "hsl(175, 50%, 40%)"}}>{empresa.email}</Typography>
                    <Typography sx={{color: "hsl(175, 50%, 40%)"}}>{empresa.telefone}</Typography>
                </Box>
            </Paper>
    )
}

const  CampoEmpresa = React.forwardRef(({ }, ref) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [filter, setFilter] = useState("")
    
    const empresaDados = useQuery({
        queryKey: ['empresas'],
        queryFn: () => getFormData("empresas"),
        onSuccess: (res) => {
            console.log(res)
        }
    })
    const openAnchor = Boolean(anchorEl)
    function handleBtnClick (e) {
        setAnchorEl(e.currentTarget)
    }

    return(
        <>
            {
                ref?.current?.id !== null
                    ?<ButtonBase className="w-full text-start" onClick={handleBtnClick}>
                        <CardEmpresa empresa={ref.current}/>
                    </ButtonBase>
                    :<Box className="block flex h-32">
                        <Button className="justify-center" fullWidth onClick={handleBtnClick}>
                            <Typography className="text-3xl font-light">Adicionar Empresa</Typography>
                            <AddCircleOutlineIcon className="mx-4 text-3xl"/>
                        </Button>
                    </Box>
            }
            <Menu 
                open={openAnchor} 
                anchorEl={anchorEl} 
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}>
                <TextField value={filter} onChange={(e) => setFilter(e.target.value)} className="mx-4 w-[400px]" label="Dados da empresa"/>
                {empresaDados.isLoading 
                    ? <Typography>Carregando...</Typography>
                    :empresaDados?.data?.data?.map((entry, index) => {
                    return (
                        <MenuItem
                            key={`empresa-${index}`}
                            onClick={() => {
                                setAnchorEl(null)
                                ref.current = entry
                            }}>
                            <CardEmpresa empresa={entry}/>
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    )
})

export default CampoEmpresa