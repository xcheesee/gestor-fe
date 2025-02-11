import Fuse from 'fuse.js'
import { Button, ButtonBase, Dialog, DialogContent, DialogTitle, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { getFormData } from "../../../commom/utils/api";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import "./style.css"

function CardDotacao({
    dotacao, 
    centered=false, 
    displayOnly=false, 
    onClick=() => {}, 
    handleDelClick=() => {},
}) {
    const toCenter = centered ? "text-center" : ""
    function CardBody() {
        return(
            <Box className="p-4">
                <Typography className={`font-bold text-xl ${toCenter}`} sx={{color: "hsl(175, 50%, 20%)"}}>{dotacao?.numero_dotacao}</Typography>
                <Typography className={`pl-4 ${toCenter}`} sx={{color: "hsl(175, 50%, 20%)"}}>{dotacao?.descricao}</Typography>
                <Box className="flex justify-around gap-16 px-2 pt-6">
                    <Typography sx={{color: "hsl(175, 50%, 40%)"}}>{dotacao?.tipo_despesa}</Typography>
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

const  CampoTipoDotacao = React.forwardRef(({ dotacao }, ref) => {
    
    const filter = useRef("")
    const [anchorEl, setAnchorEl] = useState(null)
    const [dotacoesFiltradas, setDotacoesFiltradas] = useState([])
    const [dot, setDot] = useState(dotacao)
    const openAnchor = Boolean(anchorEl)
    
    const dotacoesDados = useQuery({
        queryKey: ['dotacao_tipos'],
        queryFn: () => getFormData("dotacao_tipos"),
        onSuccess: (res) => {
            setDotacoesFiltradas(res.data)
        }
    })

    const fuse = new Fuse(dotacoesDados?.data?.data, {
        keys: [
            "numero_dotacao",
            "descricao",
            "tipo_despesa"
        ],
        ignoreLocation: true
    })

    function handleBtnClick (e) {
        setAnchorEl(e.currentTarget)
    }
    return(
        <>
            <input type="text" value={dot.dotacao_tipo_id} name='dotacao_tipo_id' className='hidden'/>
            {
                dot?.dotacao_tipo_id !== ""
                    ?<CardDotacao dotacao={dot} onClick={handleBtnClick} handleDelClick={(e) => {
                        setDot(prev => ({
                            ...prev,
                            descricao: "",
                            numero_dotacao: "",
                            dotacao_tipo_id: "",
                            tipo_despesa: "",
                        }))
                    }}/>
                    :<Box className="block h-32">
                        <Button className="h-full" fullWidth onClick={handleBtnClick}>
                            <Typography className="text-3xl font-light">Definir Tipo de Dotacao</Typography>
                            <AddCircleOutlineIcon className="mx-4 text-3xl"/>
                        </Button>
                    </Box>
            }
            <Dialog 
                open={openAnchor} 
                onClose={() => {
                    setAnchorEl(null)
                    filter.current = ""
                }}
            >
                <DialogTitle>
                    <TextField 
                        defaultValue={filter.current} 
                        onChange={(e) => {
                            filter.current = e.target.value
                            if(filter.current.length > 2) {
                                setDotacoesFiltradas(fuse.search(filter.current))
                            } else {
                                setDotacoesFiltradas(dotacoesDados?.data?.data)
                            }

                        }} 
                        fullWidth
                        className="my-2" 
                        label="Dados da dotacao"/>
                </DialogTitle>
                <DialogContent>
                    {dotacoesDados.isLoading 
                        ? <Typography>Carregando...</Typography>
                        :filter.current.length > 2 
                            ?dotacoesFiltradas?.map((entry, index) => {
                                return (
                                    <ButtonBase
                                        key={`empresa-${index}`}
                                        className='m-2 w-full'
                                        onClick={() => {
                                            setAnchorEl(null)
                                            setDot((prev) => ({
                                                ...prev,
                                                dotacao_tipo_id: entry.item.id,
                                                numero_dotacao: entry.item.numero_dotacao,
                                                tipo_despesa: entry.item.tipo_despesa,
                                                descricao: entry.item.descricao
                                            }))
                                            filter.current = ""
                                        }}>
                                        <CardDotacao 
                                            dotacao={{
                                                numero_dotacao: entry.item.numero_dotacao,
                                                tipo_despesa: entry.item.tipo_despesa,
                                                descricao: entry.item.descricao
                                            }} 
                                            displayOnly/>
                                    </ButtonBase>
                                )
                            })
                            :dotacoesDados?.data?.data?.map((entry, index) => {
                            return (
                                <ButtonBase
                                    key={`empresa-${index}`}
                                    className='m-2 w-full'
                                    onClick={() => {
                                        setAnchorEl(null)
                                        setDot((prev) => ({
                                            ...prev,
                                            dotacao_tipo_id: entry.id, 
                                            numero_dotacao: entry.numero_dotacao,
                                            tipo_despesa: entry.tipo_despesa,
                                            descricao: entry.descricao
                                        }))
                                    }}>

                                    <CardDotacao 
                                        dotacao={entry} 
                                        displayOnly
                                    />
                                </ButtonBase>
                            )
                        })
                    }
                </DialogContent>
            </Dialog>
        </>
    )
})

export default CampoTipoDotacao