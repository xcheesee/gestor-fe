import React, { useEffect, useState } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress
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
        setOpenConfirmacao,
        acao
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
        const urlSubpref = `http://${process.env.REACT_APP_API_URL}/api/subprefeituras/${formLocal.regiao}`;
        const urlDistrito = `http://${process.env.REACT_APP_API_URL}/api/distritos/${formLocal.subprefeitura_id}`;
        const token = sessionStorage.getItem('access_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        setRegiao('');
            setSubprefeitura({ 
                disabled: true,
                carregando: false, 
                value: '' 
            });
            setDistrito({ 
                disabled: true,
                carregando: false, 
                value: '' 
            });

        if (acao === "editar") {
            setRegiao(formLocal.regiao);
            fetch(urlSubpref, options)
                .then(res => res.json())
                .then(data => {
                    setListaSubpref(data.data);
                    setSubprefeitura({
                        disabled: false,
                        carregando: false,
                        value: formLocal.subprefeitura_id
                    });
                });
            fetch(urlDistrito, options)
                .then(res => res.json())
                .then(data => {
                    setListaDistrito(data.data);
                    setDistrito({
                        disabled: false,
                        carregando: false,
                        value: formLocal.distrito_id
                    })
                });
        }
    }, [openFormLocal.open])
    
    const handleChangeRegiao = (valor) => {
        setSubprefeitura({ disabled: true, carregando: true, value: '' });
        setDistrito({ disabled: true, carregando: true, value: '' });
        setRegiao(valor);

        const url = `http://${process.env.REACT_APP_API_URL}/api/subprefeituras/${valor}`;
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

        return listaSubpref;
    }

    const handleChangeSubprefeitura = (valor) => {
        setDistrito({ disabled: true, carregando: true, value: '' });
        setSubprefeitura({
            disabled: false,
            carregando: false,
            value: valor
        });

        const url = `http://${process.env.REACT_APP_API_URL}/api/distritos/${valor}`;
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

    const handleChangeDistrito = (valor) => {
        setDistrito({
            disabled: false,
            carregando: false,
            value: valor
        });
    }

    const handleInputChange = (e) => {
        setFormLocal({
            ...formLocal,
            [e.target.name]: e.target.value
        })
    }

    const cancelar = () => {
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
        } else if (openFormLocal.acao === 'editar') {
            setFormLocal({
                ...formLocal,
                subprefeitura_id: subprefeitura.value,
                distrito_id: distrito.value
            });
            setOpenConfirmacao({
                open: true,
                id: formLocal.id
            });
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
                        onChange={(e) => { handleChangeRegiao(e.target.value); }}
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
                        onChange={(e) => { handleChangeSubprefeitura(e.target.value); }}
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
                        onChange={(e) => { handleChangeDistrito(e.target.value); }}
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

                <TextField
                    variant="outlined"
                    value={formLocal.unidade}
                    name="unidade"
                    onChange={handleInputChange}
                    label="Unidade"
                    sx={{ margin: '1rem 0' }}
                    fullWidth
                    required
                />
                    
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