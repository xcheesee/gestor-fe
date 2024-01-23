import React, { useState } from 'react';
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
    FormHelperText,
    TextField,
    Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import CampoValores from '../../CampoValores';
import { meses } from '../../../commom/utils/constants';
import CampoAno from '../../CampoAno';

const FormNotaEmpenho = (props) => {
    const { 
        formNotaEmpenho, 
        //setFormNotaEmpenho, 
        openFormNotaEmpenho, 
        setOpenFormNotaEmpenho, 
        enviaNotaEmpenho,
        editaNotaEmpenho,
        carregando,
        setOpenConfirmacao,
        errors,
        formId
    } = props;

    const [dataEmissao, setDataEmissao] = useState(formNotaEmpenho.data_emissao ?? "")
    const arrData = dataEmissao?.split('-') ?? ""
    const [mesReferencia, setMesReferencia] = useState(+arrData[1]-1 ?? "")
    const [anoReferencia, setAnoReferencia] = useState(+arrData[0] ?? "")

    const handleClickConfirmar = () => {
        if (openFormNotaEmpenho.acao === 'adicionar') {
        } else if (openFormNotaEmpenho.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formNotaEmpenho.id
            });
        }
    }

    return (
        <Dialog open={openFormNotaEmpenho.open} fullWidth>
            <DialogTitle>
                {openFormNotaEmpenho.acao === 'adicionar'
                    ? "Nova nota de empenho"
                    : "Editar nota de empenho"
                }
            </DialogTitle>

            <DialogContent>
                <Box
                    className='grid gap-4 py-2'
                    component="form"
                    id={formId}
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        formData.append("contrato_id", formNotaEmpenho.contrato_id)
                        openFormNotaEmpenho.acao === 'adicionar' ? enviaNotaEmpenho(formData) : editaNotaEmpenho(formNotaEmpenho.id, formData)
                    }}>

                    <FormControl 
                        error={errors.hasOwnProperty('tipo_empenho')}
                        fullWidth 
                        required
                    >
                        <InputLabel id="tipo_empenho-label">Tipo de Empenho</InputLabel>
                        <Select
                            labelId="tipo_empenho-label"
                            id="tipo_empenho"
                            label="Tipo de Empenho"
                            defaultValue={formNotaEmpenho.tipo_empenho}
                            name="tipo_empenho"
                            fullWidth
                            required
                        >
                            <MenuItem value={"complemento"}>Complemento</MenuItem>
                            <MenuItem value={"cancelamento"}>Cancelamento</MenuItem>
                            <MenuItem value={"novo_empenho"}>Novo Empenho</MenuItem>
                        </Select>
                    <FormHelperText>{errors.tipo_empenho}</FormHelperText>
                    </FormControl>

                    <TextField
                        label="Data de Emissão da Nota"
                        type='date'
                        name="data_emissao"
                        value={dataEmissao}
                        onChange={(e) => {
                            setDataEmissao(e.target.value)
                            const arrData = e.target.value?.split("-")
                            setMesReferencia(+arrData[1]-1)
                            setAnoReferencia(+arrData[0])
                        }}
                        error={errors.hasOwnProperty('data_emissao')}
                        helperText={errors.data_emissao}
                        InputLabelProps={{ shrink: true}}
                        fullWidth
                        required
                    />

                    <TextField
                        select
                        fullWidth
                        label="Mes de Referencia"
                        name='mes_referencia'
                        value={mesReferencia}
                        onChange={(e) => {
                            setMesReferencia(e.target.value)
                        }}
                        //defaultValue={2}
                    >
                        {meses.map((mes, i) => {
                            return(
                                <MenuItem key={`mes-ref-${i}`} value={i} className=''>{mes}</MenuItem>

                            )
                        })}
                    </TextField>

                    <CampoAno
                        label="Ano de Referencia"
                        fullWidth
                        value={anoReferencia}
                        onChange={(e) => {
                            setAnoReferencia(e.target.value)
                        }}
                        name="ano_referencia"
                    />

                    <TextField
                        variant="outlined"
                        defaultValue={formNotaEmpenho.numero_nota}
                        name="numero_nota"
                        label="Número da Nota de Empenho"
                        //sx={{ margin: '1rem 0' }}
                        error={errors.hasOwnProperty('numero_nota')}
                        helperText={errors.hasOwnProperty('numero_nota') ? errors.numero_nota : "Ex: 1234"}
                        fullWidth
                        required
                    />

                    <CampoValores
                        label="Valor de empenho"
                        defaultValue={formNotaEmpenho.valor_empenho}
                        name="valor_empenho"
                        checaErros={() => {}}
                        error={errors.hasOwnProperty('valor_garantia')}
                        helperText={errors.valor_empenho}
                        required
                        fullWidth
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button 
                    onClick={() => { 
                        setOpenFormNotaEmpenho({ ...openFormNotaEmpenho, open: false }); 
                        setDataEmissao("")
                        setMesReferencia("")
                        setAnoReferencia("")
                    }}
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} fontSize="small" /> Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={handleClickConfirmar}  
                    form={openFormNotaEmpenho.acao === 'adicionar' ? "empenho_form" : ""} 
                    type={openFormNotaEmpenho.acao === 'adicionar' ? "submit" : ""}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                    }
                    
                    {openFormNotaEmpenho.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormNotaEmpenho;