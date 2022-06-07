import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const BotaoAdicionar = ({ fnAdicionar, texto }) => {
    return (
        <Fab 
            onClick={fnAdicionar}
            sx={{ 
                position: 'sticky',
                bottom: '0%',
                left: '100%',
                zIndex: '80',
                textTransform: 'none',
                borderRadius: '5px'
            }}
            color="primary"
            variant="extended"
        >
            <AddIcon sx={{ mr: '0.3rem' }} /> {texto}
        </Fab>
    );
}

export default BotaoAdicionar;