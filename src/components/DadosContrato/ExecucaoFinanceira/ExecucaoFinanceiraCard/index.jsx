import { Box, Divider, IconButton, Tooltip, Typography, Paper } from "@mui/material";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { formataValores } from '../../../../commom/utils/utils';
import EditIcon from '@mui/icons-material/Edit';

export default function ExecucaoFinanceiraCard({
    execucao, 
    carregando,
    setCarregando, 
    setDetalheExecFin,
    setOpenDetalhes,
    handleClickEditarAno
}) {

    //async function detalhaExecucaoFinanceira (execucao) {
    //    setCarregando(true);

    //    //const data = await getExecucaoFinanceira(id)
    //    //console.log(execucao)
    //    //setDetalheExecFin()
    //    //setOpenDetalhes(true)

    //    setCarregando(false)
    //}

    return(
        <Box
            elevation={3}
            component={Paper}
            sx={{ 
                padding: '1rem',
                minWidth: '16rem',
                mr: '1rem'
            }}
            //key={index}
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
                    {/*<Tooltip title="Detalhes" arrow>
                        <Box>
                            <IconButton
                                //onClick={() => detalhaExecucaoFinanceira(execucao?.id)}
                                disabled={carregando}
                            >
                                <ManageSearchIcon />
                            </IconButton>
                        </Box>
                    </Tooltip>*/}
                    
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