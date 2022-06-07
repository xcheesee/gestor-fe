import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper
} from '@mui/material';

import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';

const TabRecursoOrcamentario = (props) => {
    const campos = [
        "Nota de empenho",
        "Saldo de empenho",
        "Dotação orçamentária"
    ];

    const valores = [
        props.nota_empenho,
        props.formataValores(props.saldo_empenho),
        props.formataValores(props.dotacao_empenho)
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaRecOrcamentario = (props) => {
    const {
        recOrcamentarios,
        estaCarregado,
        formataValores,
        retornaCampoValor,
        numContrato,
        setSnackbar,
        ...other
    } = props;

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormRecOrcamentario, setOpenFormRecOrcamentario] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formRecOrcamentario, setFormRecOrcamentario] = useState({
        contrato_id: numContrato,
        nota_empenho: '',
        saldo_empenho: '',
        dotacao_empenho: ''
    });
    
    return (
        <Box>
            {recOrcamentarios.map((recOrcamentario, index) => {
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
                            Recurso orçamentário # {recOrcamentario.id}
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TabRecursoOrcamentario 
                                nota_empenho={recOrcamentario.nota_empenho}
                                saldo_empenho={recOrcamentario.saldo_empenho}
                                dotacao_empenho={recOrcamentario.dotacao_empenho}
                                estaCarregado={estaCarregado}
                                formataValores={formataValores}
                                retornaCampoValor={retornaCampoValor}
                            />

                            <BotoesTab 
                                // editar={(e) => { handleClickEditar(e, recOrcamentario, recOrcamentario.id); }}
                                // excluir={() => { handleClickExcluir(recOrcamentario.id); }}
                            />
                        </Box>
                    </Box>
                );
            })}

            <BotaoAdicionar 
                // fnAdicionar={handleClickAdicionar}
                texto="Adicionar recurso orçamentário"
            />

        </Box>
    );
}

export default ListaRecOrcamentario;