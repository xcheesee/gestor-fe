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
import FormAditamentoValor from "./FomAditamentoValor/FormAditamentoValor";

const TabAditamentosValor = (props) => {
  const campos = [
      "Tipo",
      "Valor",
      "Porcentagem"
  ];
  const valores = [
    props.tipo_aditamento,
    props.formataValores(props.valor_aditamento),
    props.percentual
];

  return props.retornaCampoValor(campos, valores, props.estaCarregado);}

  const ListaAditamentosValor = (props) => {
    const {
        aditamentos_valor,
        setaditamentos_valor,
        mudancaAditamentos_valor,
        setMudancaAditamentos_valor,
        carregandoAditamentos_valor,
        setCarregandoAditamentos_valor,
        estaCarregado,
        formataValores,
        retornaCampoValor,
        numContrato,
        setSnackbar
    } = props;

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormAditamentos, setOpenFormAditamentos] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formAditamentos, setFormAditamentos] = useState({
        contrato_id: numContrato,
        tipo_aditamento: '',
        valor_aditamento: '',
        percentual: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/aditamentos_valor/${numContrato}`;
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
                setaditamentos_valor(data.data);
                setCarregandoAditamentos_valor(false);
            })
    }, [mudancaAditamentos_valor, numContrato, setaditamentos_valor, setCarregandoAditamentos_valor])

    const handleClickExcluir = (id) => {
        setOpenConfirmacao({
            open: true,
            id: id
        });
        setAcao('excluir');
    }

    const excluiAditamento = (id) => {
      const url = `${process.env.REACT_APP_API_URL}/aditamento_valor/${id}`;
      const token = localStorage.getItem('access_token');
      const options = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }

      setCarregando(true);                                                                                                                                                                                                                                            

      fetch(url, options)
      .then(res => {
        setMudancaAditamentos_valor(!mudancaAditamentos_valor);
        if (res.ok) {
            setOpenConfirmacao({ open: false, id: '' })
            setCarregando(false);
            setSnackbar({
                open: true,
                severity: 'success',
                text: 'Aditamento excluído com sucesso!',
                color: 'success'
            });
            return res.json();
        } else {
            setCarregando(false);
            setSnackbar({
                open: true,
                severity: 'error',
                text: `Erro ${res.status} - Não foi possível excluir o aditamento`,
                color: 'error'
            });
        }
      })
}

const handleClickEditar = (e, aditamento) => {
  setFormAditamentos({
      id: aditamento.id,
      contrato_id: aditamento.contrato_id,
      tipo_aditamento: aditamento.tipo_aditamento,
      valor_aditamento: aditamento.valor_aditamento,
      percentual: aditamento.percentual
  });
  setOpenFormAditamentos({
      open: true,
      acao: 'editar'
  });
  setAcao('editar');
}

const editaAditamento = (id, formAditamentoEdit) => {
  const url = `${process.env.REACT_APP_API_URL}/aditamento_valor/${id}`;
  const token = localStorage.getItem('access_token');
  const options = {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formAditamentoEdit)
  };

  setCarregando(true);

  fetch(url, options)
  .then(res => {
      setMudancaAditamentos_valor(!mudancaAditamentos_valor);
      if (res.ok) {
          setCarregando(false);
          setSnackbar({
              open: true,
              severity: 'success',
              text: 'Aditamento editado com sucesso!',
              color: 'success'
          });
          setOpenFormAditamentos({
              open: false,
              acao: 'adicionar'
          });
          setFormAditamentos({
              ...formAditamentos,
              tipo_aditamento: '',
              valor_aditamento: '',
              percentual: ''
          });
          return res.json();
      } else {
          setCarregando(false);
          setSnackbar({
              open: true,
              severity: 'error',
              text: `Erro ${res.status} - Não foi possível editar o aditamento`,
              color: 'error'
          });
      }
  });
}

const handleClickAdicionar = () => {
  setOpenFormAditamentos({
      open: true,
      acao: 'adicionar'
  });
  setFormAditamentos({
      contrato_id: numContrato,
      tipo_aditamento: '',
      valor_aditamento: '',
      percentual: ''
  });
}

const enviaAditamento = () => {
  const url = `${process.env.REACT_APP_API_URL}/aditamento_valor`;
  const token = localStorage.getItem('access_token');
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formAditamentos)
  };

  setCarregando(true);

  fetch(url, options)
  .then(res => {
      setMudancaAditamentos_valor(!mudancaAditamentos_valor);
      if (res.ok) {
          setCarregando(false);
          setSnackbar({
              open: true,
              severity: 'success',
              text: 'Aditamento enviado com sucesso!',
              color: 'success'
          });
          setOpenFormAditamentos({ 
              open: false, 
              acao: 'adicionar' 
          });
          setFormAditamentos({
              ...formAditamentos,
              tipo_aditamento: '',
              valor_aditamento: '',
              percentual: ''
          });
          return res.json();
      } else if (res.status === 422) {
          setCarregando(false);
          setSnackbar({
              open: true,
              severity: 'error',
              text: `Erro ${res.status} - Não foi possível enviar o aditamento`,
              color: 'error'
          });
          return res.json()
              .then(data => setErrors(data.errors));
      } else {
          setCarregando(false);
          setSnackbar({
              open: true,
              severity: 'error',
              text: `Erro ${res.status} - Não foi possível enviar o aditamento`,
              color: 'error'
          });
      }
  })
  .catch(err => {
      console.log(err);
  });
}

  return (
    <Box>
      {aditamentos_valor.map((aditamento, index) => {
                return (
                    <Fade in={true} timeout={400} key={index}>
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
                                Aditamento # {aditamento.id}
                            </Divider>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TabAditamentosValor 
                                    tipo_aditamento={aditamento.tipo_aditamento}
                                    valor_aditamento={aditamento.valor_aditamento}
                                    percentual={aditamento.percentual}
                                    estaCarregado={estaCarregado}
                                    formataValores={formataValores}
                                    retornaCampoValor={retornaCampoValor}
                                />

                                <BotoesTab 
                                    editar={(e) => { handleClickEditar(e, aditamento, aditamento.id); }}
                                    excluir={() => { handleClickExcluir(aditamento.id); }}
                                />
                            </Box>
                        </Box>
                    </Fade>
                );
            })}

            <FormAditamentoValor
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
                carregandoAditamentos_valor
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
}

export default ListaAditamentosValor;
