import React from 'react';
import { DateRangePicker, CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './calendarioRange.css'
import pt_BR from 'rsuite/locales/pt_BR'

const CalendarioRange = ({intervalo, onChange, label, separador, size, rangeStart, rangeEnd, placeholder}) => {
    const datas = intervalo[0] === '' ? [null , null] : [new Date(intervalo[0]+'T00:00:00'), new Date(intervalo[1]+'T00:00:00')];
    console.log(datas)
    
    return (
        <div className='inputContainer'>
            <span className='input'>{label}</span>
            <CustomProvider locale={pt_BR}>
                <DateRangePicker
                    character={separador}
                    value={datas}
                    format={"dd/MM/yyyy"}
                    placeholder={placeholder}
                    onChange={e => {
                        e === null ? onChange(rangeStart, rangeEnd, ['', ''])
                        : onChange(rangeStart, rangeEnd, [e[0]?.toLocaleDateString('fr-CA'), e[1]?.toLocaleDateString('fr-CA')])
                        
                    }}
                    size={size}
                />
            </CustomProvider>
        </div>
    )
}

export default CalendarioRange