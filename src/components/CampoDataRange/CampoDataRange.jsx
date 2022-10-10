import React from 'react';
import { DateRangePicker, CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './calendarioRange.css'
import pt_BR from 'rsuite/locales/pt_BR'
import { Box } from '@mui/material'

const CampoDataRange = ({intervalo, filtro, onChange, label, separador, size, placeholder}) => {
    //input recebido e convertido ao formato permitido de DateRangePicker. 
    //'T00:00:00' previne que datas sejam alteradas devido ao conflito de timezones e a implementacao de new Date()
    const datas = filtro[intervalo.inicio] === '' 
        ? [null , null] 
        : [new Date(filtro[intervalo.inicio]+'T00:00:00'), new Date(filtro[intervalo.fim]+'T00:00:00')];
    
    return (
        /* col-span-2 border-b border-material-border p-1 pt-0 */
        <Box 
            className={`inputContainer`} 
            sx={{
                borderBottom: 1,
                borderBottomColor: "#c4c4c4",
                padding: "0.25rem",
                paddingTop: 0,
                // gridColumnStart: 1, 
                // gridColumnEnd: 3
                }}
        >
            <span className='input'>{label}</span>
            <CustomProvider locale={pt_BR}>
                <DateRangePicker
                    character={separador}
                    value={datas}
                    format={"dd/MM/yyyy"}
                    placeholder={placeholder}
                    appearance="subtle"
                    // onClean={
                    //     e => onChange(intervalo.inicio, intervalo.fim, ['', ''])
                    // }
                    onChange={
                        //tranforma o output em string aaaa-mm-dd e envia-o para setFiltros
                        // e => onChange(intervalo.inicio, intervalo.fim, [e[0]?.toLocaleDateString('fr-CA') , e[1]?.toLocaleDateString('fr-CA')])
                        e => {
                            e !== null 
                            ? onChange(intervalo.inicio, intervalo.fim, [e[0]?.toLocaleDateString('fr-CA') , e[1]?.toLocaleDateString('fr-CA')])
                            : onChange(intervalo.inicio, intervalo.fim, ['', ''])
                        }
                    }
                    size={size}
                />
            </CustomProvider>
        </Box>
    )
}

export default CampoDataRange