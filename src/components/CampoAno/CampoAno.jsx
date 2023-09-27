import React, { useState, forwardRef } from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { NumberFormatCustom } from '../../commom/utils/utils';


NumberFormatCustom.propTypes = {
    onChange: PropTypes.func.isRequired,
};

const CampoAno = (props) => {
    const {
        label,
        name,
        //onChange,
        required=false,
        fullWidth,
        ...other
    } = props;

    //const [ano, setAno] = useState('')

    return (
        <TextField 
            sx={{ margin: '1rem 0' }}
            label={label}
            name={name}
            //value={ano}
            //onChange={(e) => setAno(e.target.value)}
            //onBlur={onChange}
            inputProps={{
                //inputComponent: NumberFormatCustom,
                maxLength: 4
            }}
            required={required}
            fullWidth={fullWidth}
            {...other}
        />
    );
}

export default CampoAno;