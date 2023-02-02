import { Autocomplete, Button, ButtonBase, CircularProgress, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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

export default function CampoEmpresa() {
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [filter, setFilter] = useState("")
    // const [empresaSelecionada, setEmpresaSelecionada] = useState(false)
    const currEmpresa = useRef(null)
    const empresaSelecionada = Boolean(currEmpresa?.current)
    const openAnchor = Boolean(anchorEl)
    const empresaDados = useQuery({
        queryKey: ['empresas'],
        queryFn: () => getFormData("empresas"),
        enabled: open,
        onSuccess: (res) => {
            console.log(res)
        }
    })
    function handleBtnClick (e) {
        setAnchorEl(e.currentTarget)
        setOpen(true)
    }

    return(
        <>
            {
                empresaSelecionada 
                    ?<ButtonBase className="w-full text-start" onClick={handleBtnClick}>
                        <CardEmpresa empresa={currEmpresa.current}/>
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
                    :empresaDados?.data?.data?.map((entry) => {
                    return (
                        <MenuItem onClick={() => {
                            setAnchorEl(null)
                            currEmpresa.current = entry
                            // setEmpresaSelecionada(true)
                            }}>
                            <CardEmpresa empresa={entry}/>
                        </MenuItem>
                    )
                })}
                {/* <MenuItem onClick={() => {
                    setAnchorEl(null)
                    setEmpresaSelecionada(true)
                    }}>
                    <CardEmpresa />
                </MenuItem>
                <MenuItem onClick={() => {
                    setAnchorEl(null)
                    setEmpresaSelecionada(true)
                    }}>
                    <CardEmpresa />
                </MenuItem>
                <MenuItem onClick={() => {
                    setEmpresaSelecionada(true)
                    setAnchorEl(null)
                    }}>
                    <CardEmpresa />
                </MenuItem> */}
                {/* <Autocomplete
                    id="id"
                    open
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
                /> */}
                
            </Menu>
        </>
    )
}