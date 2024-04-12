//import { TextField } from "@mui/material";
//import React, { useRef } from "react";
//
//const CampoTexto = React.forwardRef((props, ref) => {
//    const defaultRef = useRef(null)
//    const inputRef = ref || defaultRef //ref para a utilizacao do valor do textfield externamente
//
//    const {
//        defaultValue, 
//        name, 
//        labels, //labels da aba em que o componente se encontra
//        error, 
//        helperText, 
//        required=false,
//        changeFn= () => {}, //funcao executada onChange
//        ...other
//    } = props
//
//    return(
//        <TextField
//            variant="outlined"
//            defaultValue={defaultValue ?? ""}
//            name={name}
//            label={labels[name]}
//            onChange={e => {
//                inputRef.current = e.target.value
//                changeFn(e)
//            }}
//            className="form__campo"
//            sx={{margin: "1rem 0"}}
//            error={error}
//            helperText={helperText}
//            fullWidth
//            required={required}
//            {...other}
//        />
//    )
//})
//
//export default CampoTexto