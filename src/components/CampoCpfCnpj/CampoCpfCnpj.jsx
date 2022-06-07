import React, { useState, forwardRef } from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { cpf, cnpj } from 'cpf-cnpj-validator';

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

const CampoCpfCnpj = ({ formContrato, setFormContrato, setError, errosContrato, setErrosContrato, checaErros, fullWidth }) => {
    const [cpfCnpj, setCpfCnpj] = useState(formContrato.cnpj_cpf);

    const mudaCpfCnpj = (event) => {
        setCpfCnpj(event.target.value);
    };

    const validaCpfCnpj = (event) => {
        if (cpfCnpj.length > 0 && cpfCnpj.length <= 11) {
            if (cpf.isValid(cpfCnpj)) {
                setError(false);
                setErrosContrato({
                    ...errosContrato,
                    cnpj_cpf: {
                        error: false,
                        helperText: " "
                    }
                });
                setFormContrato({
                    ...formContrato,
                    cnpj_cpf: cpfCnpj,
                });
            } else {
                setErrosContrato({
                    ...errosContrato,
                    cnpj_cpf: {
                        error: true,
                        helperText: "CPF Inválido"
                    }
                });
                setError(true);
            }
        } else if (cpfCnpj.length > 0 && cpfCnpj.length <= 14) {
            if (cnpj.isValid(cpfCnpj)) {
                setError(false);
                setErrosContrato({
                    ...errosContrato,
                    cnpj_cpf: {
                        error: false,
                        helperText: " "
                    }
                });
                setFormContrato({
                    ...formContrato,
                    cnpj_cpf: cpfCnpj,
                });
            } else {
                setErrosContrato({
                    ...errosContrato,
                    cnpj_cpf: {
                        error: true,
                        helperText: "CNPJ Inválido"
                    }
                });
                setError(true);
            }
        }
    }

    return (
        <TextField
            variant="outlined"
            label="CNPJ/CPF"
            helperText={errosContrato.cnpj_cpf.helperText}
            value={cpfCnpj}
            name="cnpj_cpf"
            onChange={mudaCpfCnpj}
            onBlur={(e) => {checaErros(e); validaCpfCnpj(e);}}
            InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                    format: cpfCnpj.length > 11 ? "##.###.###/####-##" : "###.###.###-#####"
                },
            }}
            required
            sx={{ margin: '1rem 0' }}
            error={errosContrato.cnpj_cpf.error}
            fullWidth={fullWidth}
        />
    );
}

export default CampoCpfCnpj;