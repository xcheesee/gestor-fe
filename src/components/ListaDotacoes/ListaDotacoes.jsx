import React from 'react';
import {
    Box,
    Divider,
    Paper,
    Typography,
    Button
} from '@mui/material';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';
import AddIcon from '@mui/icons-material/Add';

const retornaNumDotacao = (numero_dotacao, descricao) => {
    return [`${numero_dotacao}\n${descricao}`];
}

const TabDotacoes = (props) => {
    const campos = [
        "Número dotação",
        "Valor",
    ];

    const valores = [
        retornaNumDotacao(props.numero_dotacao, props.descricao),
        props.formataValores(props.valor_dotacao),
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaDotacoes = (props) => {
    const {
        dotacoes,
        estaCarregado,
        formataValores,
        retornaCampoValor
    } = props;

    return (
        <Box>
            {dotacoes.map((dotacao, index) => {
                return (
                    <Box
                        key={index}
                        elevation={3}
                        component={Paper}
                        sx={{ padding: '1rem', mb: '2rem' }}
                    >
                        <Divider
                            textAlign='right'
                            sx={{
                                fontWeight: 'light',
                                fontSize: '1.25rem'
                            }}
                        >
                            Dotação # {dotacao.id}
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ width: '50%' }}>
                                <TabDotacoes 
                                    retornaCampoValor={retornaCampoValor}
                                    estaCarregado={estaCarregado}
                                    formataValores={formataValores}
                                    numero_dotacao={dotacao.numero_dotacao}
                                    descricao={dotacao.descricao}
                                    valor_dotacao={dotacao.valor_dotacao}
                                    recursos={dotacao.recursos}
                                />
                            </Box>

                            <BotoesTab />
                        </Box>

                        <Box 
                            sx={{ 
                                margin: '1rem', 
                                padding: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                border: '1px solid #cdcdcd', 
                                borderRadius: '3px',
                            }} 
                        >
                            <Typography sx={{ margin: '0.5rem' }} key={index} component="pre">
                                <strong>Fonte(s) de recurso</strong>
                            </Typography>
                            
                            {dotacao.recursos.map((recurso, index) => {
                                return (
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            border: '1px solid #cdcdcd', 
                                            borderRadius: '3px',
                                            margin: '1rem',
                                            mb: '0',
                                            padding: '0.5rem',
                                            boxSizing: 'border-box'
                                        }}
                                        key={index}
                                    >
                                        <Typography sx={{ margin: '0.5rem' }}>
                                            {
                                                recurso.nome !== null
                                                ? recurso.nome
                                                : recurso.outros_descricao
                                            }
                                        </Typography>

                                        <BotoesTab />
                                    </Box>
                                );
                            })}
                            
                            <Box sx={{ alignSelf: 'flex-end', mt: '1rem' }}>
                                <Button sx={{ textTransform: 'none' }}>
                                    <AddIcon
                                        sx={{ mr: '0.2rem' }}
                                    />
                                    Adicionar fonte
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                );
            })}

            <BotaoAdicionar
                texto="Adicionar dotação"
            />
        </Box>
    );
}

export default ListaDotacoes;