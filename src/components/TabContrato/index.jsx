import { Box, Divider } from "@mui/material";
import { TabValues } from "../../commom/utils/utils";

export default function TabContrato({label, dados, labels, children}) {
    return(
        <>
            <Box className="p-4 mb-8">
                <Divider textAlign='right' className='font-light text-xl'>
                    {label} #{dados.id}
                </Divider>
                <Box className="grid grid-cols-[1fr_min-content-min-content]">
                    <Box className="grid grid-cols-[1fr_min-content]">
                        <TabValues entry={dados} labels={labels} label={label} />
                        {children} {/* //area destina aos botoes de cada card */}
                    </Box>
                </Box>
            </Box>
        </>
    )
}
