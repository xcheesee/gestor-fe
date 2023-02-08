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
    const firstWarningRef = useRef(false)

    useEffect(() => {
        setErrors({});
    }, [openFormFiscalizacao.open])

    function checkSameName () {
        console.log(gestorRef.current,fiscalRef.current, suplenteRef.current)
        if(gestorRef.current === "" || fiscalRef.current === "" || suplenteRef.current === "") return {isSame: false, labels: []}
        if(
            fiscalRef.current === suplenteRef.current 
            && suplenteRef.current === gestorRef.current
        ) 
            return {isSame: true, labels: [fiscLabels.nome_fiscal, fiscLabels.nome_suplente, fiscLabels.nome_gestor]}
        else if(gestorRef.current === fiscalRef.current) 
            return {isSame: true, labels: [fiscLabels.nome_fiscal, fiscLabels.nome_gestor]}
        else if(gestorRef.current === suplenteRef.current) 
            return {isSame: true, labels: [fiscLabels.nome_suplente, fiscLabels.nome_gestor]}
        else if(fiscalRef.current === suplenteRef.current) 
            return {isSame: true, labels: [fiscLabels.nome_fiscal, fiscLabels.nome_suplente]}
        return {isSame: false, labels: []}
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
                        firstWarningRef.current = false
                        // gestorRef.current = e.target.value
                    }}
                    onBlur={() => {
                        console.log(gestorRef.current)
                        
                        const names = checkSameName()
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
                        firstWarningRef.current = false
                        // gestorRef.current = e.target.value
                    }}
                    onBlur={() => {
                        const names = checkSameName()
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
                        firstWarningRef.current = false
                        // gestorRef.current = e.target.value
                    }}
                    onBlur={() => {
                        const names = checkSameName()
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
                        O nome definido em {labelsRef?.current[0]} esta assumindo os seguintes cargos: { 
                        labelsRef?.current?.reduce( (acc, val, index, arr) => {
                            if(index === arr.length - 1) return acc + ` e ${val}.`
                            if(index === 0) return acc + ` ${val}`
                            return acc + `, ${val}`
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