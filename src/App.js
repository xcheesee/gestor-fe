import './App.css';
import 'handsontable/dist/handsontable.full.min.css';
import Header from './components/Header';
import Login from './pages/Login';
import Principal from './pages/Principal';
import DadosContrato from './components/DadosContrato';
import PaginaNaoEncontrada from './components/PaginaNaoEncontrada';
import Auth from './components/Auth';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import MenuInicial from './pages/MenuInicial';
import { Alert, Snackbar } from '@mui/material';
import { useAtom } from 'jotai';
import { snackbarAtom } from './atomStore';

function App() {
  const [snackbar, setSnackbar] = useAtom(snackbarAtom);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <Login />
        } />

        <Route path="/contrato" element={
          <Auth>
            <Principal />
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
            <DadosContrato /> 
          </Auth>
        } />

        <Route path="*" element={ 
          <Auth>
            <PaginaNaoEncontrada /> 
          </Auth>
        } />
      </Routes>

      <Snackbar open={snackbar.open} autoHideDuration={snackbar.autoHideDuration} onClose={() => setSnackbar( prev => ({...prev, open: false}) ) }>
        <Alert 
            variant="filled"
            onClose={() => setSnackbar( prev => ({...prev, open: false}) ) }
            severity={snackbar.severity}
            elevation={6} 
            sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
}

export default App;