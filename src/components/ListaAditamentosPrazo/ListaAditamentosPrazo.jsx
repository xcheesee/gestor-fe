import React, { useState } from "react";
import { 
  Box, 
  CircularProgress,
} from "@mui/material";
import FormAditamentoPrazo from "./Forms";
import { throwableGetData, throwablePostForm, throwablePutForm } from "../../commom/utils/api";
import { TabValues } from "../../commom/utils/utils";
import { aditPrazoLabels } from "../../commom/utils/constants";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../atomStore";
import { useErrorSnackbar } from "../../commom/utils/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ListaCardElement from "../ListaCardElement";

const TabAditamentosPrazo = (props) => <TabValues entry={props} labels={aditPrazoLabels} label="aditamento_prazo" />

function ListaAditamentosPrazo({ numContrato }) {
  const formId = "prazo_form"
  const queryClient = useQueryClient()

  const setSnackbar = useSetAtom(snackbarAtom)
  const errorSnackbar = useErrorSnackbar()

  const [carregando, setCarregando] = useState(false);

  const aditamentos_prazo = useQuery({
    queryKey: ['aditamentos_prazo', numContrato],
    queryFn: async () => await throwableGetData({path: 'aditamentos_prazo', contratoId: numContrato}) 
  })

  const postMutation = useMutation({
      mutationFn: ({formData}) => throwablePostForm({form: formData, path: "aditamento_prazo"}),
      onMutate: () => { setCarregando(true) },
      onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['aditamentos_prazo', numContrato]})
          queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
          setSnackbar({
              open: true,
              severity: 'success',
              message: 'Aditamento enviado com sucesso!',
              color: 'success'
          });

      },
      onError: (res) => { errorSnackbar.Post(res) },
      onSettled: () => { setCarregando(false) }
  })

  const editMutation = useMutation({
      mutationFn: ({formData, id}) => throwablePutForm({form: formData, path: "aditamento_prazo", id: id}),
      onMutate: () => setCarregando(true),
      onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['aditamentos_prazo', numContrato]})
          queryClient.invalidateQueries({queryKey: ['mesesExecutados']})
          setSnackbar({
              open: true,
              severity: 'success',
              message: 'Aditamento editado com sucesso!',
              color: 'success'
          });
      },
      onError: (res) => { errorSnackbar.Put(res) },
      onSettled: () => setCarregando(false)
  })

    if(aditamentos_prazo?.isLoading) return (
        <Box className="w-full h-full grid place-content-center">
            <CircularProgress className="" />
        </Box>
    )

  return (
      <ListaCardElement
          formId={formId}
          dadosArr={aditamentos_prazo}
          carregando={carregando}
          deleteProps={{
              deletePath: 'aditamento_prazo',
              queryKeys: ['aditamentos_prazo'],
              setCarregando: setCarregando
          }}
          tipo_lista="Aditamento"
          TabDados={TabAditamentosPrazo}
          renderEdit={(adit, setOpenModal) => 
              <FormAditamentoPrazo
                  setOpen={setOpenModal}
                  acao="Editar"
                  formId={formId}
                  numContrato={numContrato}
                  dados={adit}
                  setCarregando={setCarregando}
                  onSubmit={editMutation.mutate}
              />
          }
          renderPost={(setOpenModal) => 
              <FormAditamentoPrazo
                  setOpen={setOpenModal}
                  acao="Enviar"
                  formId={formId}
                  numContrato={numContrato}
                  setCarregando={setCarregando}
                  onSubmit={postMutation.mutate}
              />
          }
      />
  )
};

export default ListaAditamentosPrazo;
