import { Box, Button, Fade, IconButton, Paper, Typography } from "@mui/material"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FilePresentIcon from '@mui/icons-material/FilePresent';

const Menu = ({ title }) => {
    return(
        <Fade in={true}>
            <Paper className="lg:w-[1024px] w-full px-4 pt-4 pb-8 place-self-center" elevation={6}>
                <Box className='text-2xl pb-4 font-light text-slate-700'>
                    {/* {router.pathname !== "/" && router.pathname !== "/login"
                    ? <IconButton
                        onClick={() => {router.back()}}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    : ""} */}
                    {title}
                </Box>
                <Box className='px-4 flex flex-col'>
                    <Box className="grid grid-cols-2 gap-4">
                        <MenuButton>
                            <TextSnippetIcon fontSize="large" className="mx-2"/> Contratos
                        </MenuButton>

                        <MenuButton>
                            <FilePresentIcon fontSize="large" className="mx-2"/> Templates
                        </MenuButton>
                    </Box>
                </Box>
            </Paper>
        </Fade>
    )
}

function MenuButton ({ children, className = "" }) {
    // const router = useRouter()
    const handleClick = (e) => {
        e.preventDefault()
        // router.push(path)
    }

    return(
        <Button 
            variant="outlined" 
            className={`h-60 text-4xl font-thin ${className}`}
            onClick={handleClick}>
            { children }
        </Button>
    )
}

export default Menu