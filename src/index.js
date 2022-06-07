import React from 'react';
import ReactDOM from 'react-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#2B5F50' },
      success: { main: '#4D8A79' },
      error: { main: '#873939' }
    },
  },
  ptBR,
);

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById('root')
);