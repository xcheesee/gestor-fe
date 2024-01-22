import { Menu, MenuItem, Select, Typography } from "@mui/material"
import { useState } from "react"
export default function MonthPicker({label}) {
    const [selected, setSelected] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
   return(
    <div className="relative w-full h-[56px]">
        <div 
            className={`w-full h-full relative border border-[#c6c6c6] hover:border-black ${anchorEl ? "!border-[#3b948c] border-2" : ""} border-solid rounded`}
            onClick={(e) => {
                setAnchorEl(e.currentTarget)
            }}
        ></div>
        <span  className={`absolute top-1/2 text-lg transition-all font-sans text-[#666666]  bg-white ${anchorEl ? "!top-0 !left-1 scale-75" : ""} -translate-y-1/2 left-2 px-2`} >Mes</span>
        <span  className="absolute top-1/2 right-0 -translate-y-1/2 pr-4" >Mes</span>
        <Menu 
            className="w-full h-full"
            open={open}
            onClose={(e) => {
                setAnchorEl(null)
            }}
            anchorEl={anchorEl}
        >
            <MenuItem sx={{display: 'inline-flex', width: "50%"}}><div className="w-full">pog</div></MenuItem>
            <MenuItem sx={{display: 'inline-flex', width: "50%"}}><div className="w-full">champ</div></MenuItem>
        </Menu>
    </div>
   ) 
}