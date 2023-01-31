import { Box, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useState } from "react";
import { getFormData, postFormData, putFormData } from "../../commom/utils/api";
import { formataValores } from "../../commom/utils/utils";
import BotaoAdicionar from "../BotaoAdicionar";
import ContratoFormWrapper from "../ContratoFormWrapper";
import TabContrato from "../TabContrato";

export default function ListaReajustes ({ numContrato, setSnackbar }) {
    // const queryClient = useQueryClient()
    let dados = []
    const errors = ""
    const [formDialog, setFormDialog] = useState(false)
    const [acao, setAcao] = useState("")
    const dadosReajuste = useQuery({queryKey: ['reajuste'], queryFn: () => getFormData("reajustes")})
    const addReajusteMutation = useMutation({
        mutationFn: async (formData) => {
                return await postFormData(formData, "reajuste")
        }, onSuccess: async (res) => {
            setFormDialog(false)
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Nota de Empenho editada com sucesso!',
                color: 'success'
            });
        }
    })
    const editReajusteMutation = useMutation({
        mutationFn: async (formData) => {
                return await putFormData(numContrato, formData, "reajuste")
        }
    })
    function handleEditPress () {
        setAcao("editar")
        setFormDialog(true)
    }
    dados = dadosReajuste?.data?.data?.map((entry) => {
        return({
            id: entry.id,
            contrato_id: entry.contrato_id,
            valor_reajuste: formataValores(entry.valor_reajuste),
            indice_reajuste: `${entry.indice_reajuste}%`
        })
    })
    // dados.reajuste_valor = formataValores(dados.reajuste_valor)
    useEffect(() => {
        console.log(dadosReajuste?.data?.data)
    }, [])
    return(
        <>
            <TabContrato
                label="Reajuste"
                editFn={handleEditPress}
                dados={dados ?? []}
                dadosInternos={dadosReajuste}
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
                acao={acao}
                title={acao === "adicionar" ? "Novo Reajuste" : "Editar Reajuste"}
                form="reajuste_form">
                <Box
                    component='form'
                    id='reajuste_form'
                    onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        formData.append("contrato_id", numContrato)
                        acao === "adicionar" ? addReajusteMutation.mutate(formData) : editReajusteMutation.mutate(formData)
                    }}
                >
                    <TextField
                        variant="outlined"
                        defaultValue={acao === "adicionar" ? "" : dadosReajuste?.data?.valor_reajuste}
                        name="valor_reajuste"
                        label="Valor de Reajuste"
                        sx={{ margin: '1rem 0' }}
                        error={errors.hasOwnProperty('valor_reajuste')}
                        helperText={errors.hasOwnProperty('valor_reajuste') ? errors : "Ex: "}
                        fullWidth
                        required
                    />
                    <TextField
                        variant="outlined"
                        defaultValue={acao === "adicionar" ? "" : dadosReajuste?.data?.indice_reajuste}
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
        </>
    )
}