import { TextField } from "@mui/material";
import { contratoLabels } from "../../commom/utils/constants";

export default function CampoTexto ({defaultValue, name, errors}) {
    return(
        <TextField
            variant="outlined"
            defaultValue={defaultValue}
            name={name}
            label={contratoLabels[name]}
            onChange={e => {
                //TODO: DEFINIR FUNCAO DE SALVAMENTO EM LOCALSTORAGE
            }}
            className="form__campo"
            sx={{margin: "1rem 0"}}
            error={errors.hasOwnProperty(name)}
            helperText={errors.hasOwnProperty(name) ? errors[name] : "Ex: Em até 30 dias após o adimplemento."}
            fullWidth
        />
    )
}