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
import { formataValores, TabValues } from "../../commom/utils/utils";
import { postFormData, putFormData } from "../../commom/utils/api";
import { aditValorLabels } from "../../commom/utils/constants";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";

const TabAditamentosValor = (props) => {
    const valores = {
        ...props,
        valor_aditamento: formataValores(props.valor_aditamento),
    }

    return <TabValues entry={valores} labels={aditValorLabels} label='aditamento_val' />
}

  const ListaAditamentosValor = (props) => {
    const {
        aditamentos_valor,
        setaditamentos_valor,
        mudancaAditamentos_valor,
        setMudancaAditamentos_valor,
        carregandoAditamentos_valor,
        setCarregandoAditamentos_valor,
        numContrato,
        //setSnackbar
    } = props;

    const setSnackbar = useSetAtom(snackbarAtom)

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
                message: 'Aditamento excluído com sucesso!',
                color: 'success'
            });
            return res.json();
        } else {
            setCarregando(false);
            setSnackbar({
                open: true,
                severity: 'error',
                message: <div>Não foi possível excluir o aditamento <br/>Erro {res.message}</div>,
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

const editaAditamento = async (id, formAditamentoEdit) => {
    setCarregando(true);
    const res = await putFormData(id, formAditamentoEdit, "aditamento_valor")
    if (res.status === 200) {
        setSnackbar({
            open: true,
            severity: 'success',
            message: 'Aditamento editado com sucesso!',
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
    } else {
        setSnackbar({
            open: true,
            severity: 'error',
            message: <div>Não foi possível editar o aditamento<br/>Erro {res.message}</div>,
            color: 'error'
        });
    }
    setCarregando(false);
    setMudancaAditamentos_valor(!mudancaAditamentos_valor);
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

const enviaAditamento = async (form) => {
    setCarregando(true);
    const res = await postFormData(form, "aditamento_valor")
    if (res.status === 201) {
        setSnackbar({
            open: true,
            severity: 'success',
            message: 'Aditamento enviado com sucesso!',
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
    } else if (res.status === 422) {
        setSnackbar({
            open: true,
            severity: 'error',
            message: <div> Não foi possível enviar o aditamento <br />Erro {res.message}</div>,
            color: 'error'
        });
        setErrors(res.errors)
    } else {
        setSnackbar({
            open: true,
            severity: 'error',
            message: <div>Não foi possível enviar o aditamento<br/>Erro {res.message}</div>,
            color: 'error'
        });
    }
    setCarregando(false);
    setMudancaAditamentos_valor(!mudancaAditamentos_valor);
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
                editaAditamento={editaAditamento}
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
                form="aditamento_val_form"
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
