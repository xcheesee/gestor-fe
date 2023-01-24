import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { TextField, InputAdornment } from '@mui/material';

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        isNumericString
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
      />
    );
});

NumberFormatCustom.propTypes = {
    onChange: PropTypes.func.isRequired,
};

const CampoValores = (props) => {
  const { 
    label, 
    defaultValue, 
    name, 
    required, 
    state, 
    setState, 
    checaErros, 
    helperText, 
    error, 
    fullWidth,
    ...other
  } = props;  
  
  // const [valor, setValor] = useState(value);

  // const handleChange = (event) => {
  //   setValor(event.target.value);
  // }

  // const handleBlur = (event) => {
  //   setState({
  //     ...state,
  //     [event.target.name]: valor
  //   });
  // }

  return (
      <TextField
          label={label}
          defaultValue={defaultValue}
          name={name}
          // onChange={handleChange}
          onBlur={(e) => { checaErros(e);}}
          InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              inputComponent: NumberFormatCustom,
          }}
          helperText={helperText}
          error={error}
          required={required}
          sx={{ margin: '1rem 0' }}
          fullWidth={fullWidth}
          {...other}
      />
  );
};

export default CampoValores;