import React from 'react';
import { DateRangePicker, CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './calendarioRange.css'
import pt_BR from 'rsuite/locales/pt_BR'

const CalendarioRange = (props) => {
    const {intervalo, onChange} = props;
    let datas = intervalo === '' ? [new Date() , new Date()] : intervalo;
    return (
    <div className='inputContainer'>
        <span className='input'>Vencimento depois de - Vencimento antes de</span>
        <CustomProvider locale={pt_BR}>
            <DateRangePicker
                character={' / '}
                value={[new Date(), new Date()]}
                placeholder={'Vencimento depois de - Vencimento antes de'}
                onChange={onChange}
                size={'lg'}
            />
    </CustomProvider>
    </div>
    )
}

export default CalendarioRange
