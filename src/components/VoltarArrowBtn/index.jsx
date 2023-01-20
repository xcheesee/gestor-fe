import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function VoltarArrowBtn ({ onClick }) {
    return (
        <Tooltip title="Voltar" arrow>
            <IconButton sx={{ mr: '0.5rem' }} onClick={onClick}>
                <ArrowBackIosIcon />
            </IconButton>
        </Tooltip>
    )
}