import { Box, CircularProgress } from "@mui/material";

export default function LoadingInput({label}) {
    return(

            <Box className="border relative border-solid py-2 border-[#c4c4c4] my-2 rounded flex justify-center">
                <CircularProgress size={36}/>
                <Box className="absolute top-0 left-2 bg-white px-2 text-[#666666] -translate-y-1/2">{label}</Box> 
            </Box>
    )
}