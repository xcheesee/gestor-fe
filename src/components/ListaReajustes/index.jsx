import { Box, Divider, Fade, Paper } from "@mui/material";

export default function ListaReajustes ({}) {
    return(
        <Fade in={true} timeout={400}>
            <Paper elevation={3} className="p-4 mb-8">
                <Divider textAlign='right' className='font-light text-xl'>
                    Reajuste #X
                </Divider>
                <Box className="grid grid-cols-[1fr_min-content-min-content]">
                    <Box>

                    </Box>
                    
                </Box>
            </Paper>
        </Fade>
    )
}