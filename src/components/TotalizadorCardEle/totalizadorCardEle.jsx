import { Box } from "@mui/material";

export default function TotalizadorCardEle({
    className,
    title,
    val,
    icon
}) {
    return(
        <Box className={`${className} rounded justify-center content-center py-2 flex flex-col gap-2 shadow-lg relative`}>
            <Box className="text-3xl text-white font-bold text-center" >{title}</Box>
            <Box className="flex justify-center">
                <span className="self-start justify-self-start absolute top-[60%] -translate-y-1/2 left-[5%]">{icon}</span>
                <span>
                    <span className="text-teal-100 font-bold self-end pb-2 text-lg">R$</span>
                    <span className="text-white font-bold text-[3.5rem] self-end">{val.toLocaleString('pt-BR', { maximumFractionDigits: 2})}</span>
                </span>
            </Box>
        </Box>
    )
}