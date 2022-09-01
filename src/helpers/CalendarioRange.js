import React from 'react';
import { DateRangePicker, CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './calendarioRange.css'
import pt_BR from 'rsuite/locales/pt_BR'

const CalendarioRange = (props) => {
    const {intervalo, onChange, label, separador, size, rangeStart, rangeEnd} = props;
    const datas = intervalo[0] === '' ? [null , null] : [new Date(intervalo[0]), new Date(intervalo[1])];
    
    return (
    <div className='inputContainer'>
        <span className='input'>{label}</span>
        <CustomProvider locale={pt_BR}>
            <DateRangePicker
                className='darkBorder'
                character={separador}
                value={datas}
                placeholder={label}
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