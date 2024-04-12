//import { TextField } from "@mui/material";
//import { NumberFormatCustom } from "../../commom/utils/utils";
//
//export default function CampoValoresUncontrolled({
//    label, 
//    defaultValue, 
//    name, 
//    required, 
//    checaErros, 
//    helperText, 
//    error, 
//    fullWidth,
//}) {
//  return (
//      <TextField
//          label={label}
//          defaultValue={defaultValue}
//          name={name}
//          onBlur={(e) => { checaErros(e);}}
//          InputProps={{
//              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
//              inputComponent: NumberFormatCustom,
//          }}
//          helperText={helperText}
//          error={error}
//          required={required}
//          sx={{ margin: '1rem 0' }}
//          fullWidth={fullWidth}
//          {...other}
//      />
//  );
//
//}