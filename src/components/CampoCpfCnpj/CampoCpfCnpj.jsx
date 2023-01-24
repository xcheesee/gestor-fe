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

const CampoCpfCnpj = (props) => {
    const {
        formContrato, 
        setFormContrato, 
        setError,
        fullWidth, 
        errors, 
        setErrors,
        label,
    } = props;
    // let scrollTop, scrollLeft;

    const [cpfCnpj, setCpfCnpj] = useState(formContrato.cnpj_cpf);

    const mudaCpfCnpj = (event) => {
        setCpfCnpj(event.target.value);
    };

    const validaCpfCnpj = (event) => {
        if (cpfCnpj.length > 0 && cpfCnpj.length <= 11) {
            if (cpf.isValid(cpfCnpj)) {
                const errorsTemp = {...errors}
                delete errorsTemp.cnpj_cpf;
                setError(false);
                setErrors(errorsTemp);
                setFormContrato({
                    ...formContrato,
                    cnpj_cpf: cpfCnpj,
                });
                // enableScroll()
            } else {
                setErrors({...errors, cnpj_cpf: "CPF Inválido"});
                setError(true);
                // disableScroll()
            }
        } else if (cpfCnpj.length > 0 && cpfCnpj.length <= 14) {
            if (cnpj.isValid(cpfCnpj)) {
                const errorsTemp = {...errors}
                delete errorsTemp.cnpj_cpf;
                setError(false);
                setErrors(errorsTemp)
                // enableScroll()
                setFormContrato({
                    ...formContrato,
                    cnpj_cpf: cpfCnpj,
                });
            } else {
                setErrors({...errors, cnpj_cpf: "CNPJ Inválido"});
                // disableScroll()
                setError(true);
            }
        }
    }

    // function disableScroll() {
    //     // Get the current page scroll position
    //     scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //     scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    //         // if any scroll is attempted, set this to the previous value
    //         window.onscroll = function() {
    //             window.scrollTo(scrollLeft, scrollTop);
    //         };
    // }
    
    // function enableScroll() {
    //     window.onscroll = function() {};
    // }

    return (
        <TextField
            variant="outlined"
            label={label}
            value={cpfCnpj}
            name="cnpj_cpf"
            onChange={mudaCpfCnpj}
            onBlur={validaCpfCnpj}
            InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                    format: cpfCnpj.length > 11 ? "##.###.###/####-##" : "###.###.###-#####"
                },
            }}
            sx={{ margin: '1rem 0' }}
            error={errors.hasOwnProperty('cnpj_cpf')}
            helperText={errors.hasOwnProperty('cnpj_cpf') ? errors.cnpj_cpf : "Somente números"}
            fullWidth={fullWidth}
        />
    );
}

export default CampoCpfCnpj;