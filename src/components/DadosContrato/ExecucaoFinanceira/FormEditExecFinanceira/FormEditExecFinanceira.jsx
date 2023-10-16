import React, { useState } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    CircularProgress,
    Typography,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { formataValores } from '../../../../commom/utils/utils';
import { meses } from '../../../../commom/utils/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TabelaExecFin from '../TabelaExecFin';
import { getMesesExecutados, postMesesExecFin } from '../../../../commom/utils/api';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../../../atomStore';
import { useErrorSnackbar } from '../../../../commom/utils/hooks';


function DialogEditar ({openEditar, setOpenEditar, formId, carregando}) {
    return (
        <Dialog open={openEditar}>
            <DialogTitle>
                Confirmação de edição
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Confirma a edição do ano de execução financeira 
                    <strong> {/*meses[execucaoEditado.mes - 1]} de {execucaoEditado.ano*/}</strong>?
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button 
                    sx={{ 
                        textTransform: 'none', 
                        color: (theme) => theme.palette.error.main 
                    }}
                    onClick={() => setOpenEditar(false)}
                >
                    Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    type='submit'
                    onClick={() => setOpenEditar(false)}
                    form={formId}
                >
                    {
                        carregando
                        ? <CircularProgress sx={{ mr: '0.3rem' }} size="0.7rem" />
                        : ""
                    }
                    Editar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function DialogExcluir({openExcluir, setOpenExcluir, carregando}) {
    return(
        <Dialog open={openExcluir}>
            <DialogTitle>
                Excluir mês de execução financeira
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Confirma a exclusão do ano de execucao financeira 
                    <strong> {}</strong>?
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button 
                    sx={{ 
                        textTransform: 'none', 
                        color: (theme) => theme.palette.error.main 
                    }}
                    onClick={() => setOpenExcluir(false)}
                >
                    Cancelar
                </Button>

                <Button 
                    sx={{ textTransform: 'none' }} 
                    //onClick={excluiMes}
                >
                    {
                        carregando
                        ? <CircularProgress sx={{ mr: '0.3rem' }} size="0.7rem" />
                        : ""
                    }
                    Excluir
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const FormEditExecFinanceira = ({
    openEditExecFinanceira,
    setOpenEditExecFinanceira,
    execucao,
    //setExecucao,
    errors,
    setErrors,
    carregando,
    formId
}) => {
    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const [openExcluir, setOpenExcluir] = useState(false);
    const [openEditar, setOpenEditar] = useState(false);
    const [tabelaRef, setTabelaRef] = useState()

    const mesesExecutados = useQuery({
        queryKey: ['mesesExecutados', execucao.id],
        queryFn: () => getMesesExecutados(execucao.id),
        enabled: !!execucao.id
    })

    const addMesExec = useMutation({
        mutationFn: ({execucao}) => postMesesExecFin({ execucao }),
        onSuccess: () => {
            queryClient.invalidateQueries(['mesesExecutados', execucao.id])
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Meses de execucao enviados."}))
            setOpenEditExecFinanceira(false)
        },
        onError: (e) => {
            errorSnackbar.Post(e)
            //setSnackbar(prev => ({...prev, open: true, severity: "error", message: `Meses de execucao nao enviados.${e.message}`}))
        }
    })

    const cancelar = () => {
        setOpenEditExecFinanceira(false);
        setErrors({});
        //setExecucao({})
    }

    const confirmar = () => {
        setOpenEditar(true);
    }

    const handleClickExcluir = () => {
        setOpenExcluir(true);
    }

    //const excluiMes = () => {
    //    const url = `${process.env.REACT_APP_API_URL}/execucao_financeira/${formExecFinanceira.id}`;
    //    const token = localStorage.getItem('access_token');
    //    const options = {
    //        method: 'DELETE',
    //        headers: {
    //            'Content-Type': 'application/json',
    //            'Accept': 'application/json',
    //            'Authorization': `Bearer ${token}`
    //        }
    //    };

    //    setCarregando(true);
    //    setOpenExcluir(false);

    //    fetch(url, options)
    //        .then(res => {
    //            if (res.ok) {
    //                setCarregando(false);
    //                setSnackbar({
    //                    open: true,
    //                    severity: 'success',
    //                    text: 'Mês de execução excluído com sucesso!',
    //                    color: 'success'
    //                });
    //                setMudancaContrato(!mudancaContrato);
    //                setOpenEditExecFinanceira(false);
    //                return res.json();
    //            } else {
    //                setCarregando(false);
    //                setSnackbar({
    //                    open: true,
    //                    severity: 'error',
    //                    text: `Erro ${res.status} - Não foi possível excluir o mês de execução`,
    //                    color: 'error'
    //                });
    //                setOpenEditExecFinanceira(false);
    //            }
    //        })
    //        .catch(err => console.log(err));
    //}

    //if(execucao.isLoading) 
    //    return (
    //        <Box>
    //            <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
    //        </Box>
    //    )


    return (
        <>
        <DialogExcluir 
            openExcluir={openExcluir}
            setOpenExcluir={setOpenExcluir}
            carregando={carregando}
        />

        <DialogEditar 
            openEditar={openEditar} 
            setOpenEditar={setOpenEditar} 
            carregando={carregando} 
            formId={formId} 
        />

        <Dialog open={openEditExecFinanceira} fullWidth maxWidth="md">
            <DialogTitle>
                Editar ano de execução financeira
            </DialogTitle>

            <DialogContent>
                <Box className="grid grid-cols-2 gap-8 px-4">
                    <Typography className="text-lg font-medium" component={'div'}>
                        Planejado(LOA)
                        <Typography className='text-xl font-light pl-4'>
                            {formataValores(execucao?.planejado)}
                        </Typography>
                    </Typography>
                    

                    <Typography className="text-lg font-medium" component={'div'}>
                        Reservado
                        <Typography className='text-xl font-light pl-4'>
                            {formataValores(execucao?.reservado)}
                        </Typography>
                    </Typography>


                    <Typography className="text-lg font-medium" component={'div'}>
                        Contratado
                        <Typography className='text-xl font-light pl-4'>
                            {formataValores(execucao?.contratado)}
                        </Typography>
                    </Typography>

                    <Typography className="text-lg font-medium" component={'div'}>
                        Mes Inicial
                        <Typography className='text-xl font-light pl-4'>
                            { meses[execucao?.mes_inicial] }
                        </Typography>
                    </Typography>
                </Box>

                    <Box 
                        sx={{  alignItems: 'center'}}
                        className='pt-8 px-8'
                        component={'form'}
                        id={formId}
                        onSubmit={async (e) => {
                            e.preventDefault()

                            const execData = tabelaRef.getDataAtRow(4)
                            const postExec = {
                                data: execData,
                                id_ano_execucao: execucao.id
                            }
                            addMesExec.mutate({execucao: postExec}) 
                        }}
                    >
                        {mesesExecutados.isLoading
                            ?<Box className="w-full h-52 flex justify-center items-center">
                                <CircularProgress size={32} sx={{ color: 'gray' }} />
                            </Box>
                            :<TabelaExecFin 
                                id="hotExec" 
                                execucao={execucao}
                                setTabelaRef={setTabelaRef}
                                mesesExecutados={mesesExecutados?.data}
                            />
                        }
                    </Box>
            </DialogContent>

            <DialogActions 
                sx={{ 
                    margin: '1rem', 
                    display: 'flex', 
                    justifyContent: 'space-between' 
                }}
            >
                <Tooltip title="Excluir mês" placement="top" arrow>
                    <Button 
                        sx={{ textTransform: 'none' }}
                        variant="contained"
                        color="error"
                        onClick={handleClickExcluir}
                    >
                        <DeleteIcon />
                    </Button>
                </Tooltip>

                <Box>
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
                        {addMesExec.isLoading
                            ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                            : <CheckIcon sx={{ mr: '0.2rem' }} fontSize="small" /> 
                        }

                        Editar
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
        </>
    );
}

export default FormEditExecFinanceira;