import React, { forwardRef } from 'react';
import { TextField, InputAdornment } from '@mui/material';
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
            decimalSeparator=","
            thousandSeparator="."
        />
    );
});

NumberFormatCustom.propTypes = {
    onChange: PropTypes.func.isRequired,
};

const CampoPorcentagem = ({ formAditamentosApostilamentos, setFormAditamentosApostilamentos, index }) => {
    const handleChange = (event) => {
        setFormAditamentosApostilamentos({
            ...formAditamentosApostilamentos,
            [index]: {
                ...formAditamentosApostilamentos[index],
                taxaReajuste: event.target.value
            }
        })
    }

    return (
        <TextField 
            variant="outlined" 
            className="aditamentos-apostilamentos__campo" 
            label="Taxa de Reajuste" 
            value={formAditamentosApostilamentos.taxaReajuste}
            onChange={handleChange}
            InputProps={{
                inputComponent: NumberFormatCustom,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            helperText=" " 
            sx={{ margin: '1rem 0' }}
        />
    );
}

export default CampoPorcentagem;