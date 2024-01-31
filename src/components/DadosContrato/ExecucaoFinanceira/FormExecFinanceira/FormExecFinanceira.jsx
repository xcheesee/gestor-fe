import React, { useEffect } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CampoAno from '../../../CampoAno';
import CampoValores from '../../../CampoValores';
import { meses } from '../../../../commom/utils/constants';
import { postAnoExecFin } from '../../../../commom/utils/api';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../../../atomStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorSnackbar } from '../../../../commom/utils/hooks';

const FormExecFinanceira = (props) => {
    const {
        openFormExecFinanceira,
        setOpenFormExecFinanceira,
        errors,
        setErrors,
        //carregando,
        setOpenConfirmacao,
        formId,
        contratoId
    } = props;
    const queryClient = useQueryClient()
    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar =   useErrorSnackbar()

    useEffect(() => {
        setErrors({});
    }, [openFormExecFinanceira.open, setErrors]);

    const cancelar = () => {
        setOpenFormExecFinanceira({
            open: false,
            acao: 'adicionar'
        });
    }

    const postNewAno = useMutation({
        mutationFn: async ({formData}) => await postAnoExecFin(formData),
        onSuccess: () => {
            setSnackbar(prev => ({...prev, open: true, severity:"success", message: "Ano de execucao enviado."}))
            queryClient.invalidateQueries(['execucoes', contratoId])
            setOpenFormExecFinanceira(false)
        },
        onError: (e) => {
            errorSnackbar.Post(e)
        }
    })

    const confirmar = () => {
        if (openFormExecFinanceira.acao === 'adicionar') {
            setOpenConfirmacao({
                open: true,
                //id: formExecFinanceira.id
            });
        }
    }

    return (
        <Dialog open={openFormExecFinanceira.open} fullWidth maxWidth="md">
            <DialogTitle>
                Novo ano de execução financeira
            </DialogTitle>

            <DialogContent>
                <Box 
                    sx={{ display: 'grid'}}
                    className='py-2'
                    component="form"
                    id={formId}
                    onSubmit={async (e) => {
                        e.preventDefault() 
                        const formData = new FormData(e.target)
                        formData.append('id_contrato', contratoId)
                        postNewAno.mutate({formData})
                    }}
                >
                    <CampoAno 
                        label="Ano"
                        name="ano"
                        id="ano"
                        //onChange={handleChange}
                        error={errors.hasOwnProperty('ano')}
                        helperText={errors.hasOwnProperty('ano') ? errors.ano : " "}
                        required
                    />

                    <FormControl sx={{ margin: '1rem 0', mr: '1rem' }} required fullWidth>
                        <InputLabel id="ano-label">Mês inicial</InputLabel>
                        <Select
                            labelId="mes-label"
                            id="mes_inicial"
                            label="Mês inicial"
                            name="mes_inicial"
                            //value={formExecFinanceira.mes}
                            //onChange={handleChange}
                            error={errors.hasOwnProperty('mes_inicial')}
                        >
                            {meses.map((mes, index) => {
                                return (
                                    <MenuItem key={index} value={index + 1}>{mes}</MenuItem>
                                );
                            })}
                        </Select>

                        <FormHelperText>{errors.hasOwnProperty('mes_inicial') ? errors.mes_inicial : " "}</FormHelperText>
                    </FormControl>

                    <CampoValores 
                        label="Planejado(LOA)" 
                        name="planejado"
                        required
                        //helperText={errors.hasOwnProperty('planejado_inicial') ? errors.planejado_inicial : " "}
                        //error={errors.hasOwnProperty('planejado_inicial')}
                        fullWidth 
                    />

                    <CampoValores 
                        label="Contratado" 
                        name="contratado"
                        required
                        //helperText={errors.hasOwnProperty('contratado_inicial' ? errors.contratado_inicial : " ")}
                        //error={errors.hasOwnProperty('contratado_inicial')}
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
                    onClick={confirmar}
                >
                    {postNewAno.isLoading
                        ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                    }

                    {openFormExecFinanceira.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormExecFinanceira;