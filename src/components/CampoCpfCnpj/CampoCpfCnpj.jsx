import React, { useState } from 'react';
//import NumberFormat from 'react-number-format';
//import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import ReactInputMask from 'react-input-mask';

const CampoCpfCnpj = (props) => {
    const {
        defaultValue,
        setError,
        fullWidth, 
        errors, 
        setErrors,
        label,
    } = props;

    const [cpfCnpj, setCpfCnpj] = useState(defaultValue ?? "");

    const mudaCpfCnpj = (event) => {
        const raw = event.target.value
        const val = raw.replace(/[^0-9]+/g, '')
        setCpfCnpj(val);
    };

    const validaCpfCnpj = (event) => {
        if (cpfCnpj.length > 0 && cpfCnpj.length <= 11) {
            if (cpf.isValid(cpfCnpj)) {
                const errorsTemp = {...errors}
                delete errorsTemp.cnpj_cpf;
                setError(false);
                setErrors(errorsTemp);
            } else {
                setErrors({...errors, cnpj_cpf: "CPF Inválido"});
                setError(true);
            }
        } else if (cpfCnpj.length > 0 && cpfCnpj.length <= 14) {
            if (cnpj.isValid(cpfCnpj)) {
                const errorsTemp = {...errors}
                delete errorsTemp.cnpj_cpf;
                setError(false);
                setErrors(errorsTemp)
            } else {
                setErrors({...errors, cnpj_cpf: "CNPJ Inválido"});
                setError(true);
            }
        }
    }

    return (
        <ReactInputMask 
            mask={ cpfCnpj.length > 11 ? "99.999.999/9999-99" : "999.999.999-9999" }
            maskChar=""
            value={cpfCnpj}
            onChange={mudaCpfCnpj}
            onBlur={validaCpfCnpj}
        >
            {() => (
                
            <TextField
                variant="outlined"
                label={label}
                name="cnpj_cpf"
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('cnpj_cpf')}
                helperText={errors.hasOwnProperty('cnpj_cpf') ? errors.cnpj_cpf : "Somente números"}
                fullWidth={fullWidth}
            />
            )}
        </ReactInputMask>
    );
}

export default CampoCpfCnpj;