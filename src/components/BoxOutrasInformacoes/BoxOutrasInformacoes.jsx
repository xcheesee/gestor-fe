import React from 'react';
import { 
    Box,
    Divider,
    Typography,
    TextField
} from '@mui/material';

const BoxOutrasInformacoes = (props) => {
    const { 
        outras_informacoes,
        label,
        formContrato,
        errors,
        acao,
        defaultValue
     } = props;

    return (
        <Box>
            {
            acao === 'editar'
            ?
                ""
            :
                <Divider sx={{ mb: '1.25rem' }} textAlign="left"> 
                    <Typography variant="h5" sx={{ fontWeight: 'light' }}>
                        Outras informações
                    </Typography> 
                </Divider>
            }

            <TextField
                variant="outlined"
                multiline
                minRows={6}
                className="form__campo"
                label={label}
                inputRef={outras_informacoes}
                defaultValue={defaultValue ? defaultValue : formContrato.outras_informacoes}
                name="outras_informacoes"
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('outras_informacoes')}
                helperText={errors.hasOwnProperty('outras_informacoes') ? errors.outras_informacoes : " "}
                fullWidth
            />
        </Box>
    );
}

export default BoxOutrasInformacoes;