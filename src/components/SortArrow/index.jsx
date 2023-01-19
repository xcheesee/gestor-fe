import { CircularProgress, Fade } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SortArrow = ({ loading, url }) => {
    if (loading) {
        return (
            <CircularProgress 
                sx={{ 
                    color: (theme) => theme.palette.color.main, 
                    margin: '0 0.38rem'
                }}
                size="0.75rem"
            />
        );
    } else {
        if (url.sort[0] === '-') {
            return (
                <Fade in={true}>
                    <KeyboardArrowUpIcon />
                </Fade>
            );
        } else {
            return (
                <Fade in={true}>
                    <KeyboardArrowDownIcon />
                </Fade>
            );
        }
    }
}

export default SortArrow