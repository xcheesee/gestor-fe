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
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { brlToFloat, formataValores } from '../../../../commom/utils/utils';
import { meses } from '../../../../commom/utils/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TabelaExecFin from '../TabelaExecFin';
import { getMesesExecutados, postMesesExecFin, throwableDeleteForm, throwableGetData } from '../../../../commom/utils/api';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../../../atomStore';
import { useErrorSnackbar } from '../../../../commom/utils/hooks';
import CampoValores from '../../../CampoValores';
import DialogDelete from '../../../DialogDelete';

function createTableRow(tipo, dados) {
    return [tipo, ...dados]
}

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

const FormEditExecFinanceira = ({
    openEditExecFinanceira,
    setOpenEditExecFinanceira,
    execucao,
    //setExecucao,
    //errors,
    setErrors,
    carregando,
    setCarregando,
    formId,
    numContrato
}) => {
    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)
    const errorSnackbar = useErrorSnackbar()

    const [excluir, setExcluir] = useState({
        id: '',
        open: false
    });
    const [openEditar, setOpenEditar] = useState(false);
    //const [tabelaRef, setTabelaRef] = useState()

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
            queryClient.invalidateQueries(['execucoes', numContrato])
            setSnackbar(prev => ({...prev, open: true, severity: "success", message: "Meses de execucao enviados.", color: "success"}))
            setOpenEditExecFinanceira(false)
        },
        onError: (e) => {
            errorSnackbar.Post(e)
        }
    })

    const cancelar = () => {
        setOpenEditExecFinanceira(false);
        setErrors({});
    }

    const confirmar = () => {
        setOpenEditar(true);
    }

    const tableData = [
        createTableRow('Reservas', ['10','10','','','','','','','','','','']),
        createTableRow('Aditamentos', ['20','20','','','','','','','','','','']),
        createTableRow('Reajustes', ['30','','','','','','','','','','','']),
        createTableRow('Empenhado', ['30','50','','','','','','','','','','']),
        createTableRow('Executado', ['40','40','','','','','','','','','','']),
        createTableRow('Saldo', ['40','40','','','','','','','','','','']),

    ]

    return (
        <>
        <DialogDelete
            open={excluir.open}
            setOpen={(bool) => setExcluir(prev => ({...prev, open: bool}))}
            tipo_op="Execucao Financeira"
            id={execucao.id}
            carregando={carregando}
            setCarregando={setCarregando}
            queryKey='execucoes'
            deletePath='exec_financeira'
            onSucc={() => setOpenEditExecFinanceira(false)}
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
                            let planejado = document.getElementById('planejado').value
                            let contratado = document.getElementById('contratado').value
                            planejado = brlToFloat(planejado)
                            contratado = brlToFloat(contratado)

                            //const execData = tabelaRef.getDataAtRow(4)
                            //const empenhadoData = tabelaRef.getDataAtRow(3)
                            const postExec = {
                                data_execucao: ['','','','','','','','','','','',''],
                                data_empenhado: ['','','','','','','','','','','','',''],
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

                    <Typography className="text-lg font-medium" component={'div'}>
                        Mes Inicial
                        <Typography className='text-xl font-light pl-4'>
                            { meses[execucao?.mes_inicial - 1] }
                        </Typography>
                    </Typography>
                </Box>

                {/*<Box 
                    sx={{  alignItems: 'center'}}
                    className='pt-8 px-8'
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
                </Box>*/}

                <TableContainer className='mt-4 rounded'>
                    <Table className="min-w-48  relative">
                        <TableHead>
                            <TableRow className='bg-[#3b948c] '>
                                <TableCell className='sticky left-0 z-10 bg-[#3b948c] text-white text-center'>-</TableCell>
                                {meses.map( (mes, i) => <TableCell key={i} className='text-white'>{mes}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map( (arr, i) => 
                                <TableRow key={`row-${i}`}>
                                    {arr.map( (dados, i) => {
                                        if(i === 0) {
                                            return <TableCell key={`cell-${i}`} className='font-bold text-white bg-[#3b948c] border-white sticky left-0 '>{dados}</TableCell>
                                        }
                                        return <TableCell key={`cell-${i}`} className='text-center'>{dados}</TableCell>
                                    })}
                                </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
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
                        onClick={() => setExcluir(prev => ({open: true, id: execucao.id}))}
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