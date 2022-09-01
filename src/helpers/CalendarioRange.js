import React from 'react';
import { DateRangePicker, CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './calendarioRange.css'
import pt_BR from 'rsuite/locales/pt_BR'

const CalendarioRange = (props) => {
    const {intervalo, onChange, label, separador, size} = props;
    let datas = intervalo[0] === '' ? [null , null] : [new Date(intervalo[0]), new Date(intervalo[1])];
    
    return (
    <div className='inputContainer'>
        <span className='input'>{label}</span>
        <CustomProvider locale={pt_BR}>
            <DateRangePicker
                className='darkBorder'
                character={separador}
                value={datas}
                placeholder={label}
                onChange={(e) => onChange('vencimento_depois_de', 'vencimento_antes_de', e)}
                size={size}
            />
    </CustomProvider>
    </div>
    )
}

export default CalendarioRange