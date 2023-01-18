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

const CampoTelefone = ({ formContrato, setFormContrato, error, helperText, name, label, ...other }) => {
    const [telefone_empresa, setTelefone_empresa] = useState(formContrato.telefone_empresa);

    const handleBlur = (event) => {
        if (other.edicao) {
            other.setFormInterno({
                ...other.formInterno,
                telefone_empresa: telefone_empresa
            });
        } else {
            setFormContrato({
                ...formContrato,
                telefone_empresa: telefone_empresa
            });
        }
    }

    return (
        <TextField
            variant="outlined"
            label={label}
            value={telefone_empresa}
            onChange={(e) => { setTelefone_empresa(e.target.value) }}
            required
            sx={{ margin: '1rem 0' }}
            InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                    format: telefone_empresa.length > 10 ? "(##) #####-####" : "(##) ####-#####"
                },
            }}
            onBlur={handleBlur}
            helperText={helperText}
            error={error}
            name={name}
            fullWidth
        />
    );
}

export default CampoTelefone;