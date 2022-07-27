import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import Principal from './components/Principal';
import DadosContrato from './components/DadosContrato';
import EditarContrato from './components/EditarContrato';
import NovoContrato from './components/NovoContrato';
import PaginaNaoEncontrada from './components/PaginaNaoEncontrada';
import Auth from './components/Auth';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    text: 'Contrato enviado com sucesso!',
    color: 'success'
  });

  const mascaraProcessoSei = (processoSei) => {
    if (processoSei !== null && processoSei !== "" && processoSei !== undefined) {
      return processoSei.replace(/([\d]{4})([\d]{4})([\d]{7})([\d]{1})/gm, '$1.$2/$3-$4');
    } else {
      return "";
    }
  }

  const mascaraContrato = (contrato) => {
    if (contrato !== null && contrato !== "" && contrato !== undefined) {
      return contrato.replace(/([\d]{3})([\w]{4})(\d{4})/gm, '$1/$2/$3');
    } else {
      return "";
    }
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <Login />
        } />

        <Route path="/principal" element={
          <Auth>
            <Principal 
              snackbar={snackbar} 
              setSnackbar={setSnackbar} 
              mascaraProcessoSei={mascaraProcessoSei} 
              mascaraContrato={mascaraContrato} 
            />
          </Auth>
        } />

        <Route path="/contrato/:numContrato" element={ 
          <Auth> 
            <DadosContrato 
              snackbar={snackbar} 
              setSnackbar={setSnackbar} 
              mascaraProcessoSei={mascaraProcessoSei} 
              mascaraContrato={mascaraContrato} 
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
      <Footer />
    </>
  );
}

export default App;