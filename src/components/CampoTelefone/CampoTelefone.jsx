import React, { forwardRef } from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

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

const CampoTelefone = ({ formContrato, setFormContrato, onBlur, error, helperText, name }) => {
    const handleChange = (event) => {
        setFormContrato({
            ...formContrato,
            telefone_empresa: event.target.value
        });
    };

    return (
        <TextField
            variant="outlined"
            label="Telefone da empresa"
            value={formContrato.telefone_empresa}
            onChange={handleChange}
            helperText=" "
            required
            sx={{ margin: '1rem 0' }}
            InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                    format: formContrato.telefone_empresa.length > 10 ? "(##) #####-####" : "(##) ####-#####"
                },
            }}
            onBlur={onBlur}
            helperText={helperText}
            error={error}
            name={name}
            fullWidth
        />
    );
};

export default CampoTelefone;