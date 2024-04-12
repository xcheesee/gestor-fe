//import React, { forwardRef, useState } from 'react';
//import { TextField, InputAdornment } from '@mui/material';
//import { NumericFormat } from 'react-number-format';
//import PropTypes from 'prop-types';
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
//            decimalSeparator=","
//            thousandSeparator="."
//        />
//    );
//});
//
//NumberFormatCustom.propTypes = {
//    onChange: PropTypes.func.isRequired,
//};
//
//const CampoPorcentagem = (props) => {
//    const {
//        label,
//        value,
//        name,
//        state,
//        setState,
//        helperText,
//        required,
//        fullWidth
//    } = props;
//
//    const [valor, setValor] = useState(value);
//
//    const handleChange = (event) => {
//      setValor(event.target.value);
//    }
//
//    const handleBlur = (event) => {
//      setState({
//        ...state,
//        [event.target.name]: valor
//      });
//    }
//
//    return (
//        <TextField 
//            variant="outlined" 
//            label={label}
//            value={valor}
//            onChange={handleChange}
//            onBlur={handleBlur}
//            name={name}
//            InputProps={{
//                inputComponent: NumberFormatCustom,
//                endAdornment: <InputAdornment position="end">%</InputAdornment>,
//            }}
//            helperText={helperText}
//            sx={{ margin: '1rem 0' }}
//            required={required}
//            fullWidth={fullWidth}
//        />
//    );
//}
//
//export default CampoPorcentagem;