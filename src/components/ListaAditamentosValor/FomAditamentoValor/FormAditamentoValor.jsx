import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  TextField,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import CampoValores from "../../CampoValores";
import CampoPorcentagem from "../../CampoPorcentagem";

const FormAditamentoValor = (props) => {
  const {
    formAditamento,
    setFormAditamento,
    openFormAditamento,
    setOpenFormAditamento,
    enviaAditamento,
    carregando,
    setOpenConfirmacao,
    errors,
    setErrors
  } = props;

  useEffect(() => {
    setErrors({});
  }, [openFormAditamento.open]);

  const handleInputChange = (e) => {
    setFormAditamento({
      ...formAditamento,
      [e.target.name]: e.target.value
    });
  };

  const handleClickConfirmar = () => {
    if (openFormAditamento.acao === "adicionar") {
      enviaAditamento();
    } else if (openFormAditamento.acao === "editar") {
      setOpenConfirmacao({
        open: true,
        id: formAditamento.id
      });
    }
  };

  return (
    <Dialog open={openFormAditamento.open} fullWidth>
      <DialogTitle>
        {openFormAditamento.acao === "adicionar"
          ? "Nova aditamento"
          : "Editar aditamento"}
      </DialogTitle>

      <DialogContent>
        <FormControl
          sx={{ margin: "1rem 0" }}
          error={errors.hasOwnProperty("tipo_aditamento")}
          fullWidth
        >
          <InputLabel id="tipo_aditamento-label">Tipo</InputLabel>
          <Select
            labelId="tipo_aditamento-label"
            id="tipo_aditamento"
            label="Tipo"
            value={formAditamento.tipo_aditamento}
            name="tipo_aditamento"
            onChange={handleInputChange}
            required
            fullWidth
          >
            <MenuItem value="Acréscimo de valor">Acréscimo de valor</MenuItem>
            <MenuItem value="Redução de valor">Redução de valor</MenuItem>
          </Select>
          <FormHelperText>{errors.tipo_aditamento}</FormHelperText>
        </FormControl>

        <CampoValores
          index=""
          label="Valor"
          value={formAditamento.valor_aditamento}
          state={formAditamento}
          setState={setFormAditamento}
          name="valor_aditamento"
          checaErros={() => {}}
          error={errors.hasOwnProperty("valor_aditamento")}
          helperText={errors.valor_aditamento}
          fullWidth
        />

        <CampoPorcentagem
          label="Porcentagem reajuste"
          value={formAditamento.percentual}
          name="percentual"
          state={formAditamento}
          setState={setFormAditamento}
          error={errors.hasOwnProperty("percentual")}
          helperText={errors.percentual}
          fullWidth
        />
      </DialogContent>

      <DialogActions sx={{ margin: "1rem" }}>
        <Button
          onClick={() => {
            setOpenFormAditamento({
              ...openFormAditamento,
              open: false
            });
          }}
          sx={{ textTransform: "none", mr: "1rem", color: "#821f1f" }}
        >
          <CloseIcon sx={{ mr: "0.2rem" }} /> Cancelar
        </Button>

        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          onClick={handleClickConfirmar}
        >
          {carregando ? (
            <CircularProgress
              size={16}
              sx={{ color: "#FFFFFF", mr: "0.7rem" }}
            />
          ) : (
            <CheckIcon sx={{ mr: "0.2rem" }} />
          )}

          {openFormAditamento.acao === "adicionar" ? "Enviar" : "Editar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormAditamentoValor;
