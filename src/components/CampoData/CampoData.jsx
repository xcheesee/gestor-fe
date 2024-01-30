import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const CampoData = ({ label, defaultValue, name, helperText, error, size, required, margin, fullWidth }) => {
    return (
        <TextField 
            variant="outlined"
            label={label} 
            defaultValue={defaultValue}
            name={name}
            helperText={helperText}
            error={error} 
            size={size}
            type="date"
            InputProps={{
                startAdornment: <InputAdornment position="start"> </InputAdornment>,
            }}
            required={required}
            sx={ margin === "" ? { margin: '0' } : {margin: margin} }
            fullWidth={fullWidth}
            // {...props}
        />
    );
}

export default CampoData;