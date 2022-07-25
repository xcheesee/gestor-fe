import React, { useEffect } from 'react';
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
    FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const FormRecursos = (props) => {
    const {
        openFormRecurso,
        setOpenFormRecurso,
        carregando,
        errors,
        setErrors,
        formRecurso,
        setFormRecurso,
        origemRecursos,
        enviaRecurso,
        setOpenConfirmacao
    } = props;

    const outrosDesc = formRecurso.origem_recurso_id === 999;

    const cancelar = () => {
        setOpenFormRecurso({ ...openFormRecurso, open: false });
        setErrors({});
        setFormRecurso({
            ...formRecurso,
            dotacao_id: '',
            origem_recurso_id: '',
            outros_descricao: ''
        });
    }

    const confirmar = () => {
        setErrors({});

        if (openFormRecurso.acao === 'adicionar') {
            enviaRecurso(formRecurso);
        } else if (openFormRecurso.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formRecurso.id,
                elemento: 'recurso'
            });
        }
    }

    return (
        <Dialog open={openFormRecurso.open} fullWidth>
            <DialogTitle>
                {openFormRecurso.acao === 'adicionar'
                    ? "Nova fonte de recurso"
                    : "Editar fonte de recurso"
                }
            </DialogTitle>

            <DialogContent>
                <FormControl
                    sx={{ margin: '1rem 0', position: 'relative' }}
                    error={errors.hasOwnProperty('origem_recurso_id')}
                    fullWidth
                    required
                >
                    <InputLabel id="dotacao_recurso-label">Fonte de recurso</InputLabel>

                    <Select
                        labelId="dotacao_recurso-label"
                        id="dotacao_recurso"
                        label="Fonte de recurso"
                        value={formRecurso.origem_recurso_id}
                        name="dotacao_recurso"
                        onChange={(e) => {
                            if (e.target.value !== 999) {
                                setFormRecurso({
                                    ...formRecurso,
                                    origem_recurso_id: e.target.value,
                                    outros_descricao: ""
                                });
                            } else {
                                setFormRecurso({
                                    ...formRecurso,
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
                    <FormHelperText>
                        {
                            errors.hasOwnProperty('origem_recurso_id')
                            ? errors.origem_recurso_id
                            : " "
                        }
                    </FormHelperText>
                </FormControl>
                
                {
                outrosDesc
                ?
                    <TextField 
                        variant="outlined"
                        value={formRecurso.outros_descricao}
                        name="outros_descricao"
                        onChange={(e) => {
                            setFormRecurso({
                                ...formRecurso,
                                outros_descricao: e.target.value
                            });
                        }}
                        label="Descrição"
                        sx={{ margin: '1rem 0' }}
                        error={errors.hasOwnProperty('outros_descricao')}
                        helperText={
                            errors.hasOwnProperty('outros_descricao')
                            ? errors.outros_descricao 
                            : "Descreva brevemente a fonte de recurso"
                        }
                        fullWidth
                        required
                    />
                :
                    ""
                }
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

                    {openFormRecurso.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormRecursos;