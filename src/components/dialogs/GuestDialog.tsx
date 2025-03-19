import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Switch,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface GuestDialogProps {
  open: boolean;
  onClose: () => void;
  onAddGuest: (name: string, save: boolean) => void;
}

const GuestDialog = ({ open, onClose, onAddGuest }: GuestDialogProps) => {
  const [guestName, setGuestName] = useState('');
  const [saveGuest, setSaveGuest] = useState(false);
  const [error, setError] = useState('');
  const [favoriteGuests, setFavoriteGuests] = useState<string[]>([]);

  // Simulerer at hente gemte gæster fra localStorage
  useEffect(() => {
    const savedGuests = localStorage.getItem('favoriteGuests');
    if (savedGuests) {
      setFavoriteGuests(JSON.parse(savedGuests));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName.trim()) {
      setError('Gæstens navn er påkrævet');
      return;
    }

    if (saveGuest) {
      const newFavorites = [...favoriteGuests, guestName];
      setFavoriteGuests(newFavorites);
      localStorage.setItem('favoriteGuests', JSON.stringify(newFavorites));
    }

    onAddGuest(guestName, saveGuest);
    setGuestName('');
    setSaveGuest(false);
    setError('');
  };

  const handleSelectFavorite = (name: string) => {
    setGuestName(name);
  };

  const handleRemoveFavorite = (nameToRemove: string) => {
    const newFavorites = favoriteGuests.filter(name => name !== nameToRemove);
    setFavoriteGuests(newFavorites);
    localStorage.setItem('favoriteGuests', JSON.stringify(newFavorites));
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
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Add guest player
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Guest name"
            variant="outlined"
            margin="normal"
            value={guestName}
            onChange={(e) => {
              setGuestName(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error}
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
              '& .MuiFormHelperText-root': {
                color: '#f44336',
              },
            }}
          />

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mt: 2, 
            mb: 3 
          }}>
            <Typography>Save guest name</Typography>
            <Switch 
              checked={saveGuest}
              onChange={(e) => setSaveGuest(e.target.checked)}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Favored guests:
          </Typography>

          <Box sx={{ 
            bgcolor: 'rgba(0, 0, 0, 0.2)', 
            borderRadius: 1,
            mb: 3,
            maxHeight: 200,
            overflow: 'auto'
          }}>
            {favoriteGuests.length > 0 ? (
              <List disablePadding>
                {favoriteGuests.map((name, index) => (
                  <ListItem
                    key={index}
                    onClick={() => handleSelectFavorite(name)}
                    sx={{
                      borderBottom: index < favoriteGuests.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemText primary={name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(name);
                        }}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2 }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Currently no favorite guests
                </Typography>
              </Box>
            )}
          </Box>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            startIcon={<PersonAddIcon />}
            sx={{
              bgcolor: '#00875A',
              '&:hover': {
                bgcolor: '#007A51',
              },
              textTransform: 'none',
              py: 1.5
            }}
          >
            Add Guest
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDialog; 