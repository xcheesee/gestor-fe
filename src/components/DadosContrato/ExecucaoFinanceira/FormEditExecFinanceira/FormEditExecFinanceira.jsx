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
    TextField,
    InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { formataValores } from '../../../../commom/utils/utils';
import { meses } from '../../../../commom/utils/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TabelaExecFin from '../TabelaExecFin';
import { getMesesExecutados, postMesesExecFin, throwableDeleteForm, throwableGetData } from '../../../../commom/utils/api';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../../../atomStore';
import { useErrorSnackbar } from '../../../../commom/utils/hooks';
import CampoValores from '../../../CampoValores';


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

function DialogExcluir({openExcluir, setOpenExcluir, carregando, excluirAno}) {
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
                    onClick={excluirAno}
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
    //errors,
    setErrors,
    carregando,
    formId,
    numContrato
}) => {
    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const [openExcluir, setOpenExcluir] = useState(false);
    const [openEditar, setOpenEditar] = useState(false);
    const [tabelaRef, setTabelaRef] = useState()

    const dadosExecucao = useQuery({
        queryKey: ['mesesExecutados', execucao.id],
        queryFn: async () => {
            const [executados, notasAditReaj] = await Promise.all([
                getMesesExecutados(execucao.id),
                throwableGetData({path: 'exec_valores_meses', contratoId: execucao.id})
            ])
            return {exec: executados, aditamentos: notasAditReaj.aditamentos, notasEmpenho: notasAditReaj.empenhos, reajustes: notasAditReaj.reajustes}
        },
        enabled: !!execucao.id
    })

    const addMesExec = useMutation({
        mutationFn: ({execucao}) => postMesesExecFin({ execucao }),
        onSuccess: () => {
            queryClient.invalidateQueries(['mesesExecutados', execucao.id])
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Meses de execucao enviados.", color: "success"}))
            setOpenEditExecFinanceira(false)
        },
        onError: (e) => {
            errorSnackbar.Post(e)
        }
    })

    const excluiAno = useMutation({
        mutationFn: ({idExecucao}) => throwableDeleteForm({id: idExecucao, path: 'exec_financeira'}),
        onSuccess: () => {
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Meses de execucao excluidos.", color: "success"}))
            queryClient.invalidateQueries(['execucoes', numContrato]) 
            setOpenEditExecFinanceira(false)
            setOpenExcluir(false)
        },
        onError: (e) => {
            errorSnackbar.Delete(e)
        }
    })

    function excluirAno (idExecucao) {
        excluiAno.mutate({idExecucao})
    }

    const cancelar = () => {
        setOpenEditExecFinanceira(false);
        setErrors({});
    }

    const confirmar = () => {
        setOpenEditar(true);
    }

    const handleClickExcluir = () => {
        setOpenExcluir(true);
    }

    return (
        <>
        <DialogExcluir 
            openExcluir={openExcluir}
            setOpenExcluir={setOpenExcluir}
            carregando={excluiAno.isLoading}
            excluiAno={() => excluirAno(execucao.id)}
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
                <Box className="grid grid-cols-2 gap-8 px-4 py-2"

                        component={'form'}
                        id={formId}
                        onSubmit={async (e) => {
                            e.preventDefault()
                            const planejado = document.getElementById('planejado').value
                            const contratado = document.getElementById('contratado').value

                            const execData = tabelaRef.getDataAtRow(4)
                            const empenhadoData = tabelaRef.getDataAtRow(3)
                            const postExec = {
                                data_empenhado: empenhadoData,
                                data_execucao: execData,
                                id_ano_execucao: execucao.id,
                                contratado: contratado,
                                planejado: planejado
                            }
                            addMesExec.mutate({execucao: postExec}) 
                        }}
                >
                    <CampoValores
                        defaultValue={execucao?.planejado}
                        label="Planejado(LOA)"
                        prefix="R$ "
                        name="planejado"
                        id="planejado"
                    />
                    {/*<Typography className="text-lg font-medium" component={'div'}>
                        Planejado(LOA)
                        <Typography className='text-xl font-light pl-4'>
                            {formataValores(execucao?.planejado)}
                        </Typography>
                    </Typography>*/}
                    

                    <Typography className="text-lg font-medium" component={'div'}>
                        Reservado
                        <Typography className='text-xl font-light pl-4'>
                            {formataValores(execucao?.reservado)}
                        </Typography>
                    </Typography>

                    <CampoValores
                        defaultValue={execucao?.contratado}
                        label="Contratado"
                        prefix="R$ "
                        name="contratado"
                        id="contratado"
                    />
                    {/*<Typography className="text-lg font-medium" component={'div'}>
                        Contratado
                        <Typography className='text-xl font-light pl-4'>
                            {formataValores(execucao?.contratado)}
                        </Typography>
                    </Typography>*/}

                    <Typography className="text-lg font-medium" component={'div'}>
                        Mes Inicial
                        <Typography className='text-xl font-light pl-4'>
                            { meses[execucao?.mes_inicial - 1] }
                        </Typography>
                    </Typography>
                </Box>

                    <Box 
                        sx={{  alignItems: 'center'}}
                        className='pt-8 px-8'
                        /*component={'form'}
                        id={formId}
                        onSubmit={async (e) => {
                            e.preventDefault()

                            const execData = tabelaRef.getDataAtRow(4)
                            const empenhadoData = tabelaRef.getDataAtRow(3)
                            const postExec = {
                                data_empenhado: empenhadoData,
                                data_execucao: execData,
                                id_ano_execucao: execucao.id
                            }
                            addMesExec.mutate({execucao: postExec}) 
                        }}
                        */
                    >
                        {dadosExecucao.isLoading
                            ?<Box className="w-full h-52 flex justify-center items-center">
                                <CircularProgress size={32} sx={{ color: 'gray' }} />
                            </Box>
                            :<TabelaExecFin 
                                id="hotExec" 
                                execucao={execucao}
                                tabelaRef={tabelaRef}
                                setTabelaRef={setTabelaRef}
                                dadosExecucao={dadosExecucao?.data}
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
                <Tooltip title="Excluir ano" placement="top" arrow>
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