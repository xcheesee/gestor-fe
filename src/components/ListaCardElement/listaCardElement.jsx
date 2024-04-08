import { Box, Divider, Fade, Paper, Typography } from "@mui/material";
import { useState } from "react";
import BotaoAdicionar from "../BotaoAdicionar";
import FormDialog from "../FormDialog";
import BotoesTab from "../BotoesTab";
import DialogDelete from "../DialogDelete";
import DialogConf from "../DialogConf";

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
    const [openConfirmar, setOpenConfirmar] = useState({
        open: false,
        acao: ""
    })

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

                            <Box className="grid lg:grid-cols-[1fr_max-content] overflow-auto gap-8 lg:px-4">
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
            setOpenConfirmar={setOpenConfirmar}
            acao="Enviar"
            tipoForm={tipo_lista}
            formId={formId}
            carregando={carregando}
            title={`Enviar ${tipo_lista}`}
        >
            {renderPost((bool) => setOpenPostForm(bool))}
        </FormDialog>

        <FormDialog
            open={editForm.open}
            setOpen={(bool) => setEditForm(prev => ({...prev, open: bool}))}
            setOpenConfirmar={setOpenConfirmar}
            acao="Editar"
            tipoForm={tipo_lista}
            formId={formId}
            carregando={carregando}
            title={`Editar ${tipo_lista}`}
        >
            {renderEdit(editForm.dados, (bool) => setEditForm(prev => ({...prev, open: bool})))}
        </FormDialog>

        <DialogConf 
            title={`${openConfirmar.acao} ${tipo_lista}`}
            body={<Typography>Deseja {openConfirmar.acao} o(a) {tipo_lista}?</Typography>}
            formId={formId}
            open={openConfirmar.open}
            setOpen={setOpenConfirmar}
            acao={openConfirmar.acao}
        />

        <DialogDelete 
            open={openDelete.open}
            setOpen={(bool) => setOpenDelete(prev => ({...prev, open: bool}))}
            tipo_op={tipo_lista}
            id={openDelete.id}
            carregando={carregando}
            setCarregando={deleteProps.setCarregando}
            queryKeys={deleteProps.queryKeys}
            deletePath={deleteProps.deletePath}
        />

        </>
    )
}