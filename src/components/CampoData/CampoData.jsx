import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const CampoData = (props) => {
    return (
        <TextField 
            variant="outlined"
            label={props.label} 
            value={props.value}
            name={props.name}
            onChange={props.onChange}
            onBlur={props.onBlur}
            helperText={props.helperText}
            error={props.error} 
            size={props.size}
            type="date"
            InputProps={{
                startAdornment: <InputAdornment position="start"> </InputAdornment>,
            }}
            required={props.required}
            sx={ props.margin === "" ? { margin: '1rem 0' } : {margin: props.margin} }
            fullWidth={props.fullWidth}
            {...props}
        />
    );
}

export default CampoData;