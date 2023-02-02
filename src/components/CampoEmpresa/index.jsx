import { Autocomplete, Button, ButtonBase, CircularProgress, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getFormData } from "../../commom/utils/api";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./style.css"

function CardEmpresa({}) {
    return(
        <Paper
            elevation={2}
            className="p-4 w-full" sx={{backgroundColor: "hsl(175, 50%, 92%)"}}>
                <Typography className="font-bold text-xl" sx={{color: "hsl(175, 50%, 20%)"}}>Empresa Bala</Typography>
                <Typography className="pl-4" sx={{color: "hsl(175, 50%, 40%)"}}>12.321.321.0111/11</Typography>
                <Box className="flex justify-between px-2 pt-6">
                    <Typography sx={{color: "hsl(175, 50%, 40%)"}}>lojadamasc@loja.com</Typography>
                    <Typography sx={{color: "hsl(175, 50%, 40%)"}}>(11) 95555-5555</Typography>
                </Box>
            </Paper>
    )
}

export default function CampoEmpresa() {
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [filter, setFilter] = useState("")
    const [empresaSelecionada, setEmpresaSelecionada] = useState(false)
    const openAnchor = Boolean(anchorEl)
    const empresaDados = useQuery({
        queryKey: ['empresas'],
        queryFn: () => getFormData("empresas"),
        enabled: open,
    })
    const loading = open && empresaDados.isLoading
    function handleBtnClick (e) {
        setAnchorEl(e.currentTarget)
        setOpen(true)
    }

    return(
        <>
            {
                empresaSelecionada 
                    ?<ButtonBase className="w-full text-start" onClick={handleBtnClick}>
                        <CardEmpresa />
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
                <MenuItem onClick={() => {
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
                </MenuItem>
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