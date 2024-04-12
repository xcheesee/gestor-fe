//import React, { forwardRef, useState } from 'react';
//import { NumericFormat } from 'react-number-format';
//// import PropTypes from 'prop-types';
//import { TextField } from '@mui/material';
//
//const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
//    const { onChange, ...other } = props;
//
//    return (
//        <NumericFormat
//            {...other}
//            getInputRef={ref}
//            onValueChange={(values) => {
//                onChange({
//                    target: {
//                        value: values.value,
//                    },
//                });
//            }}
//            isNumericString
//        />
//    );
//});
//
//const CampoTelefone = ({ dados, error, helperText, name, label, ...other }) => {
//    const [telefone_empresa, setTelefone_empresa] = useState(dados.telefone_empresa.replace(/[^\d]+/g, ''))
//
//    return (
//        <TextField
//            variant="outlined"
//            label={label}
//            defaultValue={telefone_empresa ?? ""}
//            onChange={(e) => { setTelefone_empresa(e.target.value) }}
//            required
//            sx={{ margin: '1rem 0' }}
//            InputProps={{
//                inputComponent: NumberFormatCustom,
//                inputProps: {
//                    format: telefone_empresa.length > 10 ? "(##) #####-####" : "(##) ####-#####"
//                },
//            }}
//            helperText={helperText}
//            error={error}
//            name={name}
//            fullWidth
//        />
//    );
//}
//
//export default CampoTelefone;