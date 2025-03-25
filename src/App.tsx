import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { BrowserRouter } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <GameProvider>
            <AppRoutes />
          </GameProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
