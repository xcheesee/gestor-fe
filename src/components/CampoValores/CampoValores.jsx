import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { NumberFormatCustom } from '../../commom/utils/utils';
import { NumericFormat } from 'react-number-format'


NumberFormatCustom.propTypes = {
    onChange: PropTypes.func.isRequired,
};

const CampoValores = (props) => {
  const { 
    label, 
    defaultValue=null, 
    name, 
    required, 
    //checaErros, 
    helperText, 
    error, 
    fullWidth,
    //...other
  } = props;  
  
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
      <NumericFormat
          //label={label}
          //defaultValue={defaultValue}
          name={name}
          //value={valorInterno}
          customInput={TextField}
          label={label} 
          defaultValue={defaultValue}
          //name={name}
          //onValueChange={(values, _) =>  {
          //  setValorInterno(values.floatValue)
          //  console.log(values)
          //} }
          //onChange={(e) => setValor(e.target.value)}
          //onBlur={() => {}}
          //onChange={(e) => setValorInterno(e.target.value)}
          helperText={helperText}
          error={error}
          required={required}
          sx={{ margin: '1rem 0' }}
          fullWidth={fullWidth}
          //{...other}
          thousandSeparator="."
          decimalSeparator=","
          fixedDecimalScale
          decimalScale={2}
          //NumberisNumericString
          //onBlur={(e) => { checaErros(e);}}
          //InputProps={{
          //    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          //    inputComponent: NumberFormatCustom,
          //}}
      />
  );
};

export default CampoValores;