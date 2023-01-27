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
  MenuItem,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";

const FormAditamentoPrazo = (props) => {
  const {
    formAditamento,
    setFormAditamento,
    openFormAditamento,
    setOpenFormAditamento,
    enviaAditamento,
    editaAditamento,
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
        <Box
          component="form"
          id="aditamento_prazo_form"
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            formData.append("contrato_id", formAditamento.contrato_id)
            openFormAditamento.acao === "adicionar" ? enviaAditamento(formData) : editaAditamento(formAditamento.id, formData)
          }}>

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
                <MenuItem value="Prorrogação de prazo">
                  Prorrogação de prazo
                </MenuItem>
                <MenuItem value="Supressão de prazo">Supressão de prazo</MenuItem>
                <MenuItem value="Suspensão">Suspensão</MenuItem>
                <MenuItem value="Rescisão">Rescisão</MenuItem>
              </Select>
              <FormHelperText>{errors.tipo_aditamento}</FormHelperText>
            </FormControl>

            <TextField
              variant="outlined"
              value={formAditamento.dias_reajuste}
              name="dias_reajuste"
              onChange={handleInputChange}
              label="Dias Reajuste"
              sx={{ margin: "1rem 0" }}
              error={errors.hasOwnProperty("dias_reajuste")}
              helperText={errors.dias_reajuste}
              fullWidth
              required
            />
          </Box>
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
          type={openFormAditamento.acao === "adicionar" ? "submit" : ""}
          form={openFormAditamento.acao === "adicionar" ? "aditamento_prazo_form" : ""}
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

export default FormAditamentoPrazo;
