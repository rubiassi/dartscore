import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
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

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
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
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
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
          fullWidth
          variant="contained"
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
          Login
        </Button>

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
          Forgot Password
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog; 