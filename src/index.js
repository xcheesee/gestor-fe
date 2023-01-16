import React from 'react';
import ReactDOM from 'react-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#3b948c' },
      success: { main: '#4D8A79' },
      error: { main: '#873939' },
      color: { main: '#FFFFFF' }
    },
    typography: {
      button: {
        textTransform: 'none',
      }
    }
  },
  ptBR,
);

ReactDOM.render(
  <>
    <CssBaseline />
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </>,
  document.getElementById('root')
);