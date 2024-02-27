
import React  from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { NumberFormatCustom } from '../../commom/utils/utils';
import { NumericFormat, PatternFormat } from 'react-number-format';


NumberFormatCustom.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default function CampoMasked(props) {
    const {
        label,
        name,
        onChange=() => {},
        value=null,
        defaultValue="",
        required=false,
        fullWidth,
        helperText,
        error=false,
        mask="",
        ...other
    } = props;

    if(value === null) {
        return (
            <PatternFormat 
                label={label}
                customInput={TextField}
                name={name}
                defaultValue={defaultValue}
                format={mask}
                required={required}
                fullWidth={fullWidth}
                helperText={helperText}
                error={error}
                {...other}
            />
        );
    }

    return (
        <PatternFormat 
            label={label}
            customInput={TextField}
            name={name}
            value={value}
            onChange={onChange}
            format={mask}
            allowEmptyFormatting
            required={required}
            fullWidth={fullWidth}
            {...other}
        />
    );

}