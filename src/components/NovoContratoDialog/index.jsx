import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { contratoLabels } from "../utils/constants";
import { irParaTopo } from "../utils/utils";
import VoltarArrowBtn from "../VoltarArrowBtn";

export default function NovoContratoDialog({novoDialog, setNovoDialog}) {
    const [sendingForm, setSendingForm] = useState()
    const navigate = useNavigate()
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
                        console.log(formData)
                        await new Promise((res, rej) => {
                            setTimeout(() => res(), 3000)
                        })
                        irParaTopo()
                        setSendingForm(false)
                        navigate('../contrato/1')
                        
                    }}>
                        <TextField name="departamento" label={contratoLabels.departamento_id} required/>
                        <TextField name="processo-sei" label={contratoLabels.processo_sei} required/>
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