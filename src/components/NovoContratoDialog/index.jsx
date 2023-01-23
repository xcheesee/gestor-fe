import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendNovoFormData } from "../utils/api";
import { contratoLabels } from "../utils/constants";
import { irParaTopo } from "../utils/utils";
import VoltarArrowBtn from "../VoltarArrowBtn";

export default function NovoContratoDialog({novoDialog, setNovoDialog}) {
    const [sendingForm, setSendingForm] = useState()
    const navigate = useNavigate()
    const departamentos = JSON.parse(localStorage.getItem('departamentos'))
    return (
        <Dialog open={novoDialog} maxWidth="md" fullWidth>
            <DialogTitle><VoltarArrowBtn onClick={() => setNovoDialog(false)} />Novo Contrato</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    className="flex flex-col gap-4 my-4"
                    onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        setSendingForm(true)
                        const res = await sendNovoFormData(formData)
                        irParaTopo()
                        setSendingForm(false)
                        navigate(`../contrato/${res.data.id}`)
                        
                    }}>
                        <FormControl fullWidth required>
                            <InputLabel id="departamento">{contratoLabels.departamento_id}</InputLabel>
                            <Select
                                defaultValue=""
                                labelId="departamento"
                                id="departamento_id"
                                name="departamento_id"
                                label={contratoLabels.departamento_id}
                            >
                                {Object.entries(departamentos)?.map((departamento) => <MenuItem value={departamento[0]}>{departamento[1]}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField name="processo_sei" label={contratoLabels.processo_sei} required/>
                        <Button type="submit" variant="contained" className="self-end">
                            {sendingForm
                                ?
                                <CircularProgress 
                                    sx={{ 
                                        color: (theme) => theme.palette.color.main, 
                                        marginRight: '0.38rem'
                                    }}
                                    size="1rem"
                                />
                                : ""}
                            Enviar
                        </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}