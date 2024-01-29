import { Box, Divider, Fade, Paper } from "@mui/material";
import { useState } from "react";
import BotaoAdicionar from "../BotaoAdicionar";
import FormDialog from "../FormDialog";
import BotoesTab from "../BotoesTab";
import DialogDelete from "../DialogDelete";

export default function ListaCardElement({
    formId,
    dadosArr,
    carregando,
    tipo_lista,
    TabDados,
    renderEdit,
    renderPost,
    deleteProps
}) {
    const [openPostForm, setOpenPostForm] = useState(false)
    const [editForm, setEditForm] = useState({
        open: false,
        id: "",
        dados: {}
    })
    const [openDelete, setOpenDelete] = useState({
        open: false,
        id: ""
    })
    const [openConfirmar, setOpenConfirmar] = useState(false)

    return(
        <>
        <Box>
            {dadosArr?.data?.data?.map( (dados,i) => {
                return (
                    <Fade in={true} timeout={400} key={`${i}`}>
                        <Box
                            elevation={3}
                            component={Paper}
                            sx={{ padding: '1rem', mb: '2rem' }}
                        >
                            <Divider
                                textAlign='right'
                                sx={{
                                    fontWeight: 'light',
                                    fontSize: '1.25rem'
                                }}
                            >
                                {tipo_lista} # {dados.id}
                            </Divider>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TabDados  {...dados} />
                                <BotoesTab 
                                    editar={(e) => { setEditForm({
                                        open: true,
                                        id: dados.id,
                                        dados: dados
                                    }) }}
                                    excluir={() => { setOpenDelete({
                                        open: true,
                                        id: dados.id
                                    }) }}
                                />
                            </Box>
                        </Box>
                    </Fade>
                )
            }) }
            <BotaoAdicionar
                fnAdicionar={() => setOpenPostForm(true)}
            />
        </Box>


        <FormDialog
            open={openPostForm}
            setOpen={setOpenPostForm}
            acao="Enviar"
            onClick={() => setOpenConfirmar(true)}
            tipoForm={tipo_lista}
            openConfirmar={openConfirmar}
            setOpenConfirmar={setOpenConfirmar}
            formId={formId}
            carregando={carregando}
        >
            {renderPost((bool) => setOpenPostForm(bool))}
        </FormDialog>

        <FormDialog
            open={editForm.open}
            setOpen={(bool) => setEditForm(prev => ({...prev, open: bool}))}
            acao="Editar"
            onClick={() => setOpenConfirmar(true)}
            tipoForm={tipo_lista}
            openConfirmar={openConfirmar}
            setOpenConfirmar={setOpenConfirmar}
            formId={formId}
            carregando={carregando}
        >
            {renderEdit(editForm.dados, (bool) => setEditForm(prev => ({...prev, open: bool})))}
        </FormDialog>
        <DialogDelete 
            open={openDelete.open}
            setOpen={(bool) => setOpenDelete(prev => ({...prev, open: bool}))}
            tipo_op={tipo_lista}
            id={openDelete.id}
            carregando={carregando}
            setCarregando={deleteProps.setCarregando}
            queryKey={deleteProps.queryKey}
            deletePath={deleteProps.deletePath}
        />

        </>
    )
}