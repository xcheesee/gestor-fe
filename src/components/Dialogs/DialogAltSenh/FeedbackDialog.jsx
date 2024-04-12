import React from 'react';
import { 
    Box,
    DialogContent, 
    DialogActions, 
    Button,
} from '@mui/material';

const FeedbackDialog = ({reqResponse, setOpenAltSenha, setReqResponse}) => {
    return (
        <>
            <DialogContent>{reqResponse.message}</DialogContent>
            <DialogActions sx={{ justifyContent: 'center'}}>
                <Box sx={{ display: 'flex', margin: '0.5rem', gap: '1rem' }}>
                    <Button
                        onClick={async () => {
                            setOpenAltSenha(false)
                            //timeout para evitar flicker de dialog
                            await(new Promise((res, rej) => {
                                setTimeout(() => res('true'), 500)
                            }))
                            setReqResponse('')
                        }}
                        variant="contained" sx={{ gap: '0.5rem' }}
                    >
                        Ok
                    </Button>
                </Box>
            </DialogActions>
        </>
    )
}

export default FeedbackDialog