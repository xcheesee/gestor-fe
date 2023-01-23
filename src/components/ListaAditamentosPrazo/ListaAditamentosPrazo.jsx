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

const TabAditamentosPrazo = (props) => {

  const campos = ["Tipo", "Dias Reajuste"];

  const valores = [props.tipo_aditamento, props.dias_reajuste];

  return props.retornaCampoValor(campos, valores, props.estaCarregado);
};

const ListaAditamentosPrazo = (props) => {
  const {
    aditamentos_prazo,
    setaditamentos_prazo,
    mudancaAditamentos_prazo,
    setMudancaAditamentos_prazo,
    carregandoAditamentos_prazo,
    setCarregandoAditamentos_prazo,
    estaCarregado,
    retornaCampoValor,
    setSnackbar,
    numContrato,
  } = props;

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

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/aditamentos_prazo/${numContrato}`;
    const token = localStorage.getItem('access_token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(data => {
          setaditamentos_prazo(data.data);
          setCarregandoAditamentos_prazo(false);
      })
  }, [mudancaAditamentos_prazo, numContrato, setaditamentos_prazo, setCarregandoAditamentos_prazo])

  const handleClickExcluir = (id) => {
    setOpenConfirmacao({
      open: true,
      id: id
    });
    setAcao("excluir");
  };

  const excluiAditamento = (id) => {
    const url = `${process.env.REACT_APP_API_URL}/aditamento_prazo/${id}`;
    const token = localStorage.getItem("access_token");
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': `Bearer ${token}`
      }
    };

    setCarregando(true);

    fetch(url, options).then((res) => {
      setMudancaAditamentos_prazo(!mudancaAditamentos_prazo);
      if (res.ok) {
        setOpenConfirmacao({ open: false, id: "" });
        setCarregando(false);
        setSnackbar({
          open: true,
          severity: "success",
          text: "Aditamento excluído com sucesso!",
          color: "success"
        });
        return res.json();
      } else {
        setCarregando(false);
        setSnackbar({
          open: true,
          severity: "error",
          text: `Erro ${res.status} - Não foi possível excluir o aditamento`,
          color: "error"
        });
      }
    });
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

  const editaAditamento = (id, formAditamentoEdit) => {
    const url = `${process.env.REACT_APP_API_URL}/aditamento_prazo/${id}`;
    const token = localStorage.getItem("access_token");
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formAditamentoEdit)
    };

    setCarregando(true);

    fetch(url, options).then((res) => {
      setMudancaAditamentos_prazo(!mudancaAditamentos_prazo);
      if (res.ok) {
        setCarregando(false);
        setSnackbar({
          open: true,
          severity: "success",
          text: "Aditamento editada com sucesso!",
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
        return res.json();
      } else {
        setCarregando(false);
        setSnackbar({
          open: true,
          severity: "error",
          text: `Erro ${res.status} - Não foi possível editar o aditamento`,
          color: "error"
        });
      }
    });
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

  const enviaAditamento = () => {
    const url = `${process.env.REACT_APP_API_URL}/aditamento_prazo`;
    const token = localStorage.getItem("access_token");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formAditamentos)
    };

    setCarregando(true);

    fetch(url, options)
      .then((res) => {
        setMudancaAditamentos_prazo(!mudancaAditamentos_prazo);
        if (res.ok) {
          setCarregando(false);
          setSnackbar({
            open: true,
            severity: "success",
            text: "Aditamento enviado com sucesso!",
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
          return res.json();
        } else if (res.status === 422) {
          setCarregando(false);
          setSnackbar({
            open: true,
            severity: "error",
            text: `Erro ${res.status} - Não foi possível enviar o aditamento`,
            color: "error"
          });
          return res.json()
              .then(data => {
                  setErrors(data.errors);
              });
        } else {
          setCarregando(false);
          setSnackbar({
            open: true,
            severity: "error",
            text: `Erro ${res.status} - Não foi possível enviar o aditamento`,
            color: "error"
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box>
      {aditamentos_prazo.map((aditamento, index) => {
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
                  retornaCampoValor={retornaCampoValor}
                  estaCarregado={estaCarregado}
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
        );
      })}

      <FormAditamentoPrazo
        formAditamento={formAditamentos}
        setFormAditamento={setFormAditamentos}
        openFormAditamento={openFormAditamentos}
        setOpenFormAditamento={setOpenFormAditamentos}
        enviaAditamento={enviaAditamento}
        carregando={carregando}
        setOpenConfirmacao={setOpenConfirmacao}
        errors={errors}
        setErrors={setErrors}
      />

      {
        carregandoAditamentos_prazo
        ? 
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                <CircularProgress size={30} />
            </Box>
        : 
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
