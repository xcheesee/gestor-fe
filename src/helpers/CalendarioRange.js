import React from 'react';
import { DateRangePicker, CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './calendarioRange.css'
import pt_BR from 'rsuite/locales/pt_BR'

const CalendarioRange = (props) => {
    const {intervalo, onChange} = props;
    let datas = intervalo[0] === '' ? [new Date() , new Date()] : intervalo;
    return (
    <div className='inputContainer'>
        <span className='input'>Vencimento depois de - Vencimento antes de</span>
        <CustomProvider locale={pt_BR}>
            <DateRangePicker
                className='darkBorder'
                character={' / '}
                value={[new Date(datas[0]), new Date(datas[1])]}
                placeholder={'Vencimento depois de - Vencimento antes de'}
                onChange={(e) => onChange('vencimento_depois_de', 'vencimento_antes_de', e)}
                size={'lg'}
            />
    </CustomProvider>
    </div>
    )
}

export default CalendarioRange
