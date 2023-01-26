import React from 'react';
import { 
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import { contratoLabels } from '../../commom/utils/constants';

const DialogErroEnvio = ({ openErro, setOpenErro, acao, errors, setFocusError }) => {

    return (
        <Dialog 
            open={openErro.open} 
            onClose={() => { 
                setOpenErro({ ...openErro, open: false }); 
            }}
        >
            <DialogContent>
                <DialogContentText sx={{}}>
                    <div className='text-lg font-bold text-red-500 text-center'> Não foi possível {acao} o contrato.</div> 
                    {openErro.status === 422 
                        ? <div className='pl-2 pt-4 flex gap-4 flex-col'>
                            <b>Foram observadas irregularidades nos seguintes campos:</b>
                            {Object.entries(errors)?.map((keyVal) => {
                                return(
                                    <div className='pl-4'><b>{contratoLabels[keyVal[0]]}</b>: {keyVal[1]}</div>
                                )
                            })}
                        </div>: ""}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={() => { 
                        setOpenErro({ ...openErro, open: false });
                        setFocusError(Object.keys(errors)[0])
                    }} 
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogErroEnvio;