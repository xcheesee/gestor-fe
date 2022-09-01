import React, { useState, forwardRef } from 'react';
import { 
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Collapse,
    Badge,
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';
import CampoData from '../CampoData';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import CampoDataRange from '../../helpers/CampoDataRange';

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            isNumericString
        />
    );
});

NumberFormatCustom.propTypes = {
    onChange: PropTypes.func.isRequired,
};

const Filtros = (props) => {
    const { url, setUrl, page } = props;

    const [filtros, setFiltros] = useState({
        processo_sei: '',
        nome_empresa: '',
        inicio_depois_de: '',
        inicio_antes_de: '',
        vencimento_depois_de: '',
        vencimento_antes_de: ''
    });
    const [visibilidade, setVisibilidade] = useState(false);
    const [filtrosAtivos, setFiltrosAtivos] = useState(0);

    const handleChange = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value
        })
    }

    const handleCalendarioChange = (keyAntes, keyDepois, valArray) => {
        setFiltros({
            ...filtros,
            [keyAntes]: valArray[0],
            [keyDepois]: valArray[1]
        })
    }

    const limpaFiltros = () => {
        setFiltros({
            processo_sei: '',
            nome_empresa: '',
            inicio_depois_de: '',
            inicio_antes_de: '',
            vencimento_depois_de: '',
            vencimento_antes_de: ''
        });
        setFiltrosAtivos(0);
        setUrl({
            ...url,
            page: 1,
            filtros: ''
        });
        setVisibilidade(false);
    }

    const salvaFiltros = () => {
        let arrFiltros = [''];

        Object.entries(filtros).forEach((filtro, index) => {
            if (filtro[1] !== '') {
                arrFiltros.push(`filter[${filtro[0]}]=${filtro[1]}`);
            }
        });

        setFiltrosAtivos(arrFiltros.length - 1);
        setUrl({
            ...url,
            page: 1,
            filtros: arrFiltros.join('&')
        });
        setVisibilidade(false);
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <IconButton 
                    onClick={() => setVisibilidade(!visibilidade)} 
                    sx={{ 
                        borderRadius: 1, 
                        boxSizing: 'border-box', 
                        margin: '1rem',
                        textTransform: 'none',
                        padding: '0.5rem'
                    }}
                >
                    <Badge 
                        badgeContent={filtrosAtivos} 
                        color="primary"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Typography 
                            variant="h3" 
                            component="h3" 
                            sx={{ 
                                fontSize: '1.25rem', 
                                mr: '0.5rem',
                                ml: '0.5rem', 
                                display: 'flex', 
                                alignItems: 'center',
                            }}
                        >
                            Filtros
                        </Typography>
                        {
                            visibilidade
                            ? <ExpandLessIcon sx={{ mr: '0.5rem' }} />
                            : <ExpandMoreIcon sx={{ mr: '0.5rem' }} />
                        }
                    </Badge>
                </IconButton>
            </Box>
            <Collapse in={visibilidade}>
                <Box 
                    sx={{ 
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        columnGap: '1rem',
                        rowGap: '1rem',
                        margin: '2rem auto',
                        mt: 0,
                        padding: '2rem',
                        border: '1px solid #cdcdcd', 
                        borderRadius: '3px',
                        width: '80%'
                    }}
                >
                        <TextField
                            variant="outlined"
                            label="Processo SEI"
                            value={filtros.processo_sei}
                            onChange={handleChange}
                            sx={{ mb: '0' }}
                            InputProps={{
                                inputComponent: NumberFormatCustom
                            }}
                            helperText=" "
                            name="processo_sei"
                            size="small"
                        />

                        <TextField 
                            label="Empresa"
                            value={filtros.nome_empresa}
                            name="nome_empresa"
                            onChange={handleChange}
                            size="small"
                            fullWidth
                        />
                    
                        {/* <CampoData 
                            label="Início depois de"
                            name="inicio_depois_de"
                            helperText=" "
                            size="small"
                            value={filtros.inicio_depois_de}
                            onChange={handleChange}
                        />

                        <CampoData 
                            label="Início antes de"
                            name="inicio_antes_de"
                            helperText=" "
                            size="small"
                            value={filtros.inicio_antes_de}
                            onChange={handleChange}
                        /> */}

                        {/* <CampoData 
                            label="Vencimento depois de"
                            name="vencimento_depois_de"
                            helperText=" "
                            size="small"
                            value={filtros.vencimento_depois_de}
                            onChange={handleChange}
                        />

                        <CampoData 
                            label="Vencimento antes de"
                            name="vencimento_antes_de"
                            helperText=" "
                            size="small"
                            value={filtros.vencimento_antes_de}
                            onChange={handleChange}
                        /> */}
                        <CampoDataRange
                            label={'Inicio - faixa de pesquisa'}
                            intervalo={[filtros.inicio_depois_de, filtros.inicio_antes_de]}
                            onChange={handleCalendarioChange}
                            placeholder={'dd/mm/aaaa - dd/mm/aaaa'}
                            separador={' / '}
                            size={'lg'}
                            rangeStart={'inicio_depois_de'}
                            rangeEnd={'inicio_antes_de'}
                        />

                        <CampoDataRange
                            label={'Vencimento - faixa de pesquisa'}
                            intervalo={[filtros.vencimento_depois_de, filtros.vencimento_antes_de]}
                            onChange={handleCalendarioChange}
                            placeholder={'dd/mm/aaaa - dd/mm/aaaa'}
                            separador={' / '}
                            size={'lg'}
                            rangeStart={'vencimento_depois_de'}
                            rangeEnd={'vencimento_antes_de'}
                        />
                        
                        <Box sx={{ gridColumnStart: 2, justifySelf: 'end' }}>
                            <Button sx={{ textTransform: 'none', mr: '1rem' }} onClick={limpaFiltros}>
                                Limpar
                            </Button>
                            <Button
                                sx={{ color: (theme) => theme.palette.color.main, textTransform: 'none' }}
                                variant="contained"
                                onClick={salvaFiltros}
                            >
                                Salvar
                            </Button>
                        </Box>
                    </Box>

            </Collapse>
        </>

    );
}

export default Filtros;