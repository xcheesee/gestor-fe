import React, { useEffect, useRef, useState } from 'react';
import { TextField } from '@mui/material';
import ReactInputMask from 'react-input-mask';

const CampoProcessoSei = React.forwardRef((props, ref) => {
    const localRef = useRef(null) // default ref para componentes que nao necessitam receber sinal externo de clear input
    const clearSwitch = ref || localRef 
    const {
        defaultValue="",
        error,
        helperText,
        name,
        label,
        required = false,
        ...other
    } = props;

    const [processoSei, setProcessoSei] = useState(defaultValue);

    useEffect(() => {
        if(clearSwitch.current === null) return
        setProcessoSei("")
    },[clearSwitch])

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
                    helperText={helperText}
                    error={error}
                    name={name}
                    required={required}
                    fullWidth
                    {...other}
                />)
            }
        </ReactInputMask>
    );
})

export default CampoProcessoSei;