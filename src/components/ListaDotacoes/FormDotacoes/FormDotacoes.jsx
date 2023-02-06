import React, { useEffect, useRef, useState } from 'react';
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
    Autocomplete,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CampoTipoDotacao from '../../CampoTipoDotacao';

const FormDotacoes = (props) => {
    const {
        carregando,
        openFormDotacao,
        setOpenFormDotacao,
        errors,
        setErrors,
        formDotacao,
        setFormDotacao,
        numContrato,
        origemRecursos,
        enviaDotacao,
        editaDotacao,
        tipoDotacoes,
        setOpenConfirmacao
    } = props;

    const [inputValue, setInputValue] = useState('Não se Aplica');
    const [value, setValue] = useState({label: 'Não se Aplica', id: 999});
    const outrosDesc = formDotacao.origem_recurso_id === 999;
    let tipos_dotacao = [{
        label: `Não se Aplica`,
        id: null
    }];
    const CamposRecurso = () => {
        if (openFormDotacao.acao === 'adicionar') {
            return (
                <>
                    <FormControl
                        sx={{ margin: '1rem 0', position: 'relative' }}
                        error={errors.hasOwnProperty('dotacao_recurso')}
                        fullWidth
                        required
                    >
                        <InputLabel id="dotacao_recurso-label">Fonte de recurso</InputLabel>

                        <Select
                            labelId="dotacao_recurso-label"
                            id="origem_recurso_id"
                            label="Fonte de recurso"
                            value={formDotacao.origem_recurso_id ?? ""}
                            name="origem_recurso_id"
                            onChange={(e) => {
                                if (e.target.value !== 999) {
                                    setFormDotacao({
                                        ...formDotacao,
                                        origem_recurso_id: e.target.value,
                                        outros_descricao: ""
                                    });
                                } else {
                                    setFormDotacao({
                                        ...formDotacao,
                                        origem_recurso_id: 999
                                    });
                                }
                            }}
                            fullWidth
                        >
                            {origemRecursos.map((origemRecurso, index) => {
                                return (
                                    <MenuItem key={index} value={origemRecurso.id}>{origemRecurso.nome}</MenuItem>
                                );
                            })}
                        </Select>
                        <FormHelperText> </FormHelperText>
                    </FormControl>
                    
                    {
                        outrosDesc === true
                        ?
                            <TextField 
                                variant="outlined"
                                defaultValue={formDotacao.outros_descricao ?? ""}
                                name="outros_descricao"
                                onChange={(e) => {
                                    setFormDotacao({
                                        ...formDotacao,
                                        outros_descricao: e.target.value
                                    });
                                }}
                                label="Descrição"
                                sx={{ margin: '1rem 0' }}
                                helperText="Descreva brevemente a fonte de recurso"
                                fullWidth
                                required
                            />
                        :
                            ""
                    }
                </>
            );
        } else if (openFormDotacao.acao === 'editar') {
            return ("");
        }
    }

    const retornaTipoDotacao = (id) => {
        let index = tipos_dotacao.findIndex(x => x.id === id);
        let tipoDotacao = tipos_dotacao[index];

        return tipoDotacao;
    }

    const cancelar = () => {
        setOpenFormDotacao({ ...openFormDotacao, open: false });
        setErrors({});
        setFormDotacao({
            ...formDotacao,
            dotacao_tipo_id: '',
            contrato_id: numContrato,
            valor_dotacao: '',
            origem_recurso_id: '',
            outros_descricao: ''
        });
        setInputValue('');
        setValue({label: '', id: null});
    }

    const confirmar = () => {
        setErrors({});

        if (openFormDotacao.acao === 'adicionar') {
        } else if (openFormDotacao.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formDotacao.id,
                elemento: 'dotacao'
            });
        }
    }

    useEffect(() => {
        tipoDotacoes.forEach(tipoDotacao => {
            tipos_dotacao.push({
                label: 
                    `${tipoDotacao.numero_dotacao} | ${tipoDotacao.descricao} | ${tipoDotacao.tipo_despesa}`,
                id: tipoDotacao.id
            });
        })
    });

    useEffect(() => {
        if (openFormDotacao.acao === 'adicionar') {
            setErrors({});
            setFormDotacao({
                ...formDotacao,
                dotacao_tipo_id: '',
                contrato_id: numContrato,
                valor_dotacao: '',
                origem_recurso_id: '',
                outros_descricao: ''
            });
            setInputValue('Não se Aplica');
            setValue({label: 'Não se Aplica', id: null});
        } else if (openFormDotacao.acao === 'editar') {
            setErrors({});
            setInputValue('');
            setValue(retornaTipoDotacao(3));
        }
    }, [openFormDotacao.open])

    return (
        <Dialog open={openFormDotacao.open} fullWidth>
            <DialogTitle>
                {openFormDotacao.acao === 'adicionar'
                    ? "Nova dotação"
                    : "Editar dotação"
                }
            </DialogTitle>
        
            <DialogContent>
                <Box
                    component="form"
                    id="dotacao_form"
                    className='flex flex-col gap-4 mt-4'
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        formData.append("contrato_id", numContrato)
                        formData.append("dotacao_tipo_id", formDotacao.dotacao_tipo_id)
                        console.log(formData, formDotacao)
                        openFormDotacao.acao === 'adicionar' ?  enviaDotacao(formData) : editaDotacao(formDotacao.id, formData)
                        
                    }}>
                    <CampoTipoDotacao dotacao={formDotacao} setDotacao={setFormDotacao}/>
                    {/* <Autocomplete 
                        value={value}
                        options={tipos_dotacao}
                        onChange={(e, newValue) => {
                            if (newValue !== null) {
                                setValue(newValue);
                                setFormDotacao({
                                    ...formDotacao,
                                    dotacao_tipo_id: newValue.id
                                });
                            } else {
                                setValue({label: '', id: null});
                                setFormDotacao({
                                    ...formDotacao,
                                    dotacao_tipo_id: ''
                                });
                            }
                        }}
                        inputValue={inputValue}
                        onInputChange={(e, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        renderInput={(params) => 
                            <TextField 
                                {...params}
                                label="Tipo de dotação"
                                helperText={
                                    errors.hasOwnProperty('dotacao_tipo_id')
                                    ? errors.dotacao_tipo_id
                                    : "Número da dotação (com pontos), descrição ou tipo de despesa"
                                }
                                error={errors.hasOwnProperty('dotacao_tipo_id')}
                                sx={{ margin: '1rem 0' }}
                            /> 
                        }
                        isOptionEqualToValue={(option, value) => option.value === value.value }
                    /> */}
                <CamposRecurso />
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
                    onClick={() => confirmar()}
                    form={openFormDotacao.acao === 'adicionar' ? "dotacao_form" : ""}
                    type={openFormDotacao.acao === 'adicionar' ? "submit" : ""}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                    }

                    {openFormDotacao.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormDotacoes;