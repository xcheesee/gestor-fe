import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BotoesTab = ({ editar, excluir }) => {
    return (
        <Box className='flex items-start m-4'>
            <Tooltip title="Editar" arrow>
                <IconButton onClick={editar}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Excluir" arrow>
                <IconButton onClick={excluir}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}

export default BotoesTab;