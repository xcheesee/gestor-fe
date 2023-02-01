import { Box, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useState } from "react";
import { deleteReajuste, getFormData, postFormData, putFormData } from "../../commom/utils/api";
import { formataValores } from "../../commom/utils/utils";
import BotaoAdicionar from "../BotaoAdicionar";
import CampoValores from "../CampoValores";
import ContratoFormWrapper from "../ContratoFormWrapper";
import DialogConfirmacao from "../DialogConfirmacao";
import TabContrato from "../TabContrato";

export default function ListaReajustes ({ numContrato, setSnackbar }) {
    let dados = []

    const queryClient = useQueryClient()
    const dadosReajuste = useQuery({queryKey: ['reajuste', numContrato], queryFn: () => getFormData(`reajustes/${numContrato}`)})

    const currDados = useRef({id: 0, valor_reajuste: "300", indice_reajuste: "5"})
    const [formDialog, setFormDialog] = useState(false)
    const [acao, setAcao] = useState("")
    const [openConfirmacao, setOpenConfirmacao] = useState({open: false, id: ""})
    const errors = ""

    const addReajuste = useMutation({
        mutationFn: async (formData) => {
                return await postFormData(formData, "reajuste")
        }, onSuccess: async (res) => {
            setFormDialog(false)
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Reajuste criado com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries(['reajuste'])
        }
    })
    const editReajuste = useMutation({
        mutationFn: async ({id, formData}) => {
                return await putFormData(id, formData, "reajuste")
        }, onSuccess: async (res) => {
            setFormDialog(false)
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Reajuste editado com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries(['reajuste'])
        }
    })
    const deleteReajusteFn = useMutation({
        mutationFn: async (id) => {
            return await deleteReajuste(id)
        }, onSuccess: async (res) => {
            setOpenConfirmacao({open: false, id: ""})
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Reajuste excluido com sucesso!',
                color: 'success'
            });
            queryClient.invalidateQueries(['reajuste'])
        }
    })
    async function handleEditPress (id) {
        setAcao("editar")
        const res = await getFormData(`reajuste/${id}`)
        currDados.current = {id: res.data.id, valor_reajuste: res.data.valor_reajuste, indice_reajuste: res.data.indice_reajuste}
        setFormDialog(true)
    }
    async function handleDeletePress (id) {
        setAcao("excluir")
        const res = await getFormData(`reajuste/${id}`)
        currDados.current = { id: res.data.id }
        setOpenConfirmacao({open: true, id: res.data.id})
    }
    
    dados = dadosReajuste?.data?.data?.map((entry) => {
        return({
            id: entry.id,
            contrato_id: entry.contrato_id,
            valor_reajuste: formataValores(entry.valor_reajuste),
            indice_reajuste: `${entry.indice_reajuste}%`
        })
    })

    return(
        <>
            <TabContrato
                label="Reajuste"
                handleEditPress={handleEditPress}
                handleDeletePress={handleDeletePress}
                dados={dados ?? []}
                isLoading={dadosReajuste.isLoading}
                num="0"/>
            <BotaoAdicionar
                fnAdicionar={() => {
                    setAcao("adicionar")
                    setFormDialog(true)
                }}
                texto={`Adicionar Reajuste`}/>
            <ContratoFormWrapper
                open={formDialog}
                setFormDialog={setFormDialog}
                isLoading={addReajuste.isLoading || editReajuste.isLoading}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                currId={currDados.current.id}
                title="Reajuste"
                form="reajuste_form">
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
                        label="Valor de Reajuste"
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
                        label="Indice de Reajuste"
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