import React, { useState } from 'react';
import { 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    TextField,
    Box,
} from '@mui/material';
import CampoValores from '../../CampoValores';
import { meses } from '../../../commom/utils/constants';
import CampoAno from '../../CampoAno';
import FormDialog from '../../FormDialog';

const FormNotaEmpenho = (props) => {
    const { 
        formNotaEmpenho, 
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
    const [mesReferencia, setMesReferencia] = useState(formNotaEmpenho.mes_referencia ?? "")
    const [anoReferencia, setAnoReferencia] = useState(formNotaEmpenho.ano_referencia ?? "")

    const handleClickConfirmar = () => {
        //if (openFormNotaEmpenho.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formNotaEmpenho.id
            });
        //}
    }

    return (
        <FormDialog
            open={openFormNotaEmpenho}
            setOpen={setOpenFormNotaEmpenho}
            title={openFormNotaEmpenho.acao === 'editar' ? 'Editar Nota de Empenho' : 'Nova Nota de Empenho'}
            //formId={formId}
            acao={openFormNotaEmpenho.acao === 'editar' ? 'Editar' : 'Enviar'}
            carregando={carregando}
            onClick={handleClickConfirmar}
        >
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
                    error={errors?.hasOwnProperty('tipo_empenho')}
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
                <FormHelperText>{errors?.tipo_empenho}</FormHelperText>
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
                    helperText={errors?.data_emissao}
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
                    error={errors?.hasOwnProperty('numero_nota')}
                    helperText={errors?.numero_nota ??  "Ex: 1234"}
                    fullWidth
                    required
                />

                <CampoValores
                    label="Valor de empenho"
                    defaultValue={formNotaEmpenho.valor_empenho}
                    name="valor_empenho"
                    checaErros={() => {}}
                    error={errors?.hasOwnProperty('valor_garantia')}
                    helperText={errors?.valor_empenho}
                    required
                    fullWidth
                />
            </Box>
        </FormDialog>
    );
}

export default FormNotaEmpenho;