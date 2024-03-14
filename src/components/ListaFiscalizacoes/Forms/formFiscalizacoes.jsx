import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material"
import { useRef, useState } from "react"
import CampoTexto from "../../CampoTexto"
import { fiscLabels } from "../../../commom/utils/constants"

export default function FormFiscalizacoes({
    numContrato,
    acao,
    dados={},
    formId,
    onSubmit,
    setOpen
}) {

    const [mesmoCargoDialog, setMesmoCargoDialog] = useState(false)
    const [errors, setErrors] = useState({})
    
    const gestorRef = useRef(dados?.nome_gestor ?? "")
    const fiscalRef = useRef(dados?.nome_fiscal ?? "")
    const suplenteRef = useRef(dados?.nome_suplente ?? "")
    const labelsRef = useRef([])
    const firstWarningRef = useRef({
        fiscal: false,
        gestor: false,
        suplente: false
    })

    function checkSameName (currRef, campo) {
        let sameCampo = [campo]
        let isSame = false
            if(currRef !== fiscalRef 
                && !firstWarningRef.current.fiscal 
                && currRef.current === fiscalRef.current 
                && currRef.current !== ""
            ) {
                firstWarningRef.current.fiscal = true
                sameCampo.push("Fiscal")
                isSame = true
            }

            if(currRef !== suplenteRef 
                && !firstWarningRef.current.suplente 
                && currRef.current === suplenteRef.current 
                && currRef.current !== ""
            ) {
                firstWarningRef.current.suplente = true
                sameCampo.push("Suplente")
                isSame = true
            }
            if(currRef !== gestorRef 
                && !firstWarningRef.current.gestor 
                && currRef.current === gestorRef.current 
                && currRef.current !== ""
            ) {
                firstWarningRef.current.gestor = true
                sameCampo.push("Gestor")
                isSame = true
            }
        return {isSame: isSame, labels: sameCampo}
    }
    return(
        <>
            <Box
                component="form"
                id={formId}
                onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    formData.append("contrato_id", numContrato)
                    acao === 'Enviar' 
                        ? onSubmit({formData},{
                            onSuccess: () => setOpen(false),
                            onError: (res) => setErrors(res.errors)
                        }) 
                        : onSubmit({formData, id: dados.id}, {
                            onSuccess: () => setOpen(false),
                            onError: (res) => setErrors(res.errors)
                        })
                }}>
                <CampoTexto
                    defaultValue={dados.nome_gestor}
                    name="nome_gestor"
                    changeFn={(e) => {
                        firstWarningRef.current.fiscal = false
                        firstWarningRef.current.suplente = false
                    }}
                    onBlur={() => {
                        const names = checkSameName(gestorRef, "Gestor")
                        if(names.isSame) {
                            firstWarningRef.current.gestor = true
                            setMesmoCargoDialog(true)
                            labelsRef.current = names.labels
                        }
                    }}
                    labels={fiscLabels}
                    error={errors?.hasOwnProperty('nome_gestor')}
                    helperText={errors?.nome_gestor ?? ""}
                    ref={gestorRef}
                    
                />
                <CampoTexto
                    defaultValue={dados.email_gestor}
                    name="email_gestor"
                    labels={fiscLabels}
                    error={errors?.hasOwnProperty('email_gestor')}
                    helperText={errors?.email_gestor ?? ""}
                    
                />
                <CampoTexto
                    defaultValue={dados.nome_fiscal}
                    name="nome_fiscal"
                    error={errors?.hasOwnProperty('nome_fiscal')}
                    helperText={errors?.nome_fiscal ?? ""}
                    changeFn={(e) => {
                        firstWarningRef.current.gestor = false
                        firstWarningRef.current.suplente = false
                    }}
                    onBlur={() => {
                        const names = checkSameName(fiscalRef, "Fiscal")
                        if(names.isSame) {
                            firstWarningRef.current.fiscal = true
                            setMesmoCargoDialog(true)
                            labelsRef.current = names.labels
                        }
                    }}
                    labels={fiscLabels}
                    ref={fiscalRef}
                    
                />
                <CampoTexto
                    defaultValue={dados.email_fiscal}
                    name="email_fiscal"
                    error={errors?.hasOwnProperty('email_fiscal')}
                    helperText={errors?.email_fiscal ?? ""}
                    labels={fiscLabels}
                    
                />
                <CampoTexto
                    defaultValue={dados.nome_suplente}
                    name="nome_suplente"
                    error={errors?.hasOwnProperty('nome_suplente')}
                    helperText={errors?.nome_suplente ?? ""}
                    labels={fiscLabels}
                    changeFn={(e) => {
                        firstWarningRef.current.fiscal = false
                        firstWarningRef.current.gestor = false
                    }}
                    onBlur={() => {
                        const names = checkSameName(suplenteRef, "Suplente")
                        if(names.isSame) {
                            firstWarningRef.current.suplente = true
                            setMesmoCargoDialog(true)
                            labelsRef.current = names.labels
                        }
                    }}
                    ref={suplenteRef}
                    
                />
                <CampoTexto
                    defaultValue={dados.email_suplente}
                    name="email_suplente"
                    error={errors?.hasOwnProperty('email_suplente')}
                    helperText={errors?.email_suplente ?? ""}
                    labels={fiscLabels}
                    
                />
            </Box>

            <Dialog open={mesmoCargoDialog}>
                <DialogTitle>
                    <Typography className='text-3xl font-light text-center'>Atenção!</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        O nome definido em {labelsRef?.current[0]} possui o mesmo nome que os seguintes cargos: { 
                        labelsRef?.current?.reduce( (acc, val, index, arr) => {
                            if(index === arr.length - 1) return acc + `${val}.`
                            if(index === 0) return acc
                            return acc + `${val}, `
                        }, "") }
                    </Typography>
                </DialogContent>
                <DialogActions className='p-4'>
                    <Button 
                        variant='contained'
                        onClick={() => setMesmoCargoDialog(false)}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}