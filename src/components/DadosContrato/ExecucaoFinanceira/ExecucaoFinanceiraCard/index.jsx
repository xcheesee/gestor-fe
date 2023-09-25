import { Box, Divider, IconButton, Tooltip, Typography, Paper } from "@mui/material";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { formataValores } from '../../../../commom/utils/utils';
import EditIcon from '@mui/icons-material/Edit';
import { getExecucaoFinanceira } from "../../../../commom/utils/api";

export default function ExecucaoFinanceiraCard({
    execucao_financeira, 
    carregando,
    setCarregando, 
    setDetalheExecFin,
    setOpenDetalhes,
    handleClickEditarAno
}) {

    async function detalhaExecucaoFinanceira (id) {
        setCarregando(true);

        const data = await getExecucaoFinanceira(id)
        setDetalheExecFin(data)
        setOpenDetalhes(true)

        setCarregando(false)
    }

    return(
        Object?.keys(execucao_financeira)?.map((execucao, index) => {
            return (
                <Box
                    elevation={3}
                    component={Paper}
                    sx={{ 
                        padding: '1rem',
                        minWidth: '16rem',
                        mr: '1rem'
                    }}
                    key={index}
                >
                    <Divider
                        textAlign='right'
                        sx={{
                            fontWeight: 'light',
                            fontSize: '1rem',
                            mb: '1rem'
                        }}
                    >
                        {execucao_financeira[execucao].mes}
                    </Divider>
                    
                    <Box sx={{ display: 'flex' }}>
                        <Box>
                            <Typography sx={{ fontWeight: 'medium' }} component="span">
                                Planejado(LOA)
                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                    {formataValores(execucao_financeira[execucao].planejado)}
                                </Typography>
                            </Typography>

                            <Typography sx={{ fontWeight: 'medium' }} component="span">
                                Reservado
                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                    {formataValores(execucao_financeira[execucao].planejado)}
                                </Typography>
                            </Typography>
        
                            <Typography sx={{ fontWeight: 'medium' }} component="span">
                                Contratado
                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                    {formataValores(execucao_financeira[execucao].contratado)}
                                </Typography>
                            </Typography>
        
                            {/*<Typography sx={{ fontWeight: 'medium' }} component="span">
                                Empenhado
                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                    {formataValores(execucao_financeira[execucao].empenhado)}
                                </Typography>
                            </Typography>
        
                            <Typography sx={{ fontWeight: 'medium' }} component="span">
                                Executado
                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                    {formataValores(execucao_financeira[execucao].executado)}
                                </Typography>
                            </Typography>
        
                            <Typography sx={{ fontWeight: 'medium' }} component="span">
                                Saldo
                                <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                                    {formataValores(execucao_financeira[execucao].saldo)}
                                </Typography>
                            </Typography>*/}
                        </Box>
                        
                        <Box 
                            sx={{ 
                                alignSelf: 'flex-end', 
                                width: '100%', 
                                display: 'flex', 
                                justifyContent: 'flex-end' 
                            }}
                        >
                            <Tooltip title="Detalhes" arrow>
                                <Box>
                                    <IconButton
                                        onClick={() => detalhaExecucaoFinanceira(execucao_financeira[execucao].id)}
                                        disabled={carregando}
                                    >
                                        <ManageSearchIcon />
                                    </IconButton>
                                </Box>
                            </Tooltip>
                            
                            <Tooltip title="Editar" arrow>
                                <Box>
                                    <IconButton
                                        onClick={() => handleClickEditarAno(execucao_financeira[execucao].id)}
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
        })
    )
}