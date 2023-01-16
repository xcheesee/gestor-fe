import { Box, Button, Fade, Paper } from "@mui/material"
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { useNavigate } from "react-router-dom";

const MenuInicial = ({ title }) => {
    return(
        <Fade in={true}>
            <Paper className="lg:w-[1024px] w-full px-4 pt-4 pb-8 place-self-center" elevation={6}>
                <Box className='text-2xl pb-4 font-light text-slate-700'>
                    {title}
                </Box>
                <Box className='px-4 flex flex-col'>
                    <Box className="grid grid-cols-2 gap-4">
                        <MenuButton path='/contrato'>
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

function MenuButton ({ children, className = "" , path = '/404'}) {
    const navigate = useNavigate()
    const handleClick = (e) => {
        e.preventDefault()
        navigate(path)
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

export default MenuInicial