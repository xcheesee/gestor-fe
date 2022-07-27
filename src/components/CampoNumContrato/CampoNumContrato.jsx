import React, { useState } from 'react';
import { TextField } from '@mui/material';
import InputMask from 'react-input-mask';

const CampoNumContrato = (props) => {
    const {
        formContrato,
        setFormContrato,
        ...other
    } = props;

    const [numeroContrato, setNumeroContrato] = useState(formContrato.numero_contrato);

    const handleBlur = (event) => {
        setFormContrato({
            ...formContrato,
            numero_contrato: numeroContrato.replaceAll(/\//gm, '').toUpperCase()
        });
    }

    return(
        <InputMask
            mask="999/aaaa/9999"
            maskChar=" "
            value={numeroContrato}
            onChange={(e) => {setNumeroContrato(e.target.value)}}
            onBlur={handleBlur}
        >
            {() => 
                <TextField
                    variant="outlined"
                    label="Nº Contrato / Nota de Empenho Inicial"
                    sx={{ margin: '1rem 0' }}
                    name="numero_contrato"
                    className="form__campo"
                    {...other}
                />
            }
        </InputMask>
    );
}

export default CampoNumContrato;