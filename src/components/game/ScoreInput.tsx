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
import { styled } from '@mui/material/styles';
import UndoIcon from '@mui/icons-material/Undo';
import { Player, GameConfig } from '../../types/game';
import doubleOutData from '../../data/Double-UD.json';
import DartCheckoutModal from '../dialogs/DartCheckoutModal';
import DoubleAttemptModal from '../dialogs/DoubleAttemptModal';

// Styled components
const StyledInputContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    maxHeight: '100%',
    borderRadius: 0
  },
  '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '0 auto',
    maxWidth: '637px', // 796 * 0.8
    height: '437px'    // 546 * 0.8
  }
}));

const StyledInputHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.75),
  gap: theme.spacing(0.75),
  height: '64px',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& > button': {
    flex: '0 0 auto',
    width: 'calc(20% - 6px)',  // 20% for 5 kolonner minus gap
    height: '63px'
  },
  '& > p': {
    flex: '1 1 auto',
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: 600,
    margin: '0 8px'
  },
  // Responsive styles
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    gap: theme.spacing(1),
    '& > button': {
      width: 'calc(20% - 8px)'  // Justeret for større gap på mobile
    }
  },
  '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
    padding: theme.spacing(0.5),
    gap: theme.spacing(0.5),
    '& > button': {
      width: 'calc((713px - 28px) / 5 - 6px)'  // Tilpasset til faktisk container bredde
    }
  }
}));

const StyledNumberPad = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gridTemplateRows: 'repeat(4, 1fr)',
  gap: theme.spacing(0.75),
  padding: theme.spacing(0.75),
  backgroundColor: theme.palette.background.default,
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
    alignContent: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(1),
    height: 'calc(424px - 127px)',
    '& > button': {
      height: 'calc((424px - 127px - 0px) / 4)'
    }
  }
}));

const StyledActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isFixedScore' && prop !== 'isAction'
})<{ isFixedScore?: boolean; isAction?: boolean }>(({ theme, isFixedScore, isAction }) => ({
  color: isAction ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: isFixedScore 
    ? theme.palette.action.selected
    : theme.palette.background.paper,
  height: '100%',
  minHeight: '48px',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  userSelect: 'none',
  fontSize: '1.25rem',
  fontWeight: 600,
  padding: 0,
  transition: theme.transitions.create(
    ['background-color', 'transform', 'box-shadow', 'color'],
    { duration: theme.transitions.duration.short }
  ),
  '&:hover': {
    backgroundColor: isFixedScore 
      ? theme.palette.action.hover
      : theme.palette.action.hover,
    transform: 'scale(0.98)',
    boxShadow: theme.shadows[2]
  },
  '&:active': {
    transform: 'scale(0.95)',
    boxShadow: theme.shadows[1]
  },
  '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
    fontSize: '1.75rem',
    fontWeight: 600,
    boxShadow: theme.shadows[1],
    '&.digit-button': {
      fontSize: '2rem',
      fontWeight: 700
    },
    '&.fixed-score-button': {
      fontSize: '2rem',
      fontWeight: 600
    }
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3)
    }
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  textAlign: 'center',
  padding: theme.spacing(2, 3),
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.5rem'
  }
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  '& .MuiTypography-root': {
    marginBottom: theme.spacing(2)
  }
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  gap: theme.spacing(2)
}));

const StyledScoreDisplay = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.5rem'
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem'
  },
  '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
    fontSize: '3.5rem'
  }
}));

const StyledUndoButton = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  padding: 0,
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.75rem'
  },
  // Responsive styles
  [theme.breakpoints.down('sm')]: {
    '& .MuiSvgIcon-root': {
      fontSize: '2rem'
    }
  },
  '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
    '& .MuiSvgIcon-root': {
      fontSize: '2.25rem'
    }
  }
}));

// Gyldige checkout scores (170 og ned)
const VALID_CHECKOUT_SCORES = [
  170, 167, 164, 161, 160, 158, 157, 156, 155, 154, 153, 152, 151, 150,
  149, 148, 147, 146, 145, 144, 143, 142, 141, 140, 139, 138, 137, 136,
  135, 134, 133, 132, 131, 130, 129, 128, 127, 126, 125, 124, 123, 122,
  121, 120, 119, 118, 117, 116, 115, 114, 113, 112, 111, 110, 109, 108,
  107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93,
  92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76,
  75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59,
  58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42,
  41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25,
  24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7,
  6, 5, 4, 3, 2
];

interface ScoreInputProps {
  currentPlayer: Player;
  currentScore: number;
  onScore: (score: number, dartsUsed?: number, doublesAttempted?: number) => void;
  gameConfig: GameConfig;
}

interface DoubleOutOption {
  rest: number;
  points: number;
  darts: number;
  checkdarts: number[];
}

const ScoreInput: React.FC<ScoreInputProps> = ({
  currentPlayer,
  currentScore,
  onScore,
  gameConfig
}) => {
  const [inputScore, setInputScore] = useState<string>('');
  const [isDartModalOpen, setIsDartModalOpen] = useState(false);
  const [isDoubleAttemptModalOpen, setIsDoubleAttemptModalOpen] = useState(false);
  const [tempScore, setTempScore] = useState<number>(0);
  const [checkDartsOptions, setCheckDartsOptions] = useState<number[]>([]);
  const [checkLukningResult, setCheckLukningResult] = useState<DoubleOutOption | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const shortcutScores = [
    26, 1, 2, 3, 81,
    41, 4, 5, 6, 85,
    45, 7, 8, 9, 100,
    'Clear', 140, 0, 180, 'Ok'
  ];

  const fixedScores = [26, 41, 45, 140, 180, 81, 85, 100];

  const isDouble = (score: number) => {
    return score % 2 === 0 && score > 0;
  };

  const findCheckDartsOptions = (rest: number, points: number) => {
    const matchingOption = doubleOutData.find((option) => 
      option.rest === rest && option.points === points
    );
    return matchingOption ? matchingOption.checkdarts : [];
  };

  const findClosingOptions = (rest: number, points: number) => {
    if (rest === points) {
      points = 0;
    }

    return doubleOutData.filter((option) => 
      option.rest === rest && option.points === points
    );
  };

  const handleOpenDartModal = (closingOption: DoubleOutOption) => {
    setTempScore(currentScore - closingOption.points);
    setCheckLukningResult(closingOption);
    setIsDartModalOpen(true);
  };

  const handleDartSelect = (darts: number) => {
    setIsDartModalOpen(false);
    if (!checkLukningResult) return;
    
    const doubleAttempts = checkLukningResult.checkdarts.length - 1;
    onScore(tempScore, darts, doubleAttempts);
    setInputScore('');
    setCheckLukningResult(null);
  };

  const handleSelectDoubleAttempt = (attempts: number) => {
    setIsDoubleAttemptModalOpen(false);
    onScore(tempScore, 3, attempts);
    setInputScore('');
    setCheckDartsOptions([]);
  };

  const handleScoreInput = (score: number) => {
    const newScore = currentScore - score;

    // Tjek for ugyldige scores
    if (newScore < 0) {
      console.log("Score for høj:", score);
      handleBust();
      return;
    }

    // Tjek for ugyldig remaining score (kan ikke være 1)
    if (newScore === 1) {
      console.log("Kan ikke efterlade score på 1");
      handleBust();
      return;
    }

    if (gameConfig.showCheckout) {
      const checkDarts = findCheckDartsOptions(currentScore, score);
      if (newScore > 0 && checkDarts.length > 1) {
        setTempScore(score);
        setCheckDartsOptions(checkDarts);
        setIsDoubleAttemptModalOpen(true);
        return;
      }

      if (newScore === 0) {
        const closingOptions = findClosingOptions(currentScore, score);
        if (closingOptions.length > 0) {
          handleOpenDartModal(closingOptions[0]);
          return;
        }
      }
    }

    onScore(score, 3, 0);
    setInputScore('');
  };

  const handleBust = () => {
    onScore(0, 3, 0);
    setInputScore('');
  };

  const handleUndo = () => {
    if (inputScore.length > 0) {
      setInputScore(inputScore.slice(0, -1));
    }
  };

  const handleNumberClick = (value: number | string) => {
    if (value === 'Clear') {
      setInputScore('');
    } else if (value === 'Ok') {
      if (inputScore) {
        // Normal score håndtering
        const score = parseInt(inputScore);
        handleScoreInput(score);
      }
    } else if (typeof value === 'number') {
      if (fixedScores.includes(value)) {
        // Håndtér faste score-knapper
        handleScoreInput(value);
      } else {
        // Håndtér cifre (0-9) for at opbygge en score
        const newValue = inputScore + value.toString();
        const numberValue = parseInt(newValue);
        if (numberValue <= 180) {
          setInputScore(newValue);
        }
      }
    }
  };

  return (
    <StyledInputContainer>
      <StyledInputHeader>
        <StyledUndoButton onClick={handleUndo}>
          <UndoIcon />
        </StyledUndoButton>

        <StyledScoreDisplay>
          {inputScore || '0'}
        </StyledScoreDisplay>

        <StyledActionButton
          onClick={handleBust}
          sx={{ 
            borderRadius: 0,
            color: inputScore && parseInt(inputScore) < currentScore 
              ? 'success.main'
              : 'error.main'
          }}
        >
          {inputScore && parseInt(inputScore) < currentScore ? 'REMAINING' : 'BUST'}
        </StyledActionButton>
      </StyledInputHeader>

      <StyledNumberPad>
        {shortcutScores.map((score, index) => {
          const isAction = score === 'Clear' || score === 'Ok';
          const isFixedScore = typeof score === 'number' && fixedScores.includes(score);
          const isDigit = typeof score === 'number' && !isFixedScore && score >= 0 && score <= 9;
          
          return (
            <StyledActionButton
              key={index}
              onClick={() => handleNumberClick(score)}
              isFixedScore={isFixedScore}
              isAction={isAction}
              className={isDigit ? 'digit-button' : isFixedScore ? 'fixed-score-button' : ''}
              sx={{ 
                color: score === 'Clear' 
                  ? 'error.main'
                  : score === 'Ok'
                  ? 'success.main'
                  : 'text.primary'
              }}
            >
              {score === 'Ok' ? 'Ok' : score}
            </StyledActionButton>
          );
        })}
      </StyledNumberPad>

      {/* Modal håndtering */}
      {isDartModalOpen && checkLukningResult && (
        <DartCheckoutModal
          dartsOptions={checkLukningResult}
          onSelectDarts={(rest: number, darts: number, doubles: number) => {
            handleDartSelect(darts);
          }}
          onClose={() => setIsDartModalOpen(false)}
        />
      )}
      
      {isDoubleAttemptModalOpen && (
        <DoubleAttemptModal
          checkDartsOptions={checkDartsOptions}
          onSelectDarts={handleSelectDoubleAttempt}
          onClose={() => setIsDoubleAttemptModalOpen(false)}
        />
      )}
    </StyledInputContainer>
  );
};

export default ScoreInput; 