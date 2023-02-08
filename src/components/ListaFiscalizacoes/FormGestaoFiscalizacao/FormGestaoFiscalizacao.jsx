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
        // setFormFiscalizacao,
        enviaFiscalizacao,
        editaFiscalizacao,
        // carregando,
        openFormFiscalizacao,
        // setOpenFormFiscalizacao,
        // setOpenConfirmacao,
        errors,
        setErrors
    } = props;

    const [mesmoCargoDialog, setMesmoCargoDialog] = useState(false)
    
    // const handleInputChange = (e) => {
    //     setFormFiscalizacao({
    //         ...formFiscalizacao,
    //         [e.target.name]: e.target.value
    //     });
    // }
    
    const gestorRef = useRef(formFiscalizacao.nome_gestor)
    const fiscalRef = useRef(formFiscalizacao.nome_fiscal)
    const suplenteRef = useRef(formFiscalizacao.nome_suplente)
    const labelsRef = useRef([])
    const firstWarningRef = useRef(false)

    useEffect(() => {
        setErrors({});
        console.log(gestorRef.current)
    }, [openFormFiscalizacao.open])

    // const handleClickConfirmar = () => {
    //     if (openFormFiscalizacao.acao === 'adicionar') {
    //         enviaFiscalizacao();
    //     } else if (openFormFiscalizacao.acao === 'editar') {
    //         setOpenConfirmacao({
    //             open: true,
    //             id: formFiscalizacao.id
    //         });
    //     }
    // }

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
            {/* <Dialog open={openFormFiscalizacao.open} fullWidth>
                <DialogTitle>
                    {openFormFiscalizacao.acao === 'adicionar'
                        ? "Nova gestão/fiscalização"
                        : "Editar gestão/fiscalização"
                    }
                </DialogTitle>
                <DialogContent> */}
                    <Box
                        component="form"
                        id="fisc_form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.target)
                            formData.append("contrato_id", formFiscalizacao.contrato_id)
                            openFormFiscalizacao.acao === 'adicionar' ? enviaFiscalizacao(formData) : editaFiscalizacao(formFiscalizacao.id, formData)
                        }}>
                        {/* <TextField
                            variant="outlined"
                            defaultValue={formFiscalizacao.nome_gestor ?? ""}
                            name="nome_gestor"
                            label="Gestor"
                            sx={{ margin: '1rem 0' }}
                            error={errors.hasOwnProperty('nome_gestor')}
                            helperText={errors.nome_gestor}
                            fullWidth
                            required
                        /> */}
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
                        {/* <TextField
                            variant="outlined"
                            defaultValue={formFiscalizacao.email_gestor ?? ""}
                            name="email_gestor"
                            label="E-mail do Gestor"
                            sx={{ margin: '1rem 0' }}
                            error={errors.hasOwnProperty('email_gestor')}
                            helperText={errors.email_gestor}
                            fullWidth
                            required
                        /> */}
                        <CampoTexto
                            defaultValue={formFiscalizacao.email_gestor}
                            name="email_gestor"
                            labels={fiscLabels}
                            errors={errors}
                            required
                        />
                        {/* <TextField
                            variant="outlined"
                            defaultValue={formFiscalizacao.nome_fiscal ?? ""}
                            name="nome_fiscal"
                            // onChange={handleInputChange}
                            label="Fiscal"
                            sx={{ margin: '1rem 0' }}
                            error={errors.hasOwnProperty('nome_fiscal')}
                            helperText={errors.nome_fiscal}
                            fullWidth
                            required
                        /> */}
                        <CampoTexto
                            defaultValue={formFiscalizacao.nome_fiscal}
                            name="nome_fiscal"
                            changeFn={(e) => {
                                firstWarningRef.current = false
                                console.log('pog')
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
                        {/* <TextField
                            variant="outlined"
                            defaultValue={formFiscalizacao.email_fiscal ?? ""}
                            name="email_fiscal"
                            // onChange={handleInputChange}
                            label="E-mail do Fiscal"
                            sx={{ margin: '1rem 0' }}
                            error={errors.hasOwnProperty('email_fiscal')}
                            helperText={errors.email_fiscal}
                            fullWidth
                            required
                        /> */}
                        <CampoTexto
                            defaultValue={formFiscalizacao.email_fiscal}
                            name="email_fiscal"
                            labels={fiscLabels}
                            errors={errors}
                            required
                        />
                        {/* <TextField
                            variant="outlined"
                            defaultValue={formFiscalizacao.nome_suplente ?? ""}
                            name="nome_suplente"
                            onChange={handleInputChange}
                            label="Suplente"
                            sx={{ margin: '1rem 0' }}
                            error={errors.hasOwnProperty('nome_suplente')}
                            helperText={errors.nome_suplente}
                            fullWidth
                            required
                        /> */}
                        <CampoTexto
                            defaultValue={formFiscalizacao.nome_suplente}
                            name="nome_suplente"
                            labels={fiscLabels}
                            errors={errors}
                            changeFn={(e) => {
                                firstWarningRef.current = false
                                console.log('pog')
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
                        {/* <TextField
                            variant="outlined"
                            defaultValue={formFiscalizacao.email_suplente ?? ""}
                            name="email_suplente"
                            onChange={handleInputChange}
                            label="E-mail do Suplente"
                            sx={{ margin: '1rem 0' }}
                            error={errors.hasOwnProperty('email_fiscal')}
                            helperText={errors.email_fiscal}
                            fullWidth
                            required
                        /> */}
                        <CampoTexto
                            defaultValue={formFiscalizacao.email_suplente}
                            name="email_suplente"
                            labels={fiscLabels}
                            errors={errors}
                            required
                        />
                    </Box>
                {/* </DialogContent> */}
                {/* <DialogActions sx={{ margin: '1rem' }}>
                    <Button
                        onClick={() => { setOpenFormFiscalizacao({ ...openFormFiscalizacao, open: false }); }}
                        sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                    >
                        <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                    </Button>
                    <Button
                        sx={{ textTransform: 'none' }}
                        variant="contained"
                        onClick={handleClickConfirmar}
                        type={openFormFiscalizacao.acao === 'adicionar' ? "submit" : ""}
                        form={openFormFiscalizacao.acao === 'adicionar' ? "fisc_form" : ""}
                    >
                        {carregando
                            ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                            : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" />
                        }
            
                        {openFormFiscalizacao.acao === 'adicionar'
                            ? "Enviar"
                            : "Editar"
                        }
                    </Button>
                </DialogActions> */}
            {/* </Dialog> */}
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