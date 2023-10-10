import { Box, CircularProgress, Fade, Paper, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useState } from "react";
import { deleteReajuste, editReajusteContrato, getFormData, postFormData, postReajusteContrato, putFormData } from "../../commom/utils/api";
import { reajusteLabels } from "../../commom/utils/constants";
import { formataValores } from "../../commom/utils/utils";
import BotaoAdicionar from "../BotaoAdicionar";
import BotoesTab from "../BotoesTab";
import CampoValores from "../CampoValores";
import ContratoFormWrapper from "../ContratoFormWrapper";
import DialogConfirmacao from "../DialogConfirmacao";
import TabContrato from "../TabContrato";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";

export default function ListaReajustes ({ numContrato, /*setSnackbar*/ }) {
    let dados = []

    const setSnackbar = useSetAtom(snackbarAtom)

    const queryClient = useQueryClient()
    const dadosReajuste = useQuery({
        queryKey: ['reajuste', numContrato], 
        queryFn: () => getFormData(`reajustes/${numContrato}`)
    })

    const currDados = useRef({id: 0, valor_reajuste: "", indice_reajuste: ""})

    const [formDialog, setFormDialog] = useState(false)
    const [acao, setAcao] = useState("")
    const [openConfirmacao, setOpenConfirmacao] = useState({open: false, id: ""})
    const errors = ""

    const addReajuste = useMutation({
        mutationFn: async (formData) => {
                return await postReajusteContrato({formData})
        }, 
        onSuccess: async (res) => {
            setFormDialog(false)
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Reajuste criado com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries(['reajuste', numContrato])
        },
        onError: async (res) => {
            setFormDialog(false)
            setSnackbar({
                open: true,
                severity: 'error',
                message: 
                    <div>
                        Não foi possível enviar o Reajuste.
                        <br/>
                        Erro: {res.message}
                        <br />
                        {res.errors != null
                            ?Object.values(res.errors).map((error, i) => (<div key={`error-${i}`}>{i}. {error}<br/></div>))
                            :<></>
                        }
                    </div>,
                color: 'error'
            });
        }
    })
    const editReajuste = useMutation({
        mutationFn: async ({id, formData}) => await editReajusteContrato(id, formData), 
        onSuccess: async (res) => {
            setFormDialog(false)
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Reajuste editado com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries(['reajuste'])
        },
        onError: async (res) => {
            setOpenConfirmacao({open: false, id: ""})
            setSnackbar({
                open: true,
                severity: 'error',
                message: <div>Não foi possível editar o Reajuste<br/>Erro {res.message}</div>,
                color: 'error'
            });
        }
    })
    const deleteReajusteFn = useMutation({
        mutationFn: async (id) => {
            return await deleteReajuste(id)
        }, 
        onSuccess: async (res) => {
            setOpenConfirmacao({open: false, id: ""})
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Reajuste excluido com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries(['reajuste'])
        },
        onError: async (res) => {
            setOpenConfirmacao({open: false, id: ""})
            setSnackbar({
                open: true,
                severity: 'error',
                message: <div>Não foi possível excluir o Reajuste<br/>Erro {res.message}</div>,
                color: 'error'
            });
        }
    })
    async function handleEditPress (entry) {
        setAcao("editar")
        // const res = await getFormData(`reajuste/${entry.id}`)
        currDados.current = {
            id: entry.id, 
            valor_reajuste: entry.valor_reajuste, 
            indice_reajuste: entry.indice_reajuste
        }
        setFormDialog(true)
    }
    async function handleDeletePress (entry) {
        setAcao("excluir")
        // const res = await getFormData(`reajuste/${entry.id}`)
        currDados.current = { id: entry.id }
        setOpenConfirmacao({open: true, id: entry.id})
    }
    
    dados = dadosReajuste?.data?.data?.map((entry) => {
        return({
            id: entry.id,
            contrato_id: entry.contrato_id,
            valor_reajuste: formataValores(entry.valor_reajuste),
            indice_reajuste: `${entry.indice_reajuste}`
        })
    })

    return(
        <>
            {
                dadosReajuste.isLoading
                    ?<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                        <CircularProgress size={30} />
                    </Box>
                    :dados?.map((entry, index) => {
                        return(
                            <Fade in={true} timeout={400} key={`reajuste-${index}`}>
                                <Paper elevation={3} className="mb-8">
                                    <TabContrato 
                                        label="Reajuste" 
                                        dados={entry ?? []}
                                        labels={reajusteLabels}
                                    >
                                        <BotoesTab
                                            editar={() => handleEditPress(entry)}
                                            excluir={() => handleDeletePress(entry)}
                                        />
                                    </TabContrato>
                                </Paper>
                            </Fade>
                        )
                    })
            }
            <BotaoAdicionar
                fnAdicionar={() => {
                    setAcao("adicionar")
                    setFormDialog(true)
                }}
                texto={`Adicionar Reajuste`}
            />
            <ContratoFormWrapper
                open={formDialog}
                setFormDialog={setFormDialog}
                isLoading={addReajuste.isLoading || editReajuste.isLoading}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                currId={currDados.current.id}
                title="Reajuste"
                form="reajuste_form"
            >
                <Box
                    component='form'
                    id='reajuste_form'
                    onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        formData.append("contrato_id", numContrato)
                        acao === "adicionar" ? addReajuste.mutate(formData) : editReajuste.mutate({id: currDados.current.id, formData: formData})
                    }}
                >
                    <CampoValores
                        defaultValue={acao === "adicionar" ? "" : currDados.current.valor_reajuste}
                        name="valor_reajuste"
                        label={reajusteLabels.valor_reajuste}
                        checaErros={() => {}}
                        error={errors.hasOwnProperty('valor_reajuste')}
                        helperText={errors.hasOwnProperty('valor_reajuste') ? errors : "Ex: "}
                        fullWidth
                        required
                    />
                    <TextField
                        variant="outlined"
                        defaultValue={acao === "adicionar" ? "" : currDados.current.indice_reajuste}
                        name="indice_reajuste"
                        label={reajusteLabels.indice_reajuste}
                        sx={{ margin: '1rem 0' }}
                        error={errors.hasOwnProperty('indice_reajuste')}
                        helperText={errors.hasOwnProperty('indice_reajuste') ? errors : "Ex: "}
                        fullWidth
                        required
                    />
                </Box>
            </ContratoFormWrapper>
            <DialogConfirmacao 
                openConfirmacao={openConfirmacao}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                fnExcluir={id => deleteReajusteFn.mutate(id)}
                texto={"Reajuste"}
                carregando={
                    acao === "editar" 
                    ? editReajuste.isLoading 
                    : acao === "excluir" 
                        ? deleteReajusteFn.isLoading 
                        : false
                }
                form="reajuste_form"
            />
        </>
    )
}