import { Box, CircularProgress, Divider, Fade, IconButton, Paper, Typography } from "@mui/material";
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TabContrato({label, dados, handleEditPress, handleDeletePress, isLoading, labels}) {
    return(
        <>
            {
                isLoading
                    ?<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38rem' }}>
                        <CircularProgress size={30} />
                    </Box>
                    :dados?.map((entry, index) => {
                        return(
                            <Fade in={true} timeout={400} key={`${label}-${index}`}>
                                <Paper elevation={3} className="p-4 mb-8">
                                    <Divider textAlign='right' className='font-light text-xl'>
                                        {label} #{entry.id}
                                    </Divider>
                                    <Box className="grid grid-cols-[1fr_min-content-min-content]">
                                        <Box className="grid grid-cols-[1fr_min-content]">
                                            <Box>
                                                {Object.entries(entry)?.filter((keyVal) => !(keyVal[0] === "id" || keyVal[0] === "contrato_id"))?.map((keyVal, index) => 
                                                    (
                                                        <Box className="m-4" key={`tab-${label}-${index}`}>
                                                            <Typography className="font-bold pb-2">{labels[keyVal[0]]}</Typography>
                                                            <Typography className="ml-4">{keyVal[1]}</Typography>
                                                        </Box>
                                                ))}
                                            </Box>
                                            <Box className="flex items-start m-4">
                                                <IconButton onClick={() => handleEditPress(entry.id)}>
                                                    <ModeIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeletePress(entry.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Fade>
                        )
                    }) 
            }
        </>
    )
}
