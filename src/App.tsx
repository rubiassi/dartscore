import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

// Import pages
import InfoPage from './pages/InfoPage';
import Dashboard from './pages/Dashboard';
import Local from './pages/Local';
import X01Setup from './pages/X01Setup';
import X01Game from './pages/X01Game';
import NavigationLayout from './components/layout/NavigationLayout';

// Theme configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Wrapper component for X01Game to handle state
const X01GameWrapper = () => {
  const location = useLocation();
  const gameConfig = location.state;

  if (!gameConfig) {
    return <Navigate to="/x01setup" replace />;
  }

  return (
    <NavigationLayout>
      <X01Game gameConfig={gameConfig} players={gameConfig.players} />
    </NavigationLayout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<InfoPage />} />
          
          {/* Protected routes with navigation */}
          <Route path="/dashboard" element={<NavigationLayout><Dashboard /></NavigationLayout>} />
          <Route path="/local" element={<NavigationLayout><Local /></NavigationLayout>} />
          <Route path="/x01setup" element={<NavigationLayout><X01Setup /></NavigationLayout>} />
          <Route path="/x01game" element={<X01GameWrapper />} />
          
          {/* Placeholder routes */}
          <Route path="/profile" element={<NavigationLayout><div>Profile Coming Soon</div></NavigationLayout>} />
          <Route path="/friends" element={<NavigationLayout><div>Friends Coming Soon</div></NavigationLayout>} />
          <Route path="/teams" element={<NavigationLayout><div>Teams Coming Soon</div></NavigationLayout>} />
          <Route path="/statistics" element={<NavigationLayout><div>Statistics Coming Soon</div></NavigationLayout>} />
          <Route path="/history" element={<NavigationLayout><div>History Coming Soon</div></NavigationLayout>} />
          <Route path="/achievements" element={<NavigationLayout><div>Achievements Coming Soon</div></NavigationLayout>} />
          <Route path="/settings" element={<NavigationLayout><div>Settings Coming Soon</div></NavigationLayout>} />
          <Route path="/about" element={<NavigationLayout><div>About Coming Soon</div></NavigationLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
