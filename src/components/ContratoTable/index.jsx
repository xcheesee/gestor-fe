import { Box, Fade, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SortArrow from "../SortArrow";
import { irParaTopo, mascaraContrato, mascaraProcessoSei } from "../../commom/utils/utils";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

const ContratoTable = ({dados, url, ordena, carregandoSort, isLoading}) => {
    const navigate = useNavigate()

    const StyledTableHeadCell = ({ onClick, children}) => (
        <TableCell 
            sx={{ 
                color: (theme) => theme.palette.color.main
            }} 
            align="center"
        >
                        <Box
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    borderRadius: '3px',
                    '&:hover': { 
                        background: 'rgba(20, 20, 20, 0.2)',
                        transition: '0.2s',
                        cursor: 'pointer'
                    } 
                }}
                onClick={onClick}
            >
                {children}
            </Box>
        </TableCell>
    )

    return (
        <Fade in={true} timeout={800}>
            {
                isLoading
                    ? <div></div>
                    :<TableContainer component={Paper} elevation={3} sx={{ width: '100%', margin: '1rem auto 0 auto'}}>
                    <Table size="small">
                        <TableHead sx={{ background: (theme) => theme.palette.primary.main  }}>
                            <TableRow>
                                <StyledTableHeadCell onClick={() => ordena('id')}>
                                    ID
                                    {
                                        url.sort === 'id' || url.sort === '-id'
                                        ? <SortArrow url={url} loading={carregandoSort} />
                                        : ''
                                    }
                                </StyledTableHeadCell>
                                <StyledTableHeadCell onClick={() => ordena('processo_sei')}>
                                    Processo SEI
                                    {
                                        url.sort === 'processo_sei' || url.sort === '-processo_sei'
                                        ? <SortArrow url={url} loading={carregandoSort} />
                                        : ''
                                    }
                                </StyledTableHeadCell>
                                <StyledTableHeadCell onClick={() => ordena('credor')}>
                                    Credor
                                    {
                                        url.sort === 'credor' || url.sort === '-credor'
                                        ? <SortArrow url={url} loading={carregandoSort} />
                                        : ''
                                    }
                                </StyledTableHeadCell>
                                {/* TODO: CORRIGIR BUG DE SORT POR NOME_EMPRESA */}
                                <StyledTableHeadCell onClick={() => ordena('nome_empresa')}>
                                    Empresa
                                    {
                                        url.sort === 'nome_empresa' || url.sort === '-nome_empresa'
                                        ? <SortArrow url={url} loading={carregandoSort} />
                                        : ''
                                    }
                                </StyledTableHeadCell>
                                <StyledTableHeadCell onClick={() => ordena('numero_contrato')}>
                                    Contrato
                                    {
                                        url.sort === 'numero_contrato' || url.sort === '-numero_contrato'
                                        ? <SortArrow url={url} loading={carregandoSort} />
                                        : ''
                                    }
                                </StyledTableHeadCell>
                                <StyledTableHeadCell onClick={() => ordena('data_inicio_vigencia')}>
                                    Início da vigência
                                    {
                                        url.sort === 'data_inicio_vigencia' || url.sort === '-data_inicio_vigencia'
                                        ? <SortArrow url={url} loading={carregandoSort} />
                                        : ''
                                    }
                                </StyledTableHeadCell>
                                <StyledTableHeadCell onClick={() => ordena('data_vencimento')}>
                                    Vencimento
                                    {
                                        url.sort === 'data_vencimento' || url.sort === '-data_vencimento'
                                        ? <SortArrow url={url} loading={carregandoSort} />
                                        : ''
                                    }
                                </StyledTableHeadCell>
                                <StyledTableHeadCell onClick={() => {}}>
                                    Visualizar
                                </StyledTableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { dados.length !== 0 
                                ?dados?.map((row, index) => {
                                    const background = { background: index % 2 === 0 ? '#FFFFFF' : '#f3f6f3', borderBottom: 0 };
                                    return (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" sx={background}>{row.id || "- - -"}</TableCell>
                                            <TableCell align="center" sx={background}>{mascaraProcessoSei(row.processo_sei) || "- - -"}</TableCell>
                                            <TableCell align="center" sx={background}>{row.credor || "- - -"}</TableCell>
                                            <TableCell align="center" sx={background}>{row.empresa || "- - -"}</TableCell>
                                            <TableCell align="center" sx={background}>{mascaraContrato(row.numero_contrato) || "- - -"}</TableCell>
                                            <TableCell align="center" sx={background}>{row.data_inicio_vigencia || "- - -"}</TableCell>
                                            <TableCell align="center" sx={background}>
                                                <Box>
                                                    {row.data_vencimento || "- - -"}
                                                </Box>
                                                {row.diferenca_vigencia_vencimento !== null 
                                                    ? <Typography className='text-sm text-green-500'><b>Vigencia:</b>{row.diferenca_vigencia_vencimento} Dia(s)</Typography>
                                                    : ""
                                                }
                                                
                                            </TableCell>
                                            <TableCell align="center" sx={background}>
                                                <IconButton onClick={() => {
                                                    irParaTopo()
                                                    navigate(`../contrato/${row.id}`)
                                                }}>
                                                    <ManageSearchIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                                :<TableRow>
                                    <TableCell colSpan={8} className="text-center py-4 text-3xl text-red-600">Nenhum contrato encontrado!</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            
        </Fade>
    );
}

export default ContratoTable