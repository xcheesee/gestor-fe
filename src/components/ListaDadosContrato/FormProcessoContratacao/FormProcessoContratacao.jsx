import { editaDadosContrato, throwableGetData } from '../../../commom/utils/api';
import { useSetAtom } from 'jotai';
import { snackbarAtom } from '../../../atomStore';
import React, { useState } from 'react';
import {
    Box, 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CircularProgress,
} from '@mui/material';
import CampoData from '../../Inputs/CampoData';
import { contratoLabels } from '../../../commom/utils/constants';
import CampoDataControlada from '../../Inputs/CampoDataControlada';
import MaxPrazoInput from '../../Inputs/MaxPrazoInput';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const FormProcessoContratacao = (props) => {
    const {
        dados,
        setOpenProcCon,
        numContrato,
        formId,
        setCarregando,
    } = props;

    const queryClient = useQueryClient()

    const setSnackbar = useSetAtom(snackbarAtom)

    const [errors, setErrors] = useState({});
    const [validade, setValidade] = useState(dados.data_vencimento ?? "")

    const enviaDadosProcesso = async (e, formInterno, id) => {
        setCarregando(true)
        const res = await editaDadosContrato(e, dados, formInterno, id)
        if(res.status === 200) {
            setOpenProcCon(false);
            setSnackbar({
                open: true,
                severity: 'success',
                message: 'Processo de contratação editado com sucesso!',
            });
            queryClient.invalidateQueries(['contratoDados'])
        } else if(res.status === 422) {
            setErrors(res.errors);
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                message: <div>Não foi possível editar o processo de contratação. <br/> Erro {res.message}</div>,
            });
        }
        setCarregando(false)
    }

    const modelosLicitacao = useQuery({
        queryFn: () => throwableGetData({path: 'licitacaomodelos'}),
        queryKey: ['modelosLicitacao']
    })

    const estados = useQuery({
        queryFn: () => throwableGetData({path: 'estados'}),
        queryKey: ['estadosContratacao']
    })

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
                    defaultValue={dados?.licitacao_modelo_id ?? ""}
                    name="licitacao_modelo_id"
                    disabled={modelosLicitacao?.data?.data?.length === 0 ?? true}
                    fullWidth
                >
                    <MenuItem value={""}>---</MenuItem>
                    {modelosLicitacao?.data?.data?.map((modeloLicitacao, index) => 
                        <MenuItem key={index} value={modeloLicitacao.id}>{modeloLicitacao.nome}</MenuItem>
                    )}
                </Select>
                <FormHelperText>
                    {errors?.licitacao_modelo_id ?? " "}
                </FormHelperText>

                {modelosLicitacao.isLoading
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
                    defaultValue={dados?.estado_id ?? ""}
                    name="estado_id"
                    disabled={estados?.data?.data?.length === 0 ?? true}
                    fullWidth
                >
                    <MenuItem value="">---</MenuItem>
                    {estados?.data?.data?.map((estado, index) => 
                        <MenuItem key={index} value={estado.id}>{estado.valor}</MenuItem>
                    )}
                </Select>
                <FormHelperText>
                    {errors?.estado_id ?? " "}
                </FormHelperText>

                {estados.isLoading === true
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
                defaultValue={dados?.envio_material_tecnico ?? ""}
                name="envio_material_tecnico"
                margin="1rem 0"
                error={errors.hasOwnProperty('envio_material_tecnico')}
                helperText={errors?.envio_material_tecnico ?? " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.minuta_edital}
                defaultValue={dados?.minuta_edital ?? ""}
                name="minuta_edital"
                margin="1rem 0"
                error={errors.hasOwnProperty('minuta_edital')}
                helperText={errors?.minuta_edital ?? " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.abertura_certame}
                defaultValue={dados?.abertura_certame ?? ""}
                name="abertura_certame"
                // onChange={(e) => { handleChange(e, processoContratacao, setProcessoContratacao); }}
                margin="1rem 0"
                error={errors.hasOwnProperty('abertura_certame')}
                helperText={errors?.abertura_certame ?? " "}
                fullWidth
            />

            <CampoData
                className="form__campo"
                label={contratoLabels.homologacao}
                defaultValue={dados?.homologacao ?? ""}
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

            <CampoData
                className=""
                label={contratoLabels.data_recebimento_provisorio}
                defaultValue={dados.data_recebimento_provisorio ?? ""}
                name="data_recebimento_provisorio"
                margin="1rem 0"
                error={errors.hasOwnProperty('data_recebimento_provisorio')}
                helperText={errors?.data_recebimento_provisorio ?? " "}
                fullWidth
            />

            <CampoData
                className=""
                label={contratoLabels.data_recebimento_definitivo}
                defaultValue={dados.data_recebimento_definitivo ?? ""}
                name="data_recebimento_definitivo"
                margin="1rem 0"
                error={errors.hasOwnProperty('data_recebimento_definitivo')}
                helperText={errors?.data_recebimento_definitivo ?? " "}
                fullWidth
            />

            <MaxPrazoInput
                helperText="A contar da data de vencimento..."
                validade={validade}
                defaultValue={dados?.data_prazo_maximo ?? ""}
                label={contratoLabels.prazo_a_partir_de}
                disabled={validade === "" ?? true}
            />
        </Box>
    );
}

export default FormProcessoContratacao;