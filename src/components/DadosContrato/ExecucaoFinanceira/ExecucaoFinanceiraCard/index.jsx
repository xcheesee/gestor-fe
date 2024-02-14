import { Box, Divider, IconButton, Tooltip, Typography, Paper } from "@mui/material";
import { formataValores } from '../../../../commom/utils/utils';
import EditIcon from '@mui/icons-material/Edit';

export default function ExecucaoFinanceiraCard({
    execucao, 
    carregando,
    handleClickEditarAno
}) {

    return(
        <Box
            elevation={3}
            component={Paper}
            sx={{ 
                padding: '1rem',
                minWidth: '16rem',
                mr: '1rem'
            }}
        >
            <Divider
                textAlign='right'
                sx={{
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    mb: '1rem'
                }}
            >
                {execucao.ano}
            </Divider>
            
            <Box sx={{ display: 'flex' }}>
                <Box>
                    <Typography component="span" className="font-medium">
                        Planejado(LOA)
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {formataValores(execucao.planejado)}
                        </Typography>
                    </Typography>

                    <Typography component="span" className="font-medium">
                        Reservado
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem'}}>
                            {formataValores(execucao.reservado)}
                        </Typography>
                    </Typography>
        
                    <Typography component="span" className="font-medium">
                        Contratado
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem'}}>
                            {formataValores(execucao.contratado)}
                        </Typography>
                    </Typography>
        
                </Box>
                
                <Box 
                    sx={{ 
                        alignSelf: 'flex-end', 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'flex-end' 
                    }}
                >
                    <Tooltip title="Editar" arrow>
                        <Box>
                            <IconButton
                                onClick={() => handleClickEditarAno(execucao)}
                                disabled={carregando}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
}