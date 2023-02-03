import { Button, ButtonBase, IconButton, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getFormData } from "../../commom/utils/api";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import "./style.css"

export function CardDotacao({dotacao, centered=false, displayOnly=false, onClick=() => {}, handleDelClick=() => {}}) {
    const toCenter = centered ? "text-center" : ""
    function CardBody() {
        return(
            <Box className="p-4">
                <Typography className={`font-bold text-xl ${toCenter}`} sx={{color: "hsl(175, 50%, 20%)"}}>{dotacao?.descricao}</Typography>
                <Typography className={`pl-4 ${toCenter}`} sx={{color: "hsl(175, 50%, 40%)"}}>{dotacao?.numero_dotacao}</Typography>
                <Box className="flex justify-around gap-16 px-2 pt-6">
                    <Typography sx={{color: "hsl(175, 50%, 40%)"}}>{dotacao?.tipo_despesa}</Typography>
                    {/* <Typography sx={{color: "hsl(175, 50%, 40%)"}}>{dotacao?.tipo_despesa}</Typography> */}
                </Box>
            </Box>
        )
    }
    return(
        <Paper
            elevation={2}
            className="w-full grid grid-cols-[1fr_min-content] items-start" sx={{backgroundColor: "hsl(175, 50%, 92%)"}}>
                {displayOnly
                    ?<Box>
                        <CardBody />
                    </Box>
                    :<ButtonBase className="w-full" onClick={onClick}>
                        <CardBody />
                    </ButtonBase>
                }
                
                {displayOnly 
                    ?""
                    :<IconButton className="z-50" onClick={handleDelClick}>
                        <DeleteIcon />
                    </IconButton>
                }
            </Paper>
    )
}

const  CampoTipoDotacao = React.forwardRef(({ }, ref) => {
    const [anchorEl, setAnchorEl] = useState(null)
    // const [filter, setFilter] = useState("")
    const [currEmpresa, setCurrEmpresa] = useState(ref.current)
    console.log(ref.current)
    
    const empresaDados = useQuery({
        queryKey: ['dotacao_tipos'],
        queryFn: () => getFormData("dotacao_tipos"),
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
                currEmpresa?.id !== null
                    ?<CardDotacao dotacao={currEmpresa} onClick={handleBtnClick} handleDelClick={(e) => {
                        ref.current = {
                            id: "",
                            descricao: "",
                            numero_dotacao: "",
                            tipo_despesa: "",
                        }
                        setCurrEmpresa({
                            id: null
                        })
                    }}/>
                    :<Box className="block flex h-32">
                        <Button className="justify-center" fullWidth onClick={handleBtnClick}>
                            <Typography className="text-3xl font-light">Adicionar Dotacao</Typography>
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
                {/* <TextField 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)} 
                    className="ml-4 mr-8 my-2 w-[400px]" 
                    label="Dados da empresa"/> */}
                {empresaDados.isLoading 
                    ? <Typography>Carregando...</Typography>
                    :empresaDados?.data?.data?.map((entry, index) => {
                    return (
                        <MenuItem
                            key={`empresa-${index}`}
                            onClick={() => {
                                setAnchorEl(null)
                                ref.current = entry
                                setCurrEmpresa(entry)
                            }}>
                            <CardDotacao 
                                dotacao={entry} 
                                displayOnly/>
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    )
})

export default CampoTipoDotacao