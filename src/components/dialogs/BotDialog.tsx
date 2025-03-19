import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface BotLevel {
  value: string;
  label: string;
  description: string;
  average: string;
}

const botLevels: BotLevel[] = [
  {
    value: 'very-easy',
    label: 'Very easy',
    description: 'Perfect for beginners. Bot will make many mistakes.',
    average: 'Average: < 30'
  },
  {
    value: 'easy',
    label: 'Easy',
    description: 'For casual players. Bot will play consistently but not too well.',
    average: 'Average: 30-40'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'For regular players. Bot will provide a good challenge.',
    average: 'Average: 40-50'
  },
  {
    value: 'medium-hard',
    label: 'Medium Hard',
    description: 'For experienced players. Bot will play at a competitive level.',
    average: 'Average: 50-60'
  },
  {
    value: 'hard',
    label: 'Hard',
    description: 'For advanced players. Bot will play at a high level.',
    average: 'Average: 60-80'
  },
  {
    value: 'pro',
    label: 'Pro',
    description: 'For professional level players. Bot will rarely make mistakes.',
    average: 'Average: 80-100'
  },
  {
    value: 'king',
    label: 'King',
    description: 'The ultimate challenge. Bot will play nearly perfect darts.',
    average: 'Average: 95+'
  }
];

interface BotDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectDifficulty: (difficulty: string) => void;
}

const BotDialog = ({ open, onClose, onSelectDifficulty }: BotDialogProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('very-easy');

  const handleConfirm = () => {
    onSelectDifficulty(selectedDifficulty);
    onClose();
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
      <DialogTitle>
        <Typography variant="h6">Choose bot level</Typography>
      </DialogTitle>

      <DialogContent>
        <RadioGroup
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          sx={{
            '& .MuiFormControlLabel-root': {
              marginY: 1
            }
          }}
        >
          {botLevels.map((level) => (
            <Box
              key={level.value}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: selectedDifficulty === level.value ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              <FormControlLabel 
                value={level.value}
                control={
                  <Radio 
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-checked': {
                        color: 'white',
                      },
                    }}
                  />
                }
                label={level.label}
                sx={{ flexGrow: 1 }}
              />
              <Tooltip 
                title={
                  <Box>
                    <Typography variant="body2">{level.description}</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                      {level.average}
                    </Typography>
                  </Box>
                }
                arrow
              >
                <IconButton 
                  size="small"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: 'white'
                    }
                  }}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </RadioGroup>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              textTransform: 'none',
              py: 1
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            sx={{
              bgcolor: '#00875A',
              '&:hover': {
                bgcolor: '#007A51',
              },
              textTransform: 'none',
              py: 1
            }}
          >
            OK
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BotDialog; 