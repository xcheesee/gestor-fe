import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
//import DialogDetalhes from './DialogDetalhes/DialogDetalhes';
import FormExecFinanceira from './FormExecFinanceira';
import FormEditExecFinanceira from './FormEditExecFinanceira';
import DialogConfirmacao from '../../DialogConfirmacao';
import ExecucaoFinanceiraCard from './ExecucaoFinanceiraCard';
import { /*getExecucaoFinanceira,*/ getExecucoesFinanceiras/*, postAnoExecFin*/ } from '../../../commom/utils/api';

const ExecucaoFinanceira = ({ numContrato }) => {
    //const [openDetalhes, setOpenDetalhes] = useState(false);
    //const [detalheExecFin, setDetalheExecFin] = useState({});
    const [execucoes_financeiras, setExecucoesFinanceiras] = useState({})
    const [errors, setErrors] = useState({});
    const [carregando, setCarregando] = useState(false);
    const [openEditExecFinanceira, setOpenEditExecFinanceira] = useState(false);
    const [currExecucao, setCurrExecucao] = useState({})
    const [acao, setAcao] = useState('adicionarExecFin');
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [openFormExecFinanceira, setOpenFormExecFinanceira] = useState({
        open: false,
        acao: 'adicionar'
    });

    useEffect(() => {
        (async () => {
            const execFin = await getExecucoesFinanceiras(numContrato)
            setExecucoesFinanceiras(execFin)
        })();

    }, [numContrato])

    const formId = "exec-form"

    const handleClickAdicionarAno = () => {
        setOpenFormExecFinanceira({
            open: true,
            acao: 'adicionar'
        });
        setAcao('adicionarExecFin');
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
                {execucoes_financeiras.length  > 0
                    ? execucoes_financeiras?.map( (execucao, i) => 
                        <ExecucaoFinanceiraCard 
                            key={`ex_card${i}`}
                            execucao={execucao} 
                            carregando={carregando}
                            setCarregando={setCarregando}
                            //setDetalheExecFin={setCurrExecucao}
                            //setOpenDetalhes={setOpenDetalhes}
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

            {/*<DialogDetalhes 
                detalhes={detalheExecFin}
                openDetalhes={openDetalhes}
                setOpenDetalhes={setOpenDetalhes}
            />*/}

            <FormExecFinanceira 
                formId={formId}
                contratoId={numContrato}
                openFormExecFinanceira={openFormExecFinanceira}
                setOpenFormExecFinanceira={setOpenFormExecFinanceira}
                errors={errors}
                setErrors={setErrors}
                carregando={carregando}
                setOpenConfirmacao={setOpenConfirmacao}
                //totais={totais}
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
            />

            <DialogConfirmacao 
                openConfirmacao={openConfirmacao}
                setOpenConfirmacao={setOpenConfirmacao}
                acao={acao}
                fnExcluir={() => {}}
                fnEditar={() => {}}
                carregando={carregando}
                texto="ano de execução financeira"
                formId={formId}
            />
        </Box>
    );
}

export default ExecucaoFinanceira;