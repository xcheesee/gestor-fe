import { Box, Button, Fade, Paper, Typography } from "@mui/material"
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Link, useNavigate } from "react-router-dom";

const MenuInicial = ({ title }) => {
    return(
        <Fade in={true}>
            <Paper className="lg:w-[1024px] w-full px-4 pt-4 pb-8 place-self-center" elevation={6}>
                <Box>
                    <Typography className='text-3xl pb-4 font-light'>{title}</Typography>
                </Box>
                <Box className='px-4 flex flex-col'>
                    <Box className="grid md:grid-cols-2 gap-4">
                        <MenuButton path='/contrato'>
                            <TextSnippetIcon fontSize="large" className="mx-2"/> Contratos
                        </MenuButton>

                        <MenuButton>
                            <FilePresentIcon fontSize="large" className="mx-2"/> Docs. Referenciais
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
            <Link to={path} className="w-full">
                <Button 
                    variant="outlined" 
                    className={`h-60 text-4xl font-thin w-full ${className}`}
                    //onClick={handleClick}
                >
                    { children }
                </Button>
            </Link>
    )
}

export default MenuInicial