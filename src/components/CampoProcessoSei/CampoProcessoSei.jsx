import React, { useState } from 'react';
import { TextField } from '@mui/material';
import ReactInputMask from 'react-input-mask';

const CampoProcessoSei = (props) => {
    const {
        defaultValue="",
        error,
        helperText,
        name,
        label,
        ...other
    } = props;

    const [processoSei, setProcessoSei] = useState(defaultValue);

    return (
        <ReactInputMask
            mask="9999.9999/9999999-9"
            maskChar=""
            value={processoSei}
            onChange={(e) => { setProcessoSei(e.target.value) }}
        >
            {() => (<TextField
                    variant="outlined"
                    label={label}
                    sx={{ margin: '1rem 0' }}
                    helperText={helperText}
                    error={error}
                    name={name}
                    fullWidth
                    required
                    {...other}
                />)
            }
        </ReactInputMask>
    );
}

export default CampoProcessoSei;