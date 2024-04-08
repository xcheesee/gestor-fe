import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BotoesTab = ({ editar, excluir }) => {
    return (
        <Box className='grid lg:grid-cols-2 lg:items-start items-center gap-2'>
            <Tooltip title="Editar" arrow>
                <Box className="grid w-full rounded ">
                    <IconButton onClick={editar} className='max-lg:text-white max-lg:bg-[#3b948c] max-lg:!rounded max-lg:hover:!bg-[#234c4a]'>
                        <EditIcon />
                    </IconButton>
                </Box>
            </Tooltip>

            <Tooltip title="Excluir" arrow>
                <Box className="grid w-full rounded ">
                    <IconButton onClick={excluir} className='max-lg:text-white w-full max-lg:!rounded max-lg:!bg-red-500 max-lg:hover:!bg-red-800'>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Tooltip>
        </Box>
    );
}

export default BotoesTab;