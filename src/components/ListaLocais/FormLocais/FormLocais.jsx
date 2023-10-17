import React, { useEffect, useState } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress,
    FormHelperText,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import SubprefeituraInput from '../SubprefeituraInput';
import DistritoInput from '../DistritoInput';

const FormLocais = (props) => {
    const {
        formLocal,
        setFormLocal,
        openFormLocal,
        setOpenFormLocal,
        carregando,
        setOpenConfirmacao,
        acao,
        errors,
        setErrors,
        enviaLocal,
        editaLocal,
        formId,
    } = props;

    const [regiao, setRegiao] = useState(formLocal.regiao);
    const [subpref, setSubpref] = useState(typeof formLocal.subprefeitura_id !== 'object' ? [formLocal.subprefeitura_id] : (formLocal.subprefeitura_id ?? []) )

    useEffect(() => {
        //Limpa valores ao abrir form
        setRegiao('');
        setSubpref([])

        if (acao === "editar") {
            setRegiao(formLocal.regiao);
            setSubpref([formLocal.subprefeitura_id])
        }
    }, [openFormLocal.open])

    const handleChangeRegiao = (valor) => {
        setRegiao(valor);
        setSubpref([])
    }

    const cancelar = () => {
        setOpenFormLocal({ ...openFormLocal, open: false });
        setErrors({});
    }

    const confirmar = () => {
        setErrors({});

        if (openFormLocal.acao === 'editar') {
            //setFormLocal({
            //    ...formLocal,
            //    subprefeitura_id: formLocal.subprefeitura_id,
            //    distrito_id: formLocal.distrito_id,
            //    unidade: formLocal.regiao
            //});
            setOpenConfirmacao({
                open: true,
                id: formLocal.id
            });
        }
    }

    return (
        <Dialog open={openFormLocal.open} fullWidth>
            <DialogTitle>
                {openFormLocal.acao === 'adicionar'
                    ? "Nova regionalização"
                    : "Editar regionalização"
                }
            </DialogTitle>

            <DialogContent>
                <Box
                    component="form"
                    id={formId}
                    className='grid gap-4 mt-4'
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        formData.append("contrato_id", formLocal.contrato_id)
                        console.log(formData)
                        openFormLocal.acao === 'adicionar' ? enviaLocal(formData) : editaLocal(formLocal.id, formData)
                    }}>

                    <FormControl 
                        error={errors.hasOwnProperty('regiao')}
                        fullWidth 
                        required
                    >
                        <InputLabel id="regiao-label">Região</InputLabel>
                        <Select
                            labelId="regiao-label"
                            id="regiao"
                            label="Região"
                            value={regiao}
                            name="regiao"
                            onChange={(e) => { handleChangeRegiao(e.target.value); }}
                            fullWidth
                        >
                            <MenuItem value={"CO"}>Centro-Oeste</MenuItem>
                            <MenuItem value={"L"}>Leste</MenuItem>
                            <MenuItem value={"N"}>Norte</MenuItem>
                            <MenuItem value={"S"}>Sul</MenuItem>
                        </Select>
                    <FormHelperText>{errors.regiao}</FormHelperText>
                    </FormControl>

                    <SubprefeituraInput 
                        regiao={regiao} 
                        selectedSub={subpref} 
                        onChange={ (value) => setSubpref( typeof value === 'string' ? value.split(',') : value) }
                    />

                    <DistritoInput subpref={subpref} defaultValue={formLocal?.distrito_id} />

                    <TextField
                        variant="outlined"
                        defaultValue={formLocal.unidade}
                        name="unidade"
                        label="Unidade"
                        error={errors.hasOwnProperty('unidade')}
                        helperText={errors.unidade}
                        fullWidth
                    />
                </Box>
                    
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button
                    onClick={cancelar}
                    sx={{ textTransform: 'none', mr: '1rem', color: (theme) => theme.palette.error.main }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                </Button>

                <Button
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    type={openFormLocal.acao === 'adicionar' ? 'submit' : ""}
                    form={openFormLocal.acao === 'adicionar' ? "local_form" : ""}
                    onClick={confirmar}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                    }

                    {openFormLocal.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormLocais;