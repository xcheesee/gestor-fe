import { Divider, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useState } from "react";

export default function MaxPrazoInput ({helperText, validade, disabled, label, defaultValue}) {
    const [prazoDias, setPrazoDias] = useState("")
    const [dayMultiplier, setDayMultiplier] = useState("")
    const [maxPrazo, setMaxPrazo] = useState(new Date(defaultValue + "T00:00:00").toLocaleDateString("pt-BR"))
    const isInitialMount = useRef(true)
    useEffect(() => {
        if(isInitialMount.current) {
            isInitialMount.current = false // previne mudanca de valor de max_prazo em montagem inicial do form
        } else {
            setMaxPrazo(setNewDate(prazoDias, dayMultiplier, validade))
        }
    }, [validade])

    function setNewDate(day, multiplier) {
        if(day === "" || multiplier === "" || validade === "") return ""
        const novaData = new Date(validade + " 00:00:00")
        if (multiplier > 1){
            novaData.setMonth(novaData.getMonth() + +day)
        }else{
            novaData.setDate(novaData.getDate() + (day * multiplier))
        }

        return novaData.toLocaleDateString('pt-br')
    }
    return(
        <>
            {disabled
                ? <Tooltip title="Defina a data de vencimento para definir um prazo maximo prorrogavel">
                    <div className='flex border border-gray-300 border-solid rounded items-center' >
                        <TextField
                            className="max-w-[300px]"
                            variant='outlined'
                            label={label}
                            fullWidth
                            // value={prazoDias}
                            disabled={disabled}
                            // onChange={ (e) => setPrazoDias(e.target.value) }
                            // onBlur={ () => setMaxPrazo(setNewDate(prazoDias, dayMultiplier)) }
                            sx={{
                                "& fieldset": { border: 'none' },
                                "& label": {backgroundColor: 'white', paddingInline: '4px'}
                            }}/>
                        <Divider orientation='vertical' sx={{height: 40, m: 0.5}}/>
                        <Select
                            variant='outlined'
                            className="max-w-[300px]"
                            fullWidth
                            sx={{ "& fieldset": { border: 'none' }, }}
                            disabled={disabled}
                            // value={dayMultiplier}
                            // onChange={(e) => {
                            //     setDayMultiplier(e.target.value)
                            //     setMaxPrazo(setNewDate(prazoDias, e.target.value))
                            // }}
                            >
                            {/* <MenuItem value={1}>Dia(s)</MenuItem>
                            <MenuItem value={30}>Mes(es)</MenuItem> */}
                        </Select>
                        <Divider orientation='vertical' sx={{height: 40, m: 0.5}}/>
                        <TextField
                            variant='outlined'
                            label="Prazo Maximo Prorrogavel"
                            placeholder={""}
                            value={maxPrazo}
                            fullWidth
                            sx={{
                                "& fieldset": { border: 'none' },
                                "& label": {backgroundColor: 'white', paddingInline: '4px'}
                            }}
                            InputLabelProps={{ shrink: true }}/>
                    </div>
                </Tooltip>
                :<div className='flex border border-gray-300 border-solid rounded items-center' >
                    <TextField
                        className="max-w-[300px]"
                        placeholder='5'
                        variant='outlined'
                        label="Prazo a partir de"
                        fullWidth
                        value={prazoDias}
                        onChange={ (e) => setPrazoDias(e.target.value) }
                        onBlur={ () => setMaxPrazo(setNewDate(prazoDias, dayMultiplier)) }
                        sx={{
                            "& fieldset": { border: 'none' },
                            "& label": {backgroundColor: 'white', paddingInline: '4px'}
                        }}/>
                    <Divider orientation='vertical' sx={{height: 40, m: 0.5}}/>
                    <Select
                        variant='outlined'
                        className="max-w-[300px]"
                        fullWidth
                        sx={{ "& fieldset": { border: 'none' }, }}
                        value={dayMultiplier}
                        onChange={(e) => {
                            setDayMultiplier(e.target.value)
                            setMaxPrazo(setNewDate(prazoDias, e.target.value))
                        }}>
                        <MenuItem value={1}>Dia(s)</MenuItem>
                        <MenuItem value={30}>Mes(es)</MenuItem>
                    </Select>
                    <Divider orientation='vertical' sx={{height: 40, m: 0.5}}/>
                    <TextField
                        variant='outlined'
                        name="data_prazo_maximo"
                        label="Prazo Maximo Prorrogavel"
                        placeholder=""
                        value={maxPrazo}
                        fullWidth
                        sx={{
                            "& fieldset": { border: 'none' },
                            "& label": {backgroundColor: 'white', paddingInline: '4px'}
                        }}
                        InputLabelProps={{ shrink: true }}/>
                </div>
            }
            <Typography className="text-[0.75rem] pl-3 py-1 text-[rgba(0,0,0,0.6)]">{ helperText }</Typography>
        </>
    )
}