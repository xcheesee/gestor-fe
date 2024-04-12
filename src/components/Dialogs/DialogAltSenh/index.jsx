import React, { useState } from 'react';
import { 
    Dialog, 
} from '@mui/material';
import FeedbackDialog from './FeedbackDialog';
import SenhaForm from './SenhaForm';

const DialogAltSenh = (props) => {
    const [reqResponse, setReqResponse] = useState('')

    return(
        <Dialog open={props.openAltSenha} fullWidth={reqResponse === ''} maxWidth="md">
           {reqResponse === ''
                ? <SenhaForm 
                    {...props}
                    reqResponse={reqResponse}
                    setReqResponse={setReqResponse}
                />
                : <FeedbackDialog
                    setOpenAltSenha={props.setOpenAltSenha}
                    setReqResponse={setReqResponse}
                    reqResponse={reqResponse}
                />
            }
        </Dialog>
    )
}

export default DialogAltSenh