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

interface SignupFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

const SignupForm = ({ onSuccess, onLoginClick }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Adgangskoderne matcher ikke');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      onSuccess?.();
    } catch (err) {
      setError('Kunne ikke oprette konto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      onSuccess?.();
    } catch (err) {
      setError('Kunne ikke logge ind med Google');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component={Paper} maxWidth="xs" sx={{ p: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Opret Konto
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Adgangskode"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Bekræft adgangskode"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          Opret Konto
        </Button>

        <Divider sx={{ my: 2 }}>eller</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          Fortsæt med Google
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Har du allerede en konto?{' '}
            <Button
              onClick={onLoginClick}
              sx={{ textTransform: 'none' }}
              disabled={loading}
            >
              Log ind her
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupForm; 