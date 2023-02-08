import { TextField } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { contratoLabels } from "../../commom/utils/constants";

const CampoTexto = React.forwardRef((props, ref) => {
    const defaultRef = useRef(null)
    const inputRef = ref || defaultRef
    const {
        defaultValue, 
        name, 
        labels, 
        errors, 
        helperText="", 
        required=false,
        changeFn= () => {},
        ...other
    } = props

    return(
        <TextField
            variant="outlined"
            defaultValue={defaultValue ?? ""}
            name={name}
            label={labels[name]}
            onChange={e => {
                inputRef.current = e.target.value
                changeFn()
            }}
            className="form__campo"
            sx={{margin: "1rem 0"}}
            error={errors.hasOwnProperty(name)}
            helperText={errors.hasOwnProperty(name) ? errors[name] : helperText}
            fullWidth
            required={required}
            {...other}
        />
    )
})

export default CampoTexto