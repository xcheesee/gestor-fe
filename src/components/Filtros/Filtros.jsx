import React, { useState, forwardRef } from 'react';
import { 
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Collapse,
    Badge,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';
import CampoDataRange from '../CampoDataRange';
import ReactInputMask from 'react-input-mask';

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
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
    const { url, setUrl, /*page*/ } = props;

    const [filtros, setFiltros] = useState({
        processo_sei: '',
        nome_empresa: '',
        inicio_depois_de: '',
        inicio_antes_de: '',
        vencimento_depois_de: '',
        vencimento_antes_de: '',
        cnpj_empresa: '',
        departamento: '',
        licitacao: ''
    });
    const [visibilidade, setVisibilidade] = useState(false);
    const [filtrosAtivos, setFiltrosAtivos] = useState(0);

    const handleChange = (e) => {
        setFiltros((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
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
            vencimento_antes_de: '',
            cnpj_empresa: '',
            departamento: '',
            licitacao: ''
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
                const normalized = (filtro[0] === "cnpj_empresa" || filtro[0] === 'processo_sei')  ? filtro[1].replace(/[\D]/g, "") : filtro[1]
                arrFiltros.push(`filter[${filtro[0]}]=${normalized}`);
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
                    <ReactInputMask
                        mask="9999.9999/9999999-9"
                        maskChar=""
                        value={filtros.processo_sei}
                        name="processo_sei"
                        onChange={handleChange}
                    >
                    {() => (<TextField
                            variant="outlined"
                            label="Processo SEI"
                            name="processo_sei"
                            size='small'
                            fullWidth
                        />)
                    }
                    </ReactInputMask>

                    <TextField 
                        label="Empresa"
                        value={filtros.nome_empresa}
                        name="nome_empresa"
                        onChange={handleChange}
                        size="small"
                        fullWidth
                    />

                    <ReactInputMask
                        mask="99.999.999/9999-99"
                        maskChar=""
                        value={filtros.cnpj_empresa}
                        name="cnpj_empresa"
                        onChange={handleChange}
                    >
                    {() => (
                        <TextField 
                            label="CNPJ"
                            className='col-span-2'
                            name='cnpj_empresa'
                            size="small"
                            fullWidth
                        />)
                    }
                    </ReactInputMask>

                    <TextField 
                        label="Unidade Requisitante"
                        value={filtros.departamento}
                        name="departamento"
                        onChange={handleChange}
                        size="small"
                        fullWidth
                    />

                    <TextField 
                        label="Tipo de Licitação"
                        value={filtros.licitacao}
                        name="licitacao"
                        onChange={handleChange}
                        size="small"
                        fullWidth
                    />


                    <CampoDataRange
                        label={'Inicio - faixa de pesquisa'}
                        intervalo={{inicio: 'inicio_depois_de', fim: 'inicio_antes_de'}}
                        filtro={filtros}
                        onChange={handleCalendarioChange}
                        placeholder={'dd/mm/aaaa - dd/mm/aaaa'}
                        separador={' / '}
                        size={'lg'}
                    />

                    <CampoDataRange
                        label={'Vencimento - faixa de pesquisa'}
                        intervalo={{inicio: 'vencimento_depois_de', fim: 'vencimento_antes_de'}}
                        filtro={filtros}
                        onChange={handleCalendarioChange}
                        placeholder={'dd/mm/aaaa - dd/mm/aaaa'}
                        separador={' / '}
                        size={'lg'}
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