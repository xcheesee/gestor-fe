import { useState } from 'react';
import './App.css';
import 'handsontable/dist/handsontable.full.min.css';
import Header from './components/Header';
import Login from './pages/Login';
import Principal from './pages/Principal';
import DadosContrato from './components/DadosContrato';
import EditarContrato from './components/EditarContrato';
import NovoContrato from './pages/NovoContrato';
import PaginaNaoEncontrada from './components/PaginaNaoEncontrada';
import Auth from './components/Auth';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import MenuInicial from './pages/MenuInicial';
import { Alert, Snackbar } from '@mui/material';

function App() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    text: 'Contrato enviado com sucesso!',
    color: 'success'
  });

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <Login />
        } />

        <Route path="/contrato" element={
          <Auth>
            <Principal 
              snackbar={snackbar} 
              setSnackbar={setSnackbar} 
            />
          </Auth>
        } />

        <Route path="/principal" element={
          <Auth>
            <MenuInicial 
              title='Menu Inicial' />
          </Auth>
        } />

        <Route path="/contrato/:numContrato" element={ 
          <Auth> 
            <DadosContrato 
              snackbar={snackbar} 
              setSnackbar={setSnackbar} 
            /> 
          </Auth>
        } />

        <Route path="/contrato/:numContrato/editar" element={
          <Auth>
            <EditarContrato snackbar={snackbar} setSnackbar={setSnackbar} />
          </Auth>
        } />

        <Route path="/novo-contrato" element={ 
          <Auth> 
            <NovoContrato setSnackbar={setSnackbar}  /> 
          </Auth>
        } />

        <Route path="*" element={ 
          <Auth>
            <PaginaNaoEncontrada /> 
          </Auth>
        } />
      </Routes>
      
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => { setSnackbar({...snackbar, open: false}); }}>
        <Alert 
            variant="filled"
            onClose={() => { setSnackbar({...snackbar, open: false}); }}
            severity={snackbar.severity}
            elevation={6} 
            sx={{ width: '100%' }}
            color={snackbar.color}
        >
          {snackbar.text}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
}

export default App;