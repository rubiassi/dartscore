import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Container,
  Divider
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Fejl ved login. Kontroller email og adgangskode.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Fejl ved Google login.');
      console.error('Google login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          backgroundColor: 'background.paper',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Log ind
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          disabled={loading}
          sx={{ mb: 3 }}
        >
          Fortsæt med Google
        </Button>

        <Divider sx={{ mb: 3 }}>eller</Divider>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Adgangskode"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Logger ind...' : 'Log ind'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Har du ikke en konto endnu?{' '}
              <Button 
                color="primary" 
                onClick={onRegisterClick}
                sx={{ textTransform: 'none' }}
              >
                Opret konto
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm; 