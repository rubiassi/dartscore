import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

// Import pages
import Local from './pages/Local';
import X01Setup from './pages/X01Setup';
import X01Game from './pages/X01Game';

// Theme configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/local" replace />} />
          <Route path="/local" element={<Local />} />
          <Route path="/x01setup" element={<X01Setup />} />
          <Route path="/x01game" element={<X01Game />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
