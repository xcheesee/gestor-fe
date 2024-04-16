import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormExecFinanceira from './FormExecFinanceira';
import FormEditExecFinanceira from './FormEditExecFinanceira';
import ExecucaoFinanceiraCard from './ExecucaoFinanceiraCard';
import { getExecucoesFinanceiras } from '../../../commom/utils/api';
import { useQuery } from '@tanstack/react-query';
import DialogConf from '../../Dialogs/DialogConf';

const ExecucaoFinanceira = ({ numContrato }) => {
    const [errors, setErrors] = useState({});
    const [carregando, setCarregando] = useState(false);
    const [openEditExecFinanceira, setOpenEditExecFinanceira] = useState(false);
    const [currExecucao, setCurrExecucao] = useState({})
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        acao: ''
    });
    const [openFormExecFinanceira, setOpenFormExecFinanceira] = useState({
        open: false,
        acao: 'adicionar'
    });

    const execucoes_financeiras = useQuery({
        queryKey: ['execucoes', numContrato],
        queryFn: async () => await getExecucoesFinanceiras(numContrato)
    })

    const formId = "exec-form"

    const handleClickAdicionarAno = () => {
        setOpenFormExecFinanceira({
            open: true,
            acao: 'adicionar'
        });
    }

    async function handleClickEditarAno (execucao) {
        setCurrExecucao(execucao)
        setOpenEditExecFinanceira(true);
    }

    const Conteudo = () => ( 
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                margin: '2rem 0', 
            }}
        >
            <Box
                sx={{ 
                    padding: '1rem',
                    display: 'flex',
                    overflow: 'auto',
                    mb: '1rem'
                }} 
            >
                {execucoes_financeiras?.data?.length  > 0
                    ? execucoes_financeiras?.data?.map( (execucao, i) => 
                        <ExecucaoFinanceiraCard 
                            key={`ex_card${i}`}
                            execucao={execucao} 
                            carregando={carregando}
                            setCarregando={setCarregando}
                            handleClickEditarAno={handleClickEditarAno}
                        />
                    )
                    :<Typography sx={{ margin: '1rem' }}>
                        Nenhum dado de execução financeira disponível para este contrato
                    </Typography>
                }
            </Box>
            
            <Box
                sx={{
                    alignSelf: 'flex-start',
                    padding: '1rem',
                    pt: 0,
                }}
            >
                <Button
                    sx={{
                        textTransform: 'none'
                    }}
                    onClick={handleClickAdicionarAno}
                >
                    <AddIcon sx={{ mr: '0.2rem' }} />
                    Adicionar Ano 
                </Button>
            </Box>
        </Box>
    )
    
    return (
        <Box>
            <Typography variant="h2" sx={{ fontSize: '2rem', margin: '2rem 0 0 0' }}>
                Execução Financeira do Contrato
            </Typography>

            <Conteudo />

            <FormExecFinanceira 
                formId={formId}
                contratoId={numContrato}
                openFormExecFinanceira={openFormExecFinanceira}
                setOpenFormExecFinanceira={setOpenFormExecFinanceira}
                errors={errors}
                setErrors={setErrors}
                setOpenConfirmacao={setOpenConfirmacao}
            />

            <FormEditExecFinanceira 
                openEditExecFinanceira={openEditExecFinanceira}
                formId={formId}
                execucao={currExecucao}
                setExecucao={setCurrExecucao}
                setOpenEditExecFinanceira={setOpenEditExecFinanceira}
                errors={errors}
                setErrors={setErrors}
                carregando={carregando}
                setCarregando={setCarregando}
                numContrato={numContrato}
            />

            <DialogConf 
                title={`Enviar Execução Financeira`}
                body={<Typography>Deseja Enviar a Execução Financeira?</Typography>}
                formId={formId}
                open={openConfirmacao.open}
                setOpen={setOpenConfirmacao}
                acao={"Enviar"}
            />
        </Box>
    );
}

export default ExecucaoFinanceira;