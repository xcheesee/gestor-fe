import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const CampoDataControlada = ({ label, value, setValue, name, helperText, error, size, required, margin, fullWidth }) => {
    return (
        <TextField 
            variant="outlined"
            label={label} 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            name={name}
            helperText={helperText}
            error={error} 
            size={size}
            type="date"
            InputProps={{
                startAdornment: <InputAdornment position="start"> </InputAdornment>,
            }}
            required={required}
            sx={ margin === "" ? { margin: '1rem 0' } : {margin: margin} }
            fullWidth={fullWidth}
            // {...props}
        />
    );
}

export default CampoDataControlada;