import React from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import CampoData from '../../CampoData';
import CampoValores from '../../CampoValores';
import CampoPorcentagem from '../../CampoPorcentagem';

const FormAditamento = (props) => {
    const {
        formAditamento,
        setFormAditamento,
        openFormAditamento,
        setOpenFormAditamento,
        enviaAditamento,
        carregando,
        setOpenConfirmacao,
    } = props;

    const handleInputChange = (e) => {
        setFormAditamento({
            ...formAditamento,
            [e.target.name]: e.target.value
        })
    }

    const handleClickConfirmar = () => {
        if (openFormAditamento.acao === 'adicionar') {
            enviaAditamento();
        } else if (openFormAditamento.acao === 'editar') {
            setOpenConfirmacao({
                open: true,
                id: formAditamento.id
            });
        }
    }

    return (
        <Dialog open={openFormAditamento.open} fullWidth>
            <DialogTitle>
                {openFormAditamento.acao === 'adicionar'
                    ? "Novo aditamento"
                    : "Editar aditamento"
                }
            </DialogTitle>

            <DialogContent>
                <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                    <InputLabel id="tipo_aditamentos-label">Tipo</InputLabel>
                    <Select
                        labelId="tipo_aditamentos-label"
                        id="tipo_aditamentos"
                        label="Tipo"
                        value={formAditamento.tipo_aditamentos}
                        name="tipo_aditamentos"
                        onChange={handleInputChange}
                        fullWidth
                    >
                        <MenuItem value="Acréscimo de valor">Acréscimo de valor</MenuItem>
                        <MenuItem value="Redução de valor">Redução de valor</MenuItem>
                        <MenuItem value="Prorrogação de prazo">Prorrogação de prazo</MenuItem>
                        <MenuItem value="Supressão de prazo">Supressão de prazo</MenuItem>
                        <MenuItem value="Suspensão">Suspensão</MenuItem>
                        <MenuItem value="Rescisão">Rescisão</MenuItem>
                    </Select>
                </FormControl>

                <CampoValores
                    index=""
                    label="Valor"
                    value={formAditamento.valor_aditamento}
                    state={formAditamento}
                    setState={setFormAditamento}
                    name="valor_aditamento"
                    onChange={(e) => { handleInputChange(e); }}
                    checaErros={() => {}}
                    helperText=""
                    required
                    fullWidth
                />

                <CampoData
                    label="Fim da vigência atualizada"
                    value={formAditamento.data_fim_vigencia_atualizada}
                    name="data_fim_vigencia_atualizada"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    fullWidth
                    required
                />

                <CampoPorcentagem 
                    label="Taxa de reajuste"
                    value={formAditamento.indice_reajuste}
                    name="indice_reajuste"
                    state={formAditamento}
                    setState={setFormAditamento}
                    helperText=""
                    required
                    fullWidth
                />

                <CampoData
                    label="Data base de reajuste"
                    value={formAditamento.data_base_reajuste}
                    name="data_base_reajuste"
                    onChange={handleInputChange}
                    margin="1rem 0"
                    fullWidth
                    required
                />

                <CampoValores
                    index=""
                    label="Valor reajustado"
                    value={formAditamento.valor_reajustado}
                    state={formAditamento}
                    setState={setFormAditamento}
                    name="valor_reajustado"
                    onChange={(e) => { handleInputChange(e); }}
                    checaErros={() => {}}
                    helperText=""
                    required
                    fullWidth
                />
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button
                    onClick={() => { setOpenFormAditamento({ ...openFormAditamento, open: false }); }}
                    sx={{ textTransform: 'none', mr: '1rem', color: '#821f1f' }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} /> Cancelar
                </Button>

                <Button
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={handleClickConfirmar}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: '#FFFFFF', mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} /> 
                    }

                    {openFormAditamento.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormAditamento;