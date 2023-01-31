import { Box, Divider, Fade, IconButton, Paper, Typography } from "@mui/material";
import { contratoLabels } from "../../commom/utils/constants";
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import BotaoAdicionar from "../BotaoAdicionar";

export default function TabContrato({label, dados, num}) {
    return(
        <>
            <Fade in={true} timeout={400}>
                <Paper elevation={3} className="p-4 mb-8">
                    <Divider textAlign='right' className='font-light text-xl'>
                        {label} #{num}
                    </Divider>
                    <Box className="grid grid-cols-[1fr_min-content-min-content]">
                        <Box className="grid grid-cols-[1fr_min-content]">
                            <Box>
                                {Object.entries(dados)?.map((entry) => (
                                    <Box className="m-4">
                                        <Typography className="font-bold pb-2">{contratoLabels[entry[0]]}</Typography>
                                        <Typography className="ml-4">{entry[1]}</Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Box className="flex items-start m-4">
                                <IconButton>
                                    <ModeIcon />
                                </IconButton>
                                <IconButton>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </>

    )
}
