import React from 'react';
import { 
    Typography,
    Tooltip,
    IconButton,

} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link } from 'react-router-dom';

const HeaderFormulario = (props) => {
    const caminho = props.acao === 'editar' ? '' : '/principal' 

    return (
        <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
                padding: '1rem', 
                background: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.color.main,
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
                fontWeight: 'light',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Link to={caminho}>
                <Tooltip title="Voltar" arrow>
                    <IconButton sx={{ mr: '0.5rem' }}>
                        <ArrowBackIosNewIcon sx={{ color: (theme) => theme.palette.color.main }} />
                    </IconButton>
                </Tooltip>
            </Link>
            {props.children}
        </Typography>
    );
}

export default HeaderFormulario;