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
  Box
} from '@mui/material';

interface BotLevel {
  value: string;
  label: string;
  description: string;
  average: string;
}

const botLevels: BotLevel[] = [
  {
    value: 'very-easy',
    label: 'Meget let',
    description: 'Perfekt for nybegyndere. Botten vil lave mange fejl.',
    average: 'Gennemsnit: < 30'
  },
  {
    value: 'easy',
    label: 'Let',
    description: 'For casual spillere. Botten spiller stabilt, men ikke særlig godt.',
    average: 'Gennemsnit: 30-40'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'For regelmæssige spillere. Botten giver en god udfordring.',
    average: 'Gennemsnit: 40-50'
  },
  {
    value: 'medium-hard',
    label: 'Medium svær',
    description: 'For erfarne spillere. Botten spiller på konkurrenceniveau.',
    average: 'Gennemsnit: 50-60'
  },
  {
    value: 'hard',
    label: 'Svær',
    description: 'For avancerede spillere. Botten spiller på højt niveau.',
    average: 'Gennemsnit: 60-80'
  },
  {
    value: 'pro',
    label: 'Pro',
    description: 'For professionelle spillere. Botten laver sjældent fejl.',
    average: 'Gennemsnit: 80-100'
  },
  {
    value: 'king',
    label: 'Kong',
    description: 'Den ultimative udfordring. Botten spiller næsten perfekt dart.',
    average: 'Gennemsnit: 95+'
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
        <Typography variant="h6">Vælg bot niveau</Typography>
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
                flexDirection: 'column',
                mb: 1,
                p: 1.5,
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
                sx={{ 
                  flexGrow: 1,
                  mb: 0.5
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  pl: 4, 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 300,
                  fontSize: '0.75rem',
                  lineHeight: 1.2
                }}
              >
                {level.description} • {level.average}
              </Typography>
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
            Annuller
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
            Vælg
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BotDialog; 