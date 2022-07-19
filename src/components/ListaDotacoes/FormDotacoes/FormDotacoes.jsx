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
    Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CampoValores from '../../CampoValores';

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
        tipoDotacoes,
        setOpenConfirmacao
    } = props;

    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState({label: '', id: null});
    const [outrosDesc, setOutrosDesc] = useState(false);
    let tipos_dotacao = [];

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
                            id="dotacao_recurso"
                            label="Fonte de recurso"
                            value={formDotacao.origem_recurso_id}
                            name="dotacao_recurso"
                            onChange={(e) => {
                                if (e.target.value !== 999) {
                                    setFormDotacao({
                                        ...formDotacao,
                                        origem_recurso_id: e.target.value,
                                        outros_descricao: ""
                                    });
                                    setOutrosDesc(false);
                                } else {
                                    setFormDotacao({
                                        ...formDotacao,
                                        origem_recurso_id: 999
                                    });
                                    setOutrosDesc(true);
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
                                value={formDotacao.outros_descricao}
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
        setOutrosDesc(false);
    }

    const confirmar = () => {
        setErrors({});

        if (openFormDotacao.acao === 'adicionar') {
            enviaDotacao(formDotacao);
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
            setInputValue('');
            setValue({label: '', id: null});
            setOutrosDesc(false);
        } else if (openFormDotacao.acao === 'editar') {
            setErrors({});
            setInputValue('');
            setValue(retornaTipoDotacao(3));
            setOutrosDesc(false);
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
                <Autocomplete 
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
                            required
                        /> 
                    }
                    isOptionEqualToValue={(option, value) => option.value === value.value }
                />

                <CampoValores 
                    label="Valor"
                    value={formDotacao.valor_dotacao}
                    name="valor_dotacao"
                    required
                    state={formDotacao}
                    setState={setFormDotacao}
                    checaErros={() => {}}
                    helperText={
                        errors.hasOwnProperty('valor_dotacao')
                        ? errors.valor_dotacao
                        : " "
                    }
                    error={errors.hasOwnProperty('valor_dotacao')}
                    fullWidth 
                />
                
                <CamposRecurso />
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button
                    onClick={cancelar}
                    sx={{ textTransform: 'none', mr: '1rem', color: (theme) => theme.palette.error.main }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} /> Cancelar
                </Button>

                <Button
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={confirmar}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} /> 
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