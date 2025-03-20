import React, { useState, useEffect } from 'react';
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
import { Player, GameConfig } from '../../types/game';
import CheckoutValidator from '../../utils/CheckoutValidator';

interface ScoreInputProps {
  currentPlayer: Player;
  currentScore: number;
  onScore: (score: number, dartsUsed?: number, doublesAttempted?: number) => void;
  gameConfig: GameConfig;
}

const ScoreInput: React.FC<ScoreInputProps> = ({
  currentPlayer,
  currentScore,
  onScore,
  gameConfig
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [inputValue, setInputValue] = useState<string>('');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showDoubleAttemptDialog, setShowDoubleAttemptDialog] = useState(false);
  const [showDoubleCountDialog, setShowDoubleCountDialog] = useState(false);
  const [showDoubleAttemptDartsDialog, setShowDoubleAttemptDartsDialog] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number>(0);
  const [dartsUsed, setDartsUsed] = useState<number>(0);
  const [minimumDartsRequired, setMinimumDartsRequired] = useState<number>(1);
  const [maxDartsAllowed, setMaxDartsAllowed] = useState<number>(3);
  const [isCheckoutGuideVisible, setIsCheckoutGuideVisible] = useState(false);

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
      setIsCheckoutGuideVisible(false);
    } else if (value === 'Ok') {
      if (isCheckoutGuideVisible) {
        // Hvis checkout guiden er synlig, behandl det som en checkout
        handleCheckoutAttempt();
      } else if (inputValue) {
        // Normal score håndtering
        const score = parseInt(inputValue);
        handleScoreInput(score);
      }
    } else if (typeof value === 'number') {
      if (isCheckoutGuideVisible) {
        // Hvis der tastes et tal mens checkout guiden er synlig, skjul den
        setIsCheckoutGuideVisible(false);
      }
      
      if (fixedScores.includes(value)) {
        // Håndtér faste score-knapper
        handleScoreInput(value);
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

  const handleScoreInput = (score: number) => {
    if (score <= currentScore && score <= 180) {
      const newScore = currentScore - score;
      setSelectedScore(score);
      
      if (gameConfig.useDoubles) {
        if (newScore === 0) {
          // Checkout situation - brug eksisterende logik
          const checkoutInfo = CheckoutValidator.validateCheckout(currentScore, score);
          if (checkoutInfo.isPossible) {
            if (checkoutInfo.minimumDarts < 3) {
              setMinimumDartsRequired(checkoutInfo.minimumDarts);
              setShowCheckoutDialog(true);
            } else {
              setDartsUsed(3);
              setShowDoubleAttemptDialog(true);
            }
          } else {
            setDartsUsed(3);
            setShowDoubleAttemptDialog(true);
          }
        } else if (newScore >= 2 && newScore <= 40) {
          // Double forsøg logik (ikke checkout)
          if (currentScore > 100) {
            // Over 2-darts kombination (fx 141 -> 101 -> 40)
            // Her kan der kun være brugt 1 dart på double
            setMinimumDartsRequired(1);
            setMaxDartsAllowed(1);
            setShowDoubleAttemptDartsDialog(true);
          } else if (currentScore > 60) {
            // 2-darts kombination (fx 100 -> 60 -> 40)
            // Her kan der være brugt 1-2 darts på double
            setMinimumDartsRequired(1);
            setMaxDartsAllowed(2);
            setShowDoubleAttemptDartsDialog(true);
          } else if (currentScore === 50) {
            // Speciel Bull regel
            setMinimumDartsRequired(1);
            setMaxDartsAllowed(3);
            setShowDoubleAttemptDartsDialog(true);
          } else if (currentScore > 40) {
            // Mellem 41 og 60 (fx 56 -> 20)
            // Her kan der være brugt 1-3 darts på double
            setMinimumDartsRequired(1);
            setMaxDartsAllowed(3);
            setShowDoubleAttemptDartsDialog(true);
          } else if (currentScore <= 40) {
            // Under eller lig med 40
            if (newScore % 2 === 0) {
              // Lige score - start med 1 dart
              setMinimumDartsRequired(1);
            } else {
              // Ulige score - start med 2 darts
              setMinimumDartsRequired(2);
            }
            setMaxDartsAllowed(3);
            setShowDoubleAttemptDartsDialog(true);
          }
        } else {
          // Normal score uden double mulighed
          onScore(score);
          setInputValue('');
        }
      } else {
        // Hvis double out ikke er aktiveret
        onScore(score);
        setInputValue('');
      }
    }
  };

  const handleCheckoutAttempt = () => {
    // Sæt score til 0 og brug eksisterende checkout logik
    setSelectedScore(currentScore);
    const checkoutInfo = CheckoutValidator.validateCheckout(currentScore, currentScore);
    if (checkoutInfo.isPossible) {
      if (checkoutInfo.minimumDarts < 3) {
        setMinimumDartsRequired(checkoutInfo.minimumDarts);
        setShowCheckoutDialog(true);
      } else {
        setDartsUsed(3);
        setShowDoubleAttemptDialog(true);
      }
    } else {
      setDartsUsed(3);
      setShowDoubleAttemptDialog(true);
    }
    setInputValue('');
    setIsCheckoutGuideVisible(false);
  };

  // Opdater useEffect til at håndtere checkout guide visibility
  useEffect(() => {
    if (gameConfig.useDoubles && currentScore <= 170) {
      const checkoutInfo = CheckoutValidator.checkPossibleDoubleAttempt(currentScore, 0);
      if (checkoutInfo.possibleDoubleAttempt && checkoutInfo.checkoutRoute) {
        setIsCheckoutGuideVisible(true);
      } else {
        setIsCheckoutGuideVisible(false);
      }
    } else {
      setIsCheckoutGuideVisible(false);
    }
  }, [currentScore, gameConfig.useDoubles]);

  const handleCheckoutConfirm = (darts: number) => {
    setDartsUsed(darts);
    if (darts === 1) {
      // Ved 1 dart, gå direkte til double bekræftelse
      setShowCheckoutDialog(false);
      setShowDoubleAttemptDialog(true);
    } else if (darts === 2) {
      // Ved 2 darts, spørg om double bekræftelse
      setShowCheckoutDialog(false);
      setShowDoubleAttemptDialog(true);
    } else {
      // Ved 3 darts, spørg om antal double forsøg
      setShowCheckoutDialog(false);
      setShowDoubleCountDialog(true);
    }
  };

  const handleDoubleAttemptResponse = (hadDoubleAttempt: boolean) => {
    if (currentScore - selectedScore === 0) {
      // Dette er en checkout
      onScore(selectedScore, dartsUsed, hadDoubleAttempt ? 1 : 0);
    } else {
      // Dette er et double forsøg uden checkout
      onScore(selectedScore, undefined, hadDoubleAttempt ? 1 : 0);
    }
    setInputValue('');
    setShowDoubleAttemptDialog(false);
    setDartsUsed(0);
  };

  const handleDoubleCountResponse = (doublesAttempted: number) => {
    onScore(selectedScore, dartsUsed, doublesAttempted);
    setInputValue('');
    setShowDoubleCountDialog(false);
    setDartsUsed(0);
  };

  const handleDoubleAttemptDartsConfirm = (darts: number) => {
    // Registrer scoren direkte med det valgte antal double-forsøg
    onScore(selectedScore, undefined, darts);
    setInputValue('');
    setShowDoubleAttemptDartsDialog(false);
  };

  const handleUndo = () => {
    // Hvis der er input, fjern sidste ciffer - ellers nulstil
    if (inputValue.length > 0) {
      setInputValue(inputValue.slice(0, -1));
    }
  };

  const handleBust = () => {
    if (inputValue && parseInt(inputValue) < currentScore) {
      // Hvis inputValue er mindre end currentScore, sæt scoren til inputValue
      const remainingScore = parseInt(inputValue);
      const difference = currentScore - remainingScore;
      onScore(difference);
    } else {
      // Ellers normal BUST funktion
      onScore(0);
    }
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
        </Box>

        <Button
          className="css-79do5w-MuiButtonBase-root-MuiButton-root"
          sx={{ 
            color: inputValue && parseInt(inputValue) < currentScore ? '#4caf50' : '#ff5722', // Grøn for REMAINING, rød for BUST
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
          {inputValue && parseInt(inputValue) < currentScore ? 'REMAINING' : 'BUST'}
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
              {score === 'Ok' ? (isCheckoutGuideVisible ? 'CHECK' : 'Ok') : score}
            </Button>
          );
        })}
      </Box>

      {/* Dialog for antal darts brugt (under 60) */}
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
            xs: '1.5rem',
            sm: '1.75rem',
            md: '2rem'
          }
        }}>
          Antal darts brugt
        </DialogTitle>
        <DialogContent>
          <Typography sx={{
            fontSize: {
              xs: '1.2rem',
              sm: '1.35rem',
              md: '1.5rem'
            }
          }}>
            Hvor mange darts blev brugt på at lukke?
          </Typography>
        </DialogContent>
        <DialogActions>
          {[1, 2, 3].map((darts) => (
            darts >= minimumDartsRequired && (
              <Button 
                key={darts}
                onClick={() => handleCheckoutConfirm(darts)}
                sx={{ 
                  color: 'white',
                  fontSize: {
                    xs: '1rem',
                    sm: '1.2rem',
                    md: '1.4rem'
                  }
                }}
              >
                {darts} {darts === 1 ? 'Dart' : 'Darts'}
              </Button>
            )
          ))}
        </DialogActions>
      </Dialog>

      {/* Dialog for double forsøg */}
      <Dialog 
        open={showDoubleAttemptDialog} 
        onClose={() => {
          setShowDoubleAttemptDialog(false);
          setDartsUsed(0);
        }}
        PaperProps={{
          sx: {
            bgcolor: '#2c3e50',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: {
            xs: '1.5rem',
            sm: '1.75rem',
            md: '2rem'
          }
        }}>
          {currentScore - selectedScore === 0 ? 'Bekræft Checkout' : 'Double Forsøg'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{
            fontSize: {
              xs: '1.2rem',
              sm: '1.35rem',
              md: '1.5rem'
            }
          }}>
            {currentScore - selectedScore === 0 
              ? `Godkend lukning af leg med ${dartsUsed} darts, heraf 1 dart på double?`
              : 'Var sidste dart brugt som forsøg på double?'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => handleDoubleAttemptResponse(true)}
            sx={{ 
              color: 'white',
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.4rem'
              }
            }}
          >
            {currentScore - selectedScore === 0 ? 'Godkend' : 'Ja'}
          </Button>
          <Button 
            onClick={() => handleDoubleAttemptResponse(false)}
            sx={{ 
              color: 'white',
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.4rem'
              }
            }}
          >
            {currentScore - selectedScore === 0 ? 'Fortryd' : 'Nej'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for antal double forsøg (ved 3 darts checkout) */}
      <Dialog 
        open={showDoubleCountDialog} 
        onClose={() => {
          setShowDoubleCountDialog(false);
          setDartsUsed(0);
        }}
        PaperProps={{
          sx: {
            bgcolor: '#2c3e50',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: {
            xs: '1.5rem',
            sm: '1.75rem',
            md: '2rem'
          }
        }}>
          Antal double forsøg
        </DialogTitle>
        <DialogContent>
          <Typography sx={{
            fontSize: {
              xs: '1.2rem',
              sm: '1.35rem',
              md: '1.5rem'
            }
          }}>
            Hvor mange af disse darts blev brugt på forsøg mod double?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => handleDoubleCountResponse(1)}
            sx={{ 
              color: 'white',
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.4rem'
              }
            }}
          >
            1 Dart
          </Button>
          <Button 
            onClick={() => handleDoubleCountResponse(2)}
            sx={{ 
              color: 'white',
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.4rem'
              }
            }}
          >
            2 Darts
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for antal darts brugt ved double-forsøg */}
      <Dialog 
        open={showDoubleAttemptDartsDialog} 
        onClose={() => setShowDoubleAttemptDartsDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2c3e50',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: {
            xs: '1.5rem',
            sm: '1.75rem',
            md: '2rem'
          }
        }}>
          Double forsøg
        </DialogTitle>
        <DialogContent>
          <Typography sx={{
            fontSize: {
              xs: '1.2rem',
              sm: '1.35rem',
              md: '1.5rem'
            }
          }}>
            Hvor mange darts blev brugt på double?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => handleDoubleAttemptDartsConfirm(0)}
            sx={{ 
              color: 'white',
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.4rem'
              }
            }}
          >
            Ingen
          </Button>
          {[1, 2, 3].map((darts) => (
            darts >= minimumDartsRequired && darts <= maxDartsAllowed && (
              <Button 
                key={darts}
                onClick={() => handleDoubleAttemptDartsConfirm(darts)}
                sx={{ 
                  color: 'white',
                  fontSize: {
                    xs: '1rem',
                    sm: '1.2rem',
                    md: '1.4rem'
                  }
                }}
              >
                {darts} {darts === 1 ? 'Dart' : 'Darts'}
              </Button>
            )
          ))}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScoreInput; 