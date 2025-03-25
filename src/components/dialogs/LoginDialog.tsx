import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from 'firebase/auth';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const LoginDialog = ({ open, onClose, onLoginSuccess }: LoginDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      const userCredential = await login(email, password);
      if (userCredential.user) {
        onLoginSuccess(userCredential.user);
      }
    } catch (err) {
      setError('Fejl ved login. Kontroller email og adgangskode.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: '#1a1f2e',
          color: 'white',
          minWidth: 400
        }
      }}
    >
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <img src="/logo.png" alt="King of Darts" style={{ width: 120 }} />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />

          <TextField
            fullWidth
            label="Adgangskode"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#00875A',
              '&:hover': {
                bgcolor: '#007A51',
              },
              textTransform: 'none',
              py: 1.5
            }}
          >
            {loading ? 'Logger ind...' : 'Log ind'}
          </Button>
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            '&:hover': {
              color: 'white'
            }
          }}
        >
          Glemt adgangskode?
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog; 