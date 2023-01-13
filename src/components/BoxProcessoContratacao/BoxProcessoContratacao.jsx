import React from 'react';
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

const BoxProcessoContratacao = (props) => {
    const {
        errors,
        processoContratacao,
        setProcessoContratacao,
        handleChangeModeloLicitacao,
        modelosLicitacao,
        carregando,
        handleChange,
        acao
    } = props;

    return (
        <Box>
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
                    label="Modalidade de licitação"
                    value={processoContratacao.licitacao_modelo_id === undefined ? "" : processoContratacao.licitacao_modelo_id}
                    name="licitacao_modelo_id"
                    onChange={(e) => { handleChangeModeloLicitacao(e, processoContratacao, setProcessoContratacao) }}
                    disabled={modelosLicitacao.length === 0}
                    fullWidth
                >
                    <MenuItem value={""}>---</MenuItem>
                    {modelosLicitacao.map((modeloLicitacao, index) => {
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

            <CampoData
                className="form__campo"
                label="Envio material técnico"
                value={processoContratacao.envio_material_tecnico}
                name="envio_material_tecnico"
                onChange={(e) => { handleChange(e, processoContratacao, setProcessoContratacao); }}
                margin="1rem 0"
                error={errors.hasOwnProperty('envio_material_tecnico')}
                helperText={errors.hasOwnProperty('envio_material_tecnico') ? errors.envio_material_tecnico : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label="Minuta edital"
                value={processoContratacao.minuta_edital}
                name="minuta_edital"
                onChange={(e) => { handleChange(e, processoContratacao, setProcessoContratacao); }}
                margin="1rem 0"
                error={errors.hasOwnProperty('minuta_edital')}
                helperText={errors.hasOwnProperty('minuta_edital') ? errors.minuta_edital : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label="Abertura certame"
                value={processoContratacao.abertura_certame}
                name="abertura_certame"
                onChange={(e) => { handleChange(e, processoContratacao, setProcessoContratacao); }}
                margin="1rem 0"
                error={errors.hasOwnProperty('abertura_certame')}
                helperText={errors.hasOwnProperty('abertura_certame') ? errors.abertura_certame : " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label="Homologação"
                value={processoContratacao.homologacao}
                name="homologacao"
                onChange={(e) => { handleChange(e, processoContratacao, setProcessoContratacao); }}
                margin="1rem 0"
                error={errors.hasOwnProperty('homologacao')}
                helperText={errors.hasOwnProperty('homologacao') ? errors.homologacao : " "}
                fullWidth
            />
        </Box>
    );
}

export default BoxProcessoContratacao;