import React, { useState } from 'react';
import { 
    Box,
    Divider,
    Paper
} from '@mui/material';

import DialogConfirmacao from '../DialogConfirmacao';
import BotoesTab from '../BotoesTab';
import BotaoAdicionar from '../BotaoAdicionar';

const TabAditamentos = (props) => {
    const campos = [
        "Tipo",
        "Valor",
        "Fim da vigência atualizada",
        "Taxa de reajuste",
        "Data base do reajuste",
        "Valor reajustado"
    ];

    const valores = [
        props.tipo_aditamentos,
        props.formataValores(props.valor_aditamento),
        props.formataData(props.data_fim_vigencia_atualizada),
        props.formataPorcentagem(props.indice_reajuste),
        props.formataData(props.data_base_reajuste),
        props.formataValores(props.valor_reajustado)
    ];

    return props.retornaCampoValor(campos, valores, props.estaCarregado);
}

const ListaAditamentos = (props) => {
    const {
        aditamentos,
        estaCarregado,
        formataValores,
        formataData,
        formataPorcentagem,
        retornaCampoValor,
        numContrato,
        setSnackbar,
        ...other
    } = props;

    const [acao, setAcao] = useState('editar');
    const [carregando, setCarregando] = useState(false);
    const [openFormAditamentos, setOpenFormAditamentos] = useState({
        open: false,
        acao: 'adicionar'
    });
    const [openConfirmacao, setOpenConfirmacao] = useState({
        open: false,
        id: ''
    });
    const [formAditamentos, setFormAditamentos] = useState({
        contrato_id: numContrato,
        tipo_aditamentos: '',
        valor_aditamento: '',
        data_fim_vigencia_atualizada: '',
        indice_reajuste: '',
        data_base_reajuste: '',
        valor_reajustado: ''
    });

    return (
        <Box>
            {aditamentos.map((aditamento, index) => {
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
                            Aditamento # {aditamento.id}
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TabAditamentos 
                                tipo_aditamentos={aditamento.tipo_aditamentos}
                                valor_aditamento={aditamento.valor_aditamento}
                                data_fim_vigencia_atualizada={aditamento.data_fim_vigencia_atualizada}
                                indice_reajuste={aditamento.indice_reajuste}
                                data_base_reajuste={aditamento.data_base_reajuste}
                                valor_reajustado={aditamento.valor_reajustado}
                                estaCarregado={estaCarregado}
                                formataValores={formataValores}
                                formataData={formataData}
                                formataPorcentagem={formataPorcentagem}
                                retornaCampoValor={retornaCampoValor}
                            />

                            <BotoesTab 
                                // editar={(e) => { handleClickEditar(e,aditamento,aditamento.id); }}
                                // excluir={() => { handleClickExcluir(aditaditamento.id); }}
                            />
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

export default ListaAditamentos;