import React from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box
} from '@mui/material';

const dicionarioMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

const DialogDetalhes = (props) => {
    const {
        detalhes,
        openDetalhes,
        setOpenDetalhes,
        formataValores
    } = props;

    return (
        <Dialog open={openDetalhes} fullWidth maxWidth="xs">
            <Divider textAlign="right" sx={{ margin: '0 1rem' }}>
                <DialogTitle sx={{ fontWeight: 300, padding: '1rem 0' }}>
                        {`${dicionarioMeses[detalhes.mes - 1]} de ${detalhes.ano}`}
                </DialogTitle>
            </Divider>

            <DialogContent>
                <Box>
                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Planejado inicial
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {`${formataValores(detalhes.planejado_inicial)}`}
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Contratado inicial
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {`${formataValores(detalhes.contratado_inicial)}`}
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Valor reajuste
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {`${formataValores(detalhes.valor_reajuste)}`}
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Valor aditivo
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {`${formataValores(detalhes.valor_aditivo)}`}
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Valor cancelamento
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {`${formataValores(detalhes.valor_cancelamento)}`}
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Contratado atualizado
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {`${formataValores(detalhes.contratado_atualizado)}`}
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Empenhado
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {`${formataValores(detalhes.empenhado)}`}
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Executado
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {`${formataValores(detalhes.executado)}`}
                        </Typography>
                    </Typography>

                    <Typography sx={{ fontWeight: 'medium' }} component="span">
                        Saldo
                        <Typography sx={{ padding: '0 1rem', mb: '0.5rem' }}>
                            {`${formataValores(detalhes.saldo)}`}
                        </Typography>
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={() => setOpenDetalhes(false)}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogDetalhes;