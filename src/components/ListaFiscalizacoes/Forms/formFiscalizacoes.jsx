import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material"
import { useRef, useState } from "react"
import CampoTexto from "../../CampoTexto"
import { fiscLabels } from "../../../commom/utils/constants"

export default function FormFiscalizacoes({
    numContrato,
    acao,
    dados={},
    errors={},
    formId,
    onSubmit,
    setOpen
}) {

    const [mesmoCargoDialog, setMesmoCargoDialog] = useState(false)
    
    const gestorRef = useRef(dados?.nome_gestor ?? "")
    const fiscalRef = useRef(dados?.nome_fiscal ?? "")
    const suplenteRef = useRef(dados?.nome_suplente ?? "")
    const labelsRef = useRef([])
    const firstWarningRef = useRef({
        fiscal: false,
        gestor: false,
        suplente: false
    })

    //useEffect(() => {
    //    setErrors({});
    //}, [openFormFiscalizacao.open])

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
                            onSuccess: () => setOpen(false)
                        }) 
                        : onSubmit({formData, id: dados.id}, {
                            onSuccess: () => setOpen(false)
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
                    errors={errors}
                    ref={gestorRef}
                    required
                />
                <CampoTexto
                    defaultValue={dados.email_gestor}
                    name="email_gestor"
                    labels={fiscLabels}
                    errors={errors}
                    required
                />
                <CampoTexto
                    defaultValue={dados.nome_fiscal}
                    name="nome_fiscal"
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
                    errors={errors}
                    ref={fiscalRef}
                    required
                />
                <CampoTexto
                    defaultValue={dados.email_fiscal}
                    name="email_fiscal"
                    labels={fiscLabels}
                    errors={errors}
                    required
                />
                <CampoTexto
                    defaultValue={dados.nome_suplente}
                    name="nome_suplente"
                    labels={fiscLabels}
                    errors={errors}
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
                    required
                />
                <CampoTexto
                    defaultValue={dados.email_suplente}
                    name="email_suplente"
                    labels={fiscLabels}
                    errors={errors}
                    required
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