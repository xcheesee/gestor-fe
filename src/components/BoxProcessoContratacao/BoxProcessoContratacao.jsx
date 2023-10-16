import React, { useState } from 'react';
import {
    Box, 
    Divider,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CircularProgress,
} from '@mui/material';
import CampoData from '../CampoData';
import { contratoLabels } from '../../commom/utils/constants';
import CampoDataControlada from '../CampoDataControlada';
import MaxPrazoInput from '../MaxPrazoInput';

const BoxProcessoContratacao = (props) => {
    const {
        errors,
        formId,
        processoContratacao,
        setProcessoContratacao,
        handleChangeModeloLicitacao,
        handleChangeEstado,
        numContrato,
        enviaDadosProcesso,
        modelosLicitacao,
        estados,
        carregando,
        handleChange,
        acao,
        dados
    } = props;

    const [validade, setValidade] = useState(dados.data_vencimento ?? "")

    return (
        <Box
            component="form"
            id={formId}
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                enviaDadosProcesso(e, formData, numContrato)
            }}
        >
            {
            acao === "editar"
                ?
                    ""
                :
                    <Divider sx={{ mt: '1.5rem', mb: '1.25rem' }} textAlign="left"> 
                        <Typography variant="h5" sx={{ fontWeight: 'light' }}>Processo de contratação</Typography> 
                    </Divider>
            }

            <FormControl 
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('licitacao_modelo_id')}    
                fullWidth 
            >
                <InputLabel id="licitacao_modelo-label">Modalidade de licitação</InputLabel>
                <Select
                    labelId="licitacao_modelo-label"
                    id="licitacao_modelo"
                    label={contratoLabels.licitacao_modelo}
                    value={processoContratacao.licitacao_modelo_id === undefined ? "" : processoContratacao.licitacao_modelo_id}
                    name="licitacao_modelo_id"
                    onChange={(e) => { handleChangeModeloLicitacao(e, processoContratacao, setProcessoContratacao) }}
                    disabled={modelosLicitacao?.length === 0}
                    fullWidth
                >
                    <MenuItem value={""}>---</MenuItem>
                    {modelosLicitacao?.map((modeloLicitacao, index) => {
                        return (
                            <MenuItem key={index} value={modeloLicitacao.id}>{modeloLicitacao.nome}</MenuItem>
                        );
                    })}
                </Select>
                <FormHelperText>
                    {errors.hasOwnProperty('licitacao_modelo_id') ? errors.licitacao_modelo_id : " "}
                </FormHelperText>

                {carregando === true
                    ? 
                    <CircularProgress 
                        size={20} 
                        sx={{ 
                            margin: '1rem auto',
                            position: 'absolute',
                            left: '50%',
                            top: '3%'
                        }} 
                    />
                    : ""
                }
            </FormControl>

            <FormControl 
                sx={{ margin: '1rem 0' }}
                error={errors.hasOwnProperty('estado_id')}    
                fullWidth 
            >
                <InputLabel id="estado-label">Status do Contrato</InputLabel>
                <Select
                    labelId="estado-label"
                    id="Status"
                    label={contratoLabels.estado}
                    value={processoContratacao.estado_id === undefined ? "" : processoContratacao.estado_id}
                    name="estado_id"
                    onChange={(e) => { handleChangeEstado(e, processoContratacao, setProcessoContratacao) }}
                    disabled={estados?.length === 0}
                    fullWidth
                >
                    <MenuItem value={""}>---</MenuItem>
                    {estados?.map((estado, index) => {
                        return (
                            <MenuItem key={index} value={estado.id}>{estado.valor}</MenuItem>
                        );
                    })}
                </Select>
                <FormHelperText>
                    {errors.hasOwnProperty('estado_id') ? errors.estado_id : " "}
                </FormHelperText>

                {carregando === true
                    ? 
                    <CircularProgress 
                        size={20} 
                        sx={{ 
                            margin: '1rem auto',
                            position: 'absolute',
                            left: '50%',
                            top: '3%'
                        }} 
                    />
                    : ""
                }
            </FormControl>

            <CampoData
                className="form__campo"
                label={contratoLabels.envio_material_tecnico}
                defaultValue={processoContratacao.envio_material_tecnico ?? ""}
                name="envio_material_tecnico"
                // onChange={(e) => { handleChange(e, processoContratacao, setProcessoContratacao); }}
                margin="1rem 0"
                error={errors.hasOwnProperty('envio_material_tecnico')}
                helperText={errors.hasOwnProperty('envio_material_tecnico') ? errors.envio_material_tecnico : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.minuta_edital}
                defaultValue={processoContratacao.minuta_edital ?? ""}
                name="minuta_edital"
                // onChange={(e) => { handleChange(e, processoContratacao, setProcessoContratacao); }}
                margin="1rem 0"
                error={errors.hasOwnProperty('minuta_edital')}
                helperText={errors.hasOwnProperty('minuta_edital') ? errors.minuta_edital : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.abertura_certame}
                defaultValue={processoContratacao.abertura_certame ?? ""}
                name="abertura_certame"
                // onChange={(e) => { handleChange(e, processoContratacao, setProcessoContratacao); }}
                margin="1rem 0"
                error={errors.hasOwnProperty('abertura_certame')}
                helperText={errors.hasOwnProperty('abertura_certame') ? errors.abertura_certame : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.homologacao}
                defaultValue={processoContratacao.homologacao ?? ""}
                name="homologacao"
                // onChange={(e) => { handleChange(e, processoContratacao, setProcessoContratacao); }}
                margin="1rem 0"
                error={errors.hasOwnProperty('homologacao')}
                helperText={errors.hasOwnProperty('homologacao') ? errors.homologacao : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.data_assinatura}
                defaultValue={dados.data_assinatura ?? ""}
                name="data_assinatura"
                margin="1rem 0"
                error={errors.hasOwnProperty('data_assinatura')}
                helperText={errors.hasOwnProperty('data_assinatura') ? errors.data_assinatura : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.data_inicio_vigencia}
                defaultValue={dados.data_inicio_vigencia ?? ""}
                name="data_inicio_vigencia"
                margin="1rem 0"
                error={errors.hasOwnProperty('data_inicio_vigencia')}
                helperText={errors.hasOwnProperty('data_inicio_vigencia') ? errors.data_inicio_vigencia : " "}
                fullWidth
            />

            <CampoDataControlada
                className="form__campo"
                label={contratoLabels.data_vencimento}
                value={validade}
                setValue={setValidade}
                name="data_vencimento"
                margin="1rem 0"
                error={errors.hasOwnProperty('data_vencimento')}
                helperText={errors.hasOwnProperty('data_vencimento') ? errors.data_vencimento : " "}
                fullWidth
            />

            <MaxPrazoInput
                helperText="A contar da data de vencimento..."
                validade={validade}
                defaultValue={dados.data_prazo_maximo ?? ""}
                label={contratoLabels.prazo_a_partir_de}
                disabled={validade === "" ?? true}
            />
        </Box>
    );
}

export default BoxProcessoContratacao;