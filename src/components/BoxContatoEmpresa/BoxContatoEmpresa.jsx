import React from 'react';
import { 
    Box,
    Divider,
    Typography,
    TextField, 
} from '@mui/material';
import CampoTelefone from '../CampoTelefone';

const BoxContatoEmpresa = (props) => {
    const {
        errors,
        formContrato,
        setFormContrato,
        nome_empresa,
        email_empresa,
        checaErrosEmail,
        acao,
        ...other
    } = props;

    return (
        <Box>
            {
            acao === "editar"
            ?
                ""
            :
                <Divider sx={{ mb: '1.25rem' }} textAlign="left"> 
                    <Typography variant="h5" sx={{ fontWeight: 'light' }}>Contato da empresa</Typography> 
                </Divider>
            }

            <TextField
                variant="outlined"
                className="form__campo"
                label="Nome da empresa"
                inputRef={nome_empresa}
                defaultValue={formContrato.nome_empresa}
                name="nome_empresa"
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('nome_empresa')}
                helperText={errors.hasOwnProperty('nome_empresa') ? errors.nome_empresa : " "}
                required
                fullWidth
            />

            <CampoTelefone 
                className="contrato-empresa__campo"
                formContrato={formContrato}
                setFormContrato={setFormContrato}
                error={errors.hasOwnProperty('telefone_empresa')}
                helperText={errors.hasOwnProperty('telefone_empresa') ? errors.telefone_empresa : " "}
                name="telefone_empresa"
                {...other}
            />

            <TextField
                variant="outlined"
                className="form__campo"
                label="E-mail da empresa"
                inputRef={email_empresa}
                defaultValue={formContrato.email_empresa}
                name="email_empresa"
                onBlur={checaErrosEmail}
                type="email"
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('email_empresa')}
                helperText={errors.hasOwnProperty('email_empresa') ? errors.email_empresa : " "}
                required
                fullWidth
            />
        </Box>
    );
}

export default BoxContatoEmpresa;