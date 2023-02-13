import { 
    Box,
    Button, 
    CircularProgress, 
    Dialog, DialogActions, DialogContent, 
    DialogTitle, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select,
    Typography, 
} from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkSeiStatus, getFormattedFormData, sendNovoFormData } from "../../commom/utils/api";
import { contratoLabels } from "../../commom/utils/constants";
import { irParaTopo } from "../../commom/utils/utils";
import CampoProcessoSei from "../CampoProcessoSei";
import VoltarArrowBtn from "../VoltarArrowBtn";

export default function NovoContratoDialog({novoDialog, setNovoDialog, setSnackbar}) {
    const [sendingForm, setSendingForm] = useState(false)
    const [existeSEI, setExisteSEI] = useState(false)
    const clearSwitch= useRef(true) //"switch" utilizado para resetar o valor do campo sei caso
    const contrato = useRef({
        departamento_id: "",
        processo_sei: "",
    })

    const navigate = useNavigate()
    const departamentos = JSON.parse(localStorage.getItem('departamentos'))
    return (
        <>
            <Dialog open={novoDialog} maxWidth="md" fullWidth>
                <DialogTitle><VoltarArrowBtn onClick={() => setNovoDialog(false)} />Novo Contrato</DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        className="flex flex-col gap-4 my-4"
                        onSubmit={async (e) => {
                            e.preventDefault()
                            setSendingForm(true)
                            contrato.current = getFormattedFormData(new FormData(e.target))
                            const seiCheck = await checkSeiStatus(contrato.current.processo_sei)
                            if(seiCheck.status === 200) {
                                setSendingForm(false)
                                return setExisteSEI(true)
                            } else if(seiCheck.status === 404) {
                                const res = await sendNovoFormData(contrato.current)
                                if(res.status !== 201) {
                                    return setSnackbar(prev => ({
                                        ...prev,
                                        severity: "error",
                                        text: `Nao foi possivel criar o Contrato no momento. Erro: ${res.status}`,
                                        open: true
                                    }))
                                } 
                                irParaTopo()
                                setSendingForm(false)
                                return navigate(`../contrato/${res.data.id}`)
                            }
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
                                    {Object.entries(departamentos)
                                        ?.map((departamento, index) => (
                                            <MenuItem key={`dep_id_${index}`} value={departamento[0]}>
                                                {departamento[1]}
                                            </MenuItem>))
                                    }
                                </Select>
                            </FormControl>
                            <CampoProcessoSei 
                                name="processo_sei" 
                                label={contratoLabels.processo_sei}
                                ref={clearSwitch}
                                required
                            />
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
            
            <Dialog open={existeSEI}>
                <DialogTitle>
                    <Typography className="text-3xl text-center pb-4 font-light text-red-600">Atencao!</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography>Já existe um ou mais contratos com esse número de processo SEI.</Typography>
                </DialogContent>
                <DialogActions className="pb-4 pr-4 flex gap-4">
                    <Button 
                        color="success" 
                        onClick={async () => {
                            setSendingForm(true)
                            setExisteSEI(false)
                            const res = await sendNovoFormData(contrato.current)
                            if(res.status !== 201) {
                                setSendingForm(false)
                                return setSnackbar(prev => ({
                                    ...prev,
                                    severity: "error",
                                    text: `Nao foi possivel criar o Contrato no momento. Erro: ${res.status}`,
                                    color: 'error',
                                    open: true
                                }))
                            }
                            irParaTopo()
                            setSendingForm(false)
                            return navigate(`../contrato/${res.data.id}`)
                        }}
                    >Continuar</Button>
                    <Button 
                        variant="contained" 
                        className="bg-red-500"
                        onClick={() => {
                            
                            setExisteSEI(false)
                            clearSwitch.current = !clearSwitch.current
                        }}
                    >Cancelar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}