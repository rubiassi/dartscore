import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import { Player, GameConfig, CheckoutGuide } from '../../types/game';

interface ScoreInputProps {
  currentPlayer: Player;
  currentScore: number;
  onScore: (score: number, dartsUsed?: number, isDouble?: boolean) => void;
  gameConfig: GameConfig;
  checkoutGuide: CheckoutGuide | null;
}

const ScoreInput: React.FC<ScoreInputProps> = ({
  currentPlayer,
  currentScore,
  onScore,
  gameConfig,
  checkoutGuide
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [inputValue, setInputValue] = useState<string>('');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number>(0);

  const shortcutScores = [
    26, 1, 2, 3, 81,
    41, 4, 5, 6, 85,
    45, 7, 8, 9, 100,
    'Clear', 140, 0, 180, 'Ok'
  ];

  // Definér faste scores, der skal have en anden farve
  const fixedScores = [26, 41, 45, 140, 180, 81, 85, 100];

  const handleNumberClick = (value: number | string) => {
    if (value === 'Clear') {
      setInputValue('');
    } else if (value === 'Ok') {
      if (inputValue) {
        const score = parseInt(inputValue);
        if (score <= currentScore && score <= 180) {
          if (gameConfig.doubleOut && currentScore - score === 0) {
            setSelectedScore(score);
            setShowCheckoutDialog(true);
          } else {
            onScore(score);
            setInputValue('');
          }
        }
      }
    } else if (typeof value === 'number') {
      if (fixedScores.includes(value)) {
        // Håndtér faste score-knapper
        if (value <= currentScore) {
          if (gameConfig.doubleOut && currentScore - value === 0) {
            setSelectedScore(value);
            setShowCheckoutDialog(true);
          } else {
            onScore(value);
            setInputValue('');
          }
        }
      } else {
        // Håndtér cifre (0-9) for at opbygge en score
        const newValue = inputValue + value.toString();
        const numberValue = parseInt(newValue);
        if (numberValue <= 180) {
          setInputValue(newValue);
        }
      }
    }
  };

  const handleCheckoutConfirm = (dartsUsed: number) => {
    onScore(selectedScore, dartsUsed, true);
    setInputValue('');
    setShowCheckoutDialog(false);
  };

  const handleUndo = () => {
    // Hvis der er input, fjern sidste ciffer - ellers nulstil
    if (inputValue.length > 0) {
      setInputValue(inputValue.slice(0, -1));
    }
  };

  const handleBust = () => {
    onScore(0);
    setInputValue('');
  };

  return (
    <Box 
      className="css-32cva3"
      sx={{ 
        bgcolor: '#2c3e50',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box 
        className="css-zyhaz9"
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          height: 48,
          minHeight: 48,
          bgcolor: '#34495e'
        }}
      >
        <Button
          className="css-1eyrzcg-MuiButtonBase-root-MuiButton-root"
          sx={{ 
            color: 'white',
            minWidth: 48,
            height: 48,
            borderRadius: 0,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
          onClick={handleUndo}
        >
          <UndoIcon />
        </Button>

        <Box 
          className="css-e3ejpk"
          sx={{ 
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography 
            variant="h6" 
            className="css-1oktaii-MuiTypography-root"
            sx={{ 
              color: 'white',
              fontWeight: 400,
              fontSize: {
                xs: '1.5rem',    // Mobile (< 600px)
                sm: '1.75rem',   // Tablet (600px-900px)
                md: '2rem'       // Desktop (900px+)
              }
            }}
          >
            {inputValue || '0'}
          </Typography>
          {checkoutGuide && (
            <Typography 
              sx={{ 
                color: '#4caf50',
                ml: 2,
                fontSize: {
                  xs: '0.75rem',  // Mobile: ~15% smaller
                  sm: '0.8rem',   // Tablet: ~10% smaller
                  md: '0.875rem'  // Desktop: 100%
                }
              }}
            >
              {checkoutGuide.combinations[0]}
            </Typography>
          )}
        </Box>

        <Button
          className="css-79do5w-MuiButtonBase-root-MuiButton-root"
          sx={{ 
            color: '#ff5722',
            minWidth: 48,
            height: 48,
            borderRadius: 0,
            fontSize: {
              xs: '1rem',    // Mobile (< 600px)
              sm: '1.2rem',  // Tablet (600px-900px)
              md: '1.4rem'   // Desktop (900px+)
            },
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
          onClick={handleBust}
        >
          BUST
        </Button>
      </Box>

      <Box 
        className="css-1g1k6ds"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          flex: 1,
          bgcolor: '#2c3e50',
          overflow: 'hidden'
        }}
      >
        {shortcutScores.map((score, index) => {
          const isAction = score === 'Clear' || score === 'Ok';
          const isFixedScore = typeof score === 'number' && fixedScores.includes(score);
          const isDigit = typeof score === 'number' && !isFixedScore && score >= 0 && score <= 9;
          
          // Fastlæg farven baseret på knappetype
          let color;
          if (score === 'Clear') {
            color = '#ff5722';
          } else if (score === 'Ok') {
            color = '#4caf50';
          } else if (isFixedScore || isDigit) {
            color = 'rgba(255, 255, 255, 0.8)'; // Lysere farve for faste scores og cifre
          } else {
            color = 'rgba(255, 255, 255, 0.5)'; // Kun for andre elementer
          }
          
          const className = score === 'Clear' ? "css-17e7aez-MuiButtonBase-root-MuiButton-root" : 
                           score === 'Ok' ? "css-927pyo-MuiButtonBase-root-MuiButton-root" : 
                           "css-1uzdr2z-MuiButtonBase-root-MuiButton-root";
          
          return (
            <Button
              key={index}
              className={className}
              onClick={() => handleNumberClick(score)}
              sx={{ 
                color: color,
                bgcolor: isFixedScore ? '#2e4058' : '#34495e', // Mørkere blå for faste scores
                height: '100%',
                borderRadius: 0,
                border: '1px solid #1f2d3d', // Tilføj border til alle knapper
                userSelect: 'none',
                fontSize: {
                  xs: isDigit ? '1.25rem' : '1rem',    // Mobile (< 600px)
                  sm: isDigit ? '1.5rem' : '1.25rem',  // Tablet (600px-900px)
                  md: isDigit ? '2rem' : '1.5rem'      // Desktop (900px+)
                },
                fontWeight: (isFixedScore || isDigit) ? 700 : 400, // Fremhævet skrifttype for cifre og faste scores
                '&:hover': {
                  bgcolor: isFixedScore ? '#364c64' : 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {score}
            </Button>
          );
        })}
      </Box>

      <Dialog 
        open={showCheckoutDialog} 
        onClose={() => setShowCheckoutDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2c3e50',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: {
            xs: '1.5rem',    // Mobile (< 600px)
            sm: '1.75rem',   // Tablet (600px-900px)
            md: '2rem'       // Desktop (900px+)
          }
        }}>
          Checkout Darts Used
        </DialogTitle>
        <DialogContent>
          <Typography sx={{
            fontSize: {
              xs: '1.2rem',   // Mobile (< 600px)
              sm: '1.35rem',  // Tablet (600px-900px)
              md: '1.5rem'    // Desktop (900px+)
            }
          }}>
            How many darts did you use to checkout {selectedScore}?
          </Typography>
          {checkoutGuide && (
            <Typography sx={{ 
              color: '#4caf50', 
              mt: 1,
              fontSize: {
                xs: '1rem',    // Mobile (< 600px)
                sm: '1.25rem', // Tablet (600px-900px)
                md: '1.4rem'   // Desktop (900px+)
              }
            }}>
              Suggestion: {checkoutGuide.combinations[0]}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => handleCheckoutConfirm(1)}
            sx={{ 
              color: 'white',
              fontSize: {
                xs: '1rem',    // Mobile (< 600px)
                sm: '1.2rem',  // Tablet (600px-900px)
                md: '1.4rem'   // Desktop (900px+)
              }
            }}
          >
            1 Dart
          </Button>
          <Button 
            onClick={() => handleCheckoutConfirm(2)}
            sx={{ 
              color: 'white',
              fontSize: {
                xs: '1rem',    // Mobile (< 600px)
                sm: '1.2rem',  // Tablet (600px-900px)
                md: '1.4rem'   // Desktop (900px+)
              }
            }}
          >
            2 Darts
          </Button>
          <Button 
            onClick={() => handleCheckoutConfirm(3)}
            sx={{ 
              color: 'white',
              fontSize: {
                xs: '1rem',    // Mobile (< 600px)
                sm: '1.2rem',  // Tablet (600px-900px)
                md: '1.4rem'   // Desktop (900px+)
              }
            }}
          >
            3 Darts
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScoreInput; 