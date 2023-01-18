import { Divider, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

export default function MaxPrazoInput ({helperText, validade, disabled, label}) {
    const [prazoDias, setPrazoDias] = useState("")
    const [maxPrazo, setMaxPrazo] = useState("")
    const [dayMultiplier, setDayMultiplier] = useState("")

    function setNewDate(day, multiplier) {
        if(day === "" || multiplier === "" || validade === "") return
        const novaData = new Date(validade)
        novaData.setDate(novaData.getDate() + (+day * +multiplier))
        return novaData.toLocaleDateString('pt-br')
    }
    return(
        <>
        {/* tooltip nao passa ref para custom element. bug com relacao a ref inheritance? Bruh */}
            {disabled 
                ? <Tooltip title="Defina a data de vencimento para definir um prazo maximo prorrogavel">
                    <div className='flex border border-gray-300 border-solid rounded items-center' >
                        <TextField
                            className="max-w-[300px]"
                            variant='outlined'
                            label={label}
                            fullWidth
                            value={prazoDias}
                            disabled={disabled}
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
                            disabled={disabled}
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
                            label="Prazo Maximo Prorrogavel"
                            placeholder={disabled ? "" : ""}
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
                        disabled={disabled}
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
                        disabled={disabled}
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
                        label="Prazo Maximo Prorrogavel"
                        placeholder={disabled ? "" : ""}
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