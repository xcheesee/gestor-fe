import React, { useEffect, useState } from "react";
import { 
  Box, 
  Divider, 
  Paper,
  CircularProgress,
  Fade
} from "@mui/material";
import DialogConfirmacao from "../DialogConfirmacao";
import BotoesTab from "../BotoesTab";
import BotaoAdicionar from "../BotaoAdicionar";
import FormAditamentoPrazo from "./FormAditamentos/FormAditamentoPrazo";
import { postFormData, putFormData, throwableDeleteForm, throwableGetData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import { TabValues } from "../../commom/utils/utils";
import { aditPrazoLabels } from "../../commom/utils/constants";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";
import { useErrorSnackbar } from "../ErrorSnackbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const TabAditamentosPrazo = (props) => <TabValues entry={props} labels={aditPrazoLabels} label="aditamento_prazo" />

const ListaAditamentosPrazo = ({ numContrato }) => {
  const aditPrazoFormId = "aditamento_prazo_form"
  const queryClient = useQueryClient()

  const setSnackbar = useSetAtom(snackbarAtom)
  const errorSnackbar = useErrorSnackbar()

  const [acao, setAcao] = useState("editar");
  const [carregando, setCarregando] = useState(false);
  const [openFormAditamentos, setOpenFormAditamentos] = useState({
    open: false,
    acao: "adicionar"
  });
  const [openConfirmacao, setOpenConfirmacao] = useState({
    open: false,
    id: ""
  });
  const [formAditamentos, setFormAditamentos] = useState({
    contrato_id: numContrato,
    tipo_aditamento: "",
    dias_reajuste: ""
  });
  const [errors, setErrors] = useState({});

  const aditamentos_prazo = useQuery({
    queryKey: ['aditamentos_prazo', numContrato],
    queryFn: async () => await throwableGetData({path: 'aditamentos_prazo', contratoId: numContrato}) 
  })

  //useEffect(() => {
  //  const url = `${process.env.REACT_APP_API_URL}/aditamentos_prazo/${numContrato}`;
  //  const token = localStorage.getItem('access_token');
  //  const options = {
  //      method: 'GET',
  //      headers: {
  //          'Content-Type': 'application/json',
  //          'Accept': 'application/json',
  //          'Authorization': `Bearer ${token}`
  //      }
  //  };

  //  fetch(url, options)
  //    .then(res => res.json())
  //    .then(data => {
  //        setaditamentos_prazo(data.data);
  //        setCarregandoAditamentos_prazo(false);
  //    })
  //}, [mudancaAditamentos_prazo, numContrato, setaditamentos_prazo, setCarregandoAditamentos_prazo])

  const handleClickExcluir = (id) => {
    setOpenConfirmacao({
      open: true,
      id: id
    });
    setAcao("excluir");
  };

  const excluiAditamento = async (id) => {
    setCarregando(true);
    try{
      await throwableDeleteForm({id, path:'aditamento_prazo'})
      setOpenConfirmacao({ open: false, id: "" });
      setCarregando(false);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Aditamento excluído com sucesso!",
        color: "success"
      });
      queryClient.invalidateQueries({queryKey: ['aditamentos_prazo', numContrato]})
    } catch(e) {
        errorSnackbar.Delete(e)
    }
    setCarregando(false);
  };

  const handleClickEditar = (e, aditamentos) => {
    setFormAditamentos({
      id: aditamentos.id,
      contrato_id: aditamentos.contrato_id,
      tipo_aditamento: aditamentos.tipo_aditamento,
      dias_reajuste: aditamentos.dias_reajuste
    });
    setOpenFormAditamentos({
      open: true,
      acao: "editar"
    });
    setAcao("editar");
  };

  const editaAditamento = async (id, formAditamentoEdit) => {
    setCarregando(true);
    const res = await putFormData(id, formAditamentoEdit, "aditamento_prazo")
    try{
      await throwablePutForm({id, form: formAditamentoEdit, path: 'aditamento_prazo'})
      setSnackbar({
        open: true,
        severity: "success",
        message: "Aditamento editado com sucesso!",
        color: "success"
      });
      setOpenFormAditamentos({
        open: false,
        acao: "adicionar"
      });
      setFormAditamentos({
        ...formAditamentos,
        tipo_aditamento: "",
        dias_reajuste: ""
      });
      queryClient.invalidateQueries({queryKey: ['aditamentos_prazo', numContrato]})
    } catch(e) {
      errorSnackbar.Put(e)
    }
    setCarregando(false);
  };

  const handleClickAdicionar = () => {
    setOpenFormAditamentos({
      open: true,
      acao: "adicionar"
    });
    setFormAditamentos({
      contrato_id: numContrato,
      tipo_aditamento: "",
      dias_reajuste: ""
    });
  };

  const enviaAditamento = async (form) => {
    setCarregando(true);
    const res = await postFormData(form, "aditamento_prazo")
    try {
      await throwablePostForm({form, path: 'aditamento_prazo'})
      setSnackbar({
        open: true,
        severity: "success",
        message: "Aditamento enviado com sucesso!",
        color: "success"
      });
      setOpenFormAditamentos({
        open: false,
        acao: "adicionar"
      });
      setFormAditamentos({
        ...formAditamentos,
        tipo_aditamento: "",
        dias_reajuste: ""
      });
      queryClient.invalidateQueries({queryKey: ['aditamentos_prazo', numContrato]})
    } catch(e) {
      errorSnackbar.Post(e)
      if(e.status === 422) {setErrors(e.errors)}
    }
    setCarregando(false);
  };

  return (
    <Box>
      {aditamentos_prazo.isLoading
        ?<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
            <CircularProgress size={30} />
        </Box>
        :aditamentos_prazo?.data?.data.map((aditamento, index) => {
          return (
            <Fade in={true} timeout={400} key={index}>
              <Box
                elevation={3}
                component={Paper}
                sx={{ padding: "1rem", mb: "2rem" }}
              >
                <Divider
                  textAlign="right"
                  sx={{
                    fontWeight: "light",
                    fontSize: "1.25rem"
                  }}
                >
                  Aditamento # {aditamento.id}
                </Divider>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <TabAditamentosPrazo
                    tipo_aditamento={aditamento.tipo_aditamento}
                    dias_reajuste={aditamento.dias_reajuste}
                  />

                  <BotoesTab
                    editar={(e) => {
                      handleClickEditar(e, aditamento, aditamento.id);
                    }}
                    excluir={() => {
                      handleClickExcluir(aditamento.id);
                    }}
                  />
                </Box>
              </Box>
            </Fade>
          )}
        )
      }

      <FormAditamentoPrazo
        formAditamento={formAditamentos}
        setFormAditamento={setFormAditamentos}
        openFormAditamento={openFormAditamentos}
        setOpenFormAditamento={setOpenFormAditamentos}
        enviaAditamento={enviaAditamento}
        editaAditamento={editaAditamento}
        carregando={carregando}
        setOpenConfirmacao={setOpenConfirmacao}
        errors={errors}
        setErrors={setErrors}
        formId={aditPrazoFormId}
      />

      {
            ""
      }   

      <BotaoAdicionar
        fnAdicionar={handleClickAdicionar}
        texto="Adicionar aditamento"
      />

      <DialogConfirmacao
        openConfirmacao={openConfirmacao}
        setOpenConfirmacao={setOpenConfirmacao}
        acao={acao}
        formId={aditPrazoFormId}
        fnExcluir={excluiAditamento}
        fnEditar={editaAditamento}
        formInterno={formAditamentos}
        carregando={carregando}
        texto="aditamento"
      />
    </Box>
  );
};

export default ListaAditamentosPrazo;
