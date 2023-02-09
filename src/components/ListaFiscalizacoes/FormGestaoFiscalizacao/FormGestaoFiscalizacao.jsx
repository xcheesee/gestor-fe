import React, { useEffect, useRef, useState } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography
} from '@mui/material';

import CampoTexto from '../../CampoTexto';
import { fiscLabels } from '../../../commom/utils/constants';

const FormGestaoFiscalizacao = (props) => {
    const {
        formFiscalizacao,
        enviaFiscalizacao,
        editaFiscalizacao,
        openFormFiscalizacao,
        errors,
        setErrors
    } = props;

    const [mesmoCargoDialog, setMesmoCargoDialog] = useState(false)
    
    const gestorRef = useRef(formFiscalizacao.nome_gestor)
    const fiscalRef = useRef(formFiscalizacao.nome_fiscal)
    const suplenteRef = useRef(formFiscalizacao.nome_suplente)
    const labelsRef = useRef([])
    const firstWarningRef = useRef({
        fiscal: false,
        gestor: false,
        suplente: false
    })

    useEffect(() => {
        setErrors({});
    }, [openFormFiscalizacao.open])

    // function checkSameName () {
    //     if(gestorRef.current === "" || fiscalRef.current === "" || suplenteRef.current === "") return {isSame: false, labels: []}
    //     if(
    //         fiscalRef.current === suplenteRef.current 
    //         && suplenteRef.current === gestorRef.current
    //     ) 
    //         return {isSame: true, labels: [fiscLabels.nome_fiscal, fiscLabels.nome_suplente, fiscLabels.nome_gestor]}
    //     else if(gestorRef.current === fiscalRef.current) 
    //         return {isSame: true, labels: [fiscLabels.nome_fiscal, fiscLabels.nome_gestor]}
    //     else if(gestorRef.current === suplenteRef.current) 
    //         return {isSame: true, labels: [fiscLabels.nome_suplente, fiscLabels.nome_gestor]}
    //     else if(fiscalRef.current === suplenteRef.current) 
    //         return {isSame: true, labels: [fiscLabels.nome_fiscal, fiscLabels.nome_suplente]}
    //     return {isSame: false, labels: []}
    // }

    function checkSameName (currRef) {
        let sameCampo = []
        let isSame = false
        if(currRef === gestorRef && !firstWarningRef.current.gestor) { // check de equalidade de referencia
            firstWarningRef.current.gestor = true
            sameCampo.push("Gestor")
            if(currRef.current === fiscalRef.current && currRef.current !== "") {
                firstWarningRef.current.fiscal = true
                sameCampo.push("Fiscal")
                isSame = true
            }
            if(currRef.current === suplenteRef.current && currRef.current !== "") {
                firstWarningRef.current.suplente = true
                sameCampo.push("Suplente")
                isSame = true
            }
        } else if (currRef === fiscalRef && !firstWarningRef.current.fiscal) {
            firstWarningRef.current.fiscal = true
            sameCampo.push("Fiscal")
            if(currRef.current === gestorRef.current && currRef.current !== "") {
                firstWarningRef.current.gestor = true
                sameCampo.push("Gestor")
                isSame = true
            }
            if(currRef.current === suplenteRef.current && currRef.current !== "") {
                firstWarningRef.current.suplente = true
                sameCampo.push("Suplente")
                isSame = true
            }
        } else if (currRef === suplenteRef && !firstWarningRef.current.suplente) {
            firstWarningRef.current.suplente = true
            sameCampo.push("Suplente")
            if(currRef.current === gestorRef.current && currRef.current !== "") {
                firstWarningRef.current.gestor = true
                sameCampo.push("Gestor")
                isSame = true
            }
            if(currRef.current === fiscalRef.current && currRef.current !== "") {
                firstWarningRef.current.fiscal = true
                sameCampo.push("Fiscal")
                isSame = true
            }
        }
        return {isSame: isSame, labels: sameCampo}
    }
    
    return (
        <>
            <Box
                component="form"
                id="fisc_form"
                onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    formData.append("contrato_id", formFiscalizacao.contrato_id)
                    openFormFiscalizacao.acao === 'adicionar' ? enviaFiscalizacao(formData) : editaFiscalizacao(formFiscalizacao.id, formData)
                }}>
                <CampoTexto
                    defaultValue={formFiscalizacao.nome_gestor}
                    name="nome_gestor"
                    changeFn={(e) => {
                        firstWarningRef.current.gestor = false
                    }}
                    onBlur={() => {

                        const names = checkSameName(gestorRef)
                        if(names.isSame) {
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
                    defaultValue={formFiscalizacao.email_gestor}
                    name="email_gestor"
                    labels={fiscLabels}
                    errors={errors}
                    required
                />
                <CampoTexto
                    defaultValue={formFiscalizacao.nome_fiscal}
                    name="nome_fiscal"
                    changeFn={(e) => {
                        firstWarningRef.current.fiscal = false
                    }}
                    onBlur={() => {
                        const names = checkSameName(fiscalRef)
                        if(names.isSame) {
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
                    defaultValue={formFiscalizacao.email_fiscal}
                    name="email_fiscal"
                    labels={fiscLabels}
                    errors={errors}
                    required
                />
                <CampoTexto
                    defaultValue={formFiscalizacao.nome_suplente}
                    name="nome_suplente"
                    labels={fiscLabels}
                    errors={errors}
                    changeFn={(e) => {
                        firstWarningRef.current.suplente = false
                        // gestorRef.current = e.target.value
                    }}
                    onBlur={() => {
                        const names = checkSameName(suplenteRef)
                        if(names.isSame) {
                            setMesmoCargoDialog(true)
                            labelsRef.current = names.labels
                        }
                    }}
                    ref={suplenteRef}
                    required
                />
                <CampoTexto
                    defaultValue={formFiscalizacao.email_suplente}
                    name="email_suplente"
                    labels={fiscLabels}
                    errors={errors}
                    required
                />
            </Box>
            <Dialog open={mesmoCargoDialog}>
                <DialogTitle>
                    <Typography className='text-3xl font-light text-center'>Atencao!</Typography>
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
    );
}

export default FormGestaoFiscalizacao;