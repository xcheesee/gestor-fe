import { Box, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getFormData, postFormData, putFormData } from "../../commom/utils/api";
import { formataValores } from "../../commom/utils/utils";
import BotaoAdicionar from "../BotaoAdicionar";
import CampoData from "../CampoData";
import ContratoFormWrapper from "../ContratoFormWrapper";
import TabContrato from "../TabContrato";

export default function ListaReajustes ({ numContrato }) {
    const queryClient = useQueryClient()
    const errors = ""
    const formCertidao = ""
    const [formDialog, setFormDialog] = useState(false)
    const [acao, setAcao] = useState("")
    const dadosReajuste = useQuery({queryKey: ['reajuste'], queryFn: () => getFormData("reajustes")})
    const reajusteMutation = useMutation({
        mutationFn: (formData, type) => {
            if(type === "post") {
                postFormData(formData, "reajuste")
            } else if(type === "put") {
                putFormData(numContrato, formData, "reajuste")
            }
        }
    })
    let dados = {
        reajuste_valor: "200",
        reajuste_indice: "100%"
    }
    dados.reajuste_valor = formataValores(dados.reajuste_valor)
    return(
        <>
            <TabContrato
                label="Reajuste"
                editFn={""}
                dados={dados}
                num="0"
                mutationFn={reajusteMutation}/>
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
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        formData.append("contrato_id", numContrato)
                        // openFormCertidao.acao === "adicionar" ? enviaCertidao(formData) : editaCertidao(e, formData, formCertidao.id)
                    }}
                >
                    <TextField
                        variant="outlined"
                        value={formCertidao.certidoes}
                        name="certidoes"
                        // onChange={handleInputChange}
                        label="Certidão"
                        sx={{ margin: '1rem 0' }}
                        error={errors.hasOwnProperty('certidoes')}
                        helperText={errors.hasOwnProperty('certidoes') ? errors.certidoes : "Ex: Certidão negativa de débitos"}
                        fullWidth
                        required
                    />

                    <CampoData
                        label="Validade"
                        defaultValue={formCertidao.validade_certidoes}
                        name="validade_certidoes"
                        // onChange={handleInputChange}
                        margin="1rem 0"
                        error={errors.hasOwnProperty('validade_certidoes')}
                        helperText={errors.validade_certidoes}
                        fullWidth
                        required
                    />
                </Box>
            </ContratoFormWrapper>
        </>
    )
}