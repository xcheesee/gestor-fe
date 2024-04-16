import { FormGroup, Menu, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Paper, IconButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getContratosVencidos } from "../../commom/utils/api";
import { mascaraContrato, mascaraProcessoSei } from "../../commom/utils/utils";
import { Link } from "react-router-dom";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

const ContratosAVencerPopover = ({
    anchorEl,
    setAnchorEl,
    open,
    setQtdVencido
}) => {

    const stopPropagationParaTab = (evento) => {
        if (evento.key === "Tab") {
            evento.stopPropagation();
        }
    }

    const handleClose = () => {
        document.getElementById("btnHeader").removeAttribute('style', 'background')
        setAnchorEl(null);
    }

    const contratoVencido = useQuery({
        queryKey: ['contratosVencidos'],
        queryFn: async () => await getContratosVencidos(),
        onSuccess: (res) => setQtdVencido(res.length)
    })

    if(contratoVencido.isLoading) return <></>

    const rows = contratoVencido.data?.map((contrato, index) => ({
            id: contrato.id, 
            numero_contrato: mascaraContrato(contrato.numero_contrato),
            processo_sei: mascaraProcessoSei(contrato.processo_sei),
            meses_ate_vencimento: contrato.meses_ate_vencimento
        })
    );

    const qtdVencido = contratoVencido.data.length ?? 0

    return (
        <div className="notificacao">
            <Menu
                id="menu-filtros"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                sx={{ position: 'fixed', '& .MuiMenu-paper': { top: '50px !important' } }}
                disableScrollLock={true}
            >
                <FormGroup tabIndex={-1} onKeyDown={stopPropagationParaTab} sx={{ marginBottom: "-8px"}}>
                    <Typography 
                        variant="h2" 
                        className="header__titulo" 
                        sx={{ 
                            fontSize: '1.2rem', 
                            margin: '0 auto', 
                            padding: '0',
                            marginTop: '5px',
                            cursor: 'defaut'
                        }}
                    >
                        Contratos a vencer
                    </Typography>

                    { qtdVencido > 0 ?
                        <TableContainer component={Paper} elevation={3} sx={{ width: '100%', margin: '1rem auto 0 auto'}}>
                            <Table size="small">
                                <TableBody>
                                    {rows.map((row, index) => {
                                        const background = { background: index % 2 === 0 ? '#FFFFFF' : '#f3f6f3', borderBottom: 0 };
                                        return (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center" sx={background}>{row.numero_contrato}</TableCell>
                                                <TableCell align="center" sx={background}>{row.processo_sei}</TableCell>
                                                <TableCell align="center" sx={background}>{row.meses_ate_vencimento}</TableCell>
                                                <TableCell align="center" sx={background}>
                                                    <Link to={`../contrato/${row.id}`} onClick={handleClose}>
                                                        <IconButton>
                                                            <ManageSearchIcon />
                                                        </IconButton>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                     :
                        <Typography 
                            variant="h2" 
                            className="header__titulo" 
                            sx={{ 
                                fontSize: '1.1rem', 
                                margin: '0 auto', 
                                padding: '0',
                                marginTop: '5px',
                                cursor: 'defaut'
                            }}
                        >
                            Nenhum contrato está perto de vencer
                        </Typography>
                    }
                                
                </FormGroup>       
            </Menu>
        </div>
    );
}

export default ContratosAVencerPopover 