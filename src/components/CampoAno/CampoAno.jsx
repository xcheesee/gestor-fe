import React, { useState, forwardRef } from 'react';
import { TextField } from '@mui/material';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

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
        />
    );
});

NumberFormatCustom.propTypes = {
    onChange: PropTypes.func.isRequired,
};

const CampoAno = (props) => {
    const {
        label,
        name,
        onChange,
        required,
        fullWidth,
        ...other
    } = props;

    const [ano, setAno] = useState('')

    return (
        <TextField 
            sx={{ margin: '1rem 0' }}
            label={label}
            name={name}
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            onBlur={onChange}
            InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                    format: "####"
                }
            }}
            required={required}
            fullWidth={fullWidth}
            {...other}
        />
    );
}

export default CampoAno;