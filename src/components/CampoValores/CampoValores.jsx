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
    className="",
    defaultValue="", 
    prefix="",
    suffix="",
    name, 
    id="",
    required=false, 
    value=null,
    onChange=()=>{},
    onBlur=()=>{},
    helperText="", 
    error=false, 
    fullWidth=true,
    ...other
  } = props;  

  if(value === null) {
    return (
        <NumericFormat
            className={className}
            name={name}
            customInput={TextField}
            label={label} 
            defaultValue={defaultValue}
            prefix={prefix}
            suffix={suffix}
            id={id}
            helperText={helperText}
            error={error}
            required={required}
            fullWidth={fullWidth}
            thousandSeparator="."
            decimalSeparator=","
            fixedDecimalScale
            decimalScale={2}
            onBlur={onBlur}
        />
    );
  }
  return (
        <NumericFormat
            className={className}
            name={name}
            value={value}
            onChange={onChange}
            customInput={TextField}
            label={label} 
            prefix={prefix}
            suffix={suffix}
            id={id}
            helperText={helperText}
            error={error}
            required={required}
            fullWidth={fullWidth}
            thousandSeparator="."
            decimalSeparator=","
            fixedDecimalScale
            decimalScale={2}
        />
    );
  
};

export default CampoValores;