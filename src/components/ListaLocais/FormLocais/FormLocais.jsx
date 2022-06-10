import React, { useEffect, useState } from 'react';
import { 
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    LinearProgress,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const FormLocais = (props) => {
    const {
        formLocal,
        setFormLocal,
        openFormLocal,
        setOpenFormLocal,
        enviaLocal,
        carregando,
        setOpenConfirmacao
    } = props;

    const [regiao, setRegiao] = useState(formLocal.regiao);
    const [listaSubpref, setListaSubpref] = useState([]);
    const [listaDistrito, setListaDistrito] = useState([]);
    const [subprefeitura, setSubprefeitura] = useState({
        disabled: true,
        carregando: false,
        value: formLocal.subprefeitura_id
    });
    const [distrito, setDistrito] = useState({
        disabled: true,
        carregando: false,
        value: formLocal.distrito_id
    });

    useEffect(() => {
        setRegiao(formLocal.regiao);
        setSubprefeitura({ ...subprefeitura, value: formLocal.subprefeitura_id });
        setDistrito({ ...distrito, value: formLocal.distrito_id });
    }, [openFormLocal.open])
    
    const handleChangeRegiao = (e) => {
        setSubprefeitura({ disabled: true, carregando: true, value: '' });
        setDistrito({ disabled: true, carregando: true, value: '' });
        setRegiao(e.target.value);

        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api/subprefeituras/${e.target.value}`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                setListaSubpref(data.data);
                setSubprefeitura({
                    disabled: false,
                    carregando: false,
                    value: ''
                });
                setDistrito({ 
                    disabled: true, 
                    carregando: false, 
                    value: '' 
                });
            });
    }

    const handleChangeSubprefeitura = (e) => {
        setDistrito({ disabled: true, carregando: true, value: '' });
        setSubprefeitura({
            disabled: false,
            carregando: false,
            value: e.target.value
        });

        const url = `http://${process.env.REACT_APP_API_URL}/contratos/api/distritos/${e.target.value}`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                setListaDistrito(data.data);
                setDistrito({
                    disabled: false,
                    carregando: false,
                    value: ''
                });
            });
    }

    const handleChangeDistrito = (e) => {
        setDistrito({
            disabled: false,
            carregando: false,
            value: e.target.value
        });
    }

    const cancelar = () => {
        setRegiao("");
        setSubprefeitura({...subprefeitura, value: ''});
        setDistrito({...distrito, value: ''});
        setOpenFormLocal({ ...openFormLocal, open: false });
    }

    const confirmar = () => {
        if (openFormLocal.acao === 'adicionar') {
            const form = {
                ...formLocal,
                subprefeitura_id: subprefeitura.value,
                distrito_id: distrito.value
            };
            enviaLocal(form);
        }
    }

    return (
        <Dialog open={openFormLocal.open} fullWidth>
            <DialogTitle>
                {openFormLocal.acao === 'adicionar'
                    ? "Novo local de serviço"
                    : "Editar local de serviço"
                }
            </DialogTitle>

            <DialogContent>
                <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                    <InputLabel id="regiao-label">Região</InputLabel>
                    <Select
                        labelId="regiao-label"
                        id="regiao"
                        label="Região"
                        value={regiao}
                        name="regiao"
                        onChange={handleChangeRegiao}
                        fullWidth
                    >
                        <MenuItem value={"CO"}>Centro-Oeste</MenuItem>
                        <MenuItem value={"L"}>Leste</MenuItem>
                        <MenuItem value={"N"}>Norte</MenuItem>
                        <MenuItem value={"S"}>Sul</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ margin: '1rem 0', position: 'relative' }}>
                    <InputLabel id="subprefeitura-label">Subprefeitura</InputLabel>
                    <Select
                        labelId="subprefeitura-label"
                        id="subprefeitura"
                        label="Subprefeitura"
                        value={subprefeitura.value}
                        name="subprefeitura"
                        onChange={handleChangeSubprefeitura}
                        disabled={subprefeitura.disabled}
                        fullWidth
                    >
                        {listaSubpref.map((subpref, index) => {
                            return (
                                <MenuItem key={index} value={subpref.id}>{subpref.nome}</MenuItem>
                            );
                        })}
                    </Select>

                    {subprefeitura.carregando === true
                        ? 
                        <CircularProgress 
                            size={20} 
                            sx={{ 
                                margin: '1rem',
                                position: 'absolute',
                                left: '87%',
                                top: '7%'
                            }} 
                        />
                        : ""
                    }
                </FormControl>

                <FormControl fullWidth sx={{ margin: '1rem 0', position: 'relative' }}>
                    <InputLabel id="distrito-label">Distrito</InputLabel>
                    <Select
                        labelId="distrito-label"
                        id="distrito"
                        label="Distrito"
                        value={distrito.value}
                        name="distrito"
                        onChange={handleChangeDistrito}
                        disabled={distrito.disabled}
                        fullWidth
                    >
                        {listaDistrito.map((distrito, index) => {
                            return (
                                <MenuItem key={index} value={distrito.id}>{distrito.nome}</MenuItem>
                            );
                        })}
                    </Select>

                    {distrito.carregando === true
                        ? 
                        <CircularProgress 
                            size={20} 
                            sx={{ 
                                margin: '1rem',
                                position: 'absolute',
                                left: '87%',
                                top: '7%'
                            }} 
                        />
                        : ""
                    }
                </FormControl>
                    
            </DialogContent>

            <DialogActions sx={{ margin: '1rem' }}>
                <Button
                    onClick={cancelar}
                    sx={{ textTransform: 'none', mr: '1rem', color: (theme) => theme.palette.error.main }}
                >
                    <CloseIcon sx={{ mr: '0.2rem' }} /> Cancelar
                </Button>

                <Button
                    sx={{ textTransform: 'none' }} 
                    variant="contained"
                    onClick={confirmar}
                >
                    {carregando
                        ? <CircularProgress size={16} sx={{ color: (theme) => theme.palette.color.main, mr: '0.7rem' }} />
                        : <CheckIcon sx={{ mr: '0.2rem' }} /> 
                    }

                    {openFormLocal.acao === 'adicionar'
                        ? "Enviar"
                        : "Editar"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormLocais;