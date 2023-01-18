import React, { forwardRef, useState } from 'react';
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

const CampoProcessoSei = (props) => {
    const {
        formContrato,
        setFormContrato,
        error,
        helperText,
        name,
        label,
        ...other
    } = props;

    const [processoSei, setProcessoSei] = useState(formContrato.processo_sei);

    const handleBlur = (event) => {
        setFormContrato({
            ...formContrato,
            processo_sei: processoSei
        });
    }

    return (
        <TextField
            variant="outlined"
            label={label}
            value={processoSei}
            onChange={(e) => { setProcessoSei(e.target.value) }}
            required
            sx={{ margin: '1rem 0' }}
            InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                    format: "####.####/#######-#"
                },
            }}
            onBlur={handleBlur}
            helperText={helperText}
            error={error}
            name={name}
            fullWidth
            {...other}
        />
    );
}

export default CampoProcessoSei;