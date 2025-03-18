import { useState } from 'react';
import { 
  Box, 
  Grid, 
  Button,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';

interface ScoreInputProps {
  onScore: (score: number) => void;
  onUndo: () => void;
}

// Almindelige scores i dart
const COMMON_SCORES = [
  180, 140, 137, 134, 131, 128, 125, 122, 119, 116,
  100, 98, 95, 92, 89, 86, 83, 80, 77, 74,
  60, 57, 54, 51, 48, 45, 42, 39, 36, 33,
  26, 23, 20, 17, 14, 11, 8, 5, 2, 0
];

const LEFT_QUICK_SCORES = [26, 41, 45, 60];
const RIGHT_QUICK_SCORES = [81, 85, 100, 140];

export const ScoreInput = ({ onScore, onUndo }: ScoreInputProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [customScore, setCustomScore] = useState<string[]>([]);

  const handleNumberClick = (num: string) => {
    if (customScore.length >= 3) return;
    
    // Hvis det er første ciffer, og det er 0, gør ingenting
    if (customScore.length === 0 && num === '0') return;
    
    const newScore = [...customScore, num];
    const scoreValue = parseInt(newScore.join(''), 10);
    
    // Tjek om scoren ville overstige 180
    if (scoreValue > 180) return;
    
    setCustomScore(newScore);
  };

  const handleQuickScore = (score: number) => {
    onScore(score);
    setCustomScore([]);
  };

  const handleCustomScoreSubmit = () => {
    const score = parseInt(customScore.join(''), 10);
    if (score <= 180) {
      onScore(score);
      setCustomScore([]);
    }
  };

  const handleBackspace = () => {
    setCustomScore(customScore.slice(0, -1));
  };

  const buttonSx = {
    height: isMobile ? '45px' : '60px',
    minWidth: 0,
    p: 1,
    fontSize: isMobile ? '1.2rem' : '1.5rem'
  };

  const quickScoreButtonSx = {
    ...buttonSx,
    bgcolor: '#000000',
    color: '#ffffff',
    '&:hover': {
      bgcolor: '#333333',
    }
  };

  const specialButtonSx = {
    ...buttonSx,
    bgcolor: '#000000',
    color: '#ffffff',
    '&:hover': {
      bgcolor: '#333333',
    }
  };

  const redButtonSx = {
    ...buttonSx,
    bgcolor: '#d32f2f',
    color: '#ffffff',
    '&:hover': {
      bgcolor: '#b71c1c',
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Score display */}
      <Box sx={{ 
        mb: 2, 
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'grey.100'
      }}>
        <Typography 
          variant="h2" 
          sx={{ 
            flex: 1, 
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.palette.primary.main
          }}
        >
          {customScore.length > 0 ? customScore.join('') : '0'}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleBackspace}
          disabled={customScore.length === 0}
          sx={{ 
            ml: 1,
            height: '50px',
            width: '50px',
            minWidth: '50px',
            fontSize: '1.5rem'
          }}
        >
          ←
        </Button>
      </Box>

      {/* Number pad with quick scores */}
      <Grid container spacing={1}>
        {/* Left quick score column */}
        <Grid item xs={2}>
          <Grid container spacing={1}>
            {LEFT_QUICK_SCORES.map((score) => (
              <Grid item xs={12} key={score}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleQuickScore(score)}
                  sx={quickScoreButtonSx}
                >
                  {score}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Main number pad */}
        <Grid item xs={6}>
          <Grid container spacing={1}>
            {[1,2,3,4,5,6,7,8,9].map((num) => (
              <Grid item xs={4} key={num}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleNumberClick(num.toString())}
                  sx={buttonSx}
                >
                  {num}
                </Button>
              </Grid>
            ))}
            <Grid item xs={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setCustomScore([])}
                sx={redButtonSx}
              >
                SLET
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleNumberClick('0')}
                sx={buttonSx}
              >
                0
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={onUndo}
                sx={redButtonSx}
              >
                FORTRYD
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Middle quick score column */}
        <Grid item xs={2}>
          <Grid container spacing={1}>
            {RIGHT_QUICK_SCORES.map((score) => (
              <Grid item xs={12} key={score}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleQuickScore(score)}
                  sx={quickScoreButtonSx}
                >
                  {score}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Special scores column */}
        <Grid item xs={2}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleQuickScore(180)}
                sx={specialButtonSx}
              >
                180
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleQuickScore(43)}
                sx={redButtonSx}
              >
                DART 43
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={customScore.length === 0 ? () => onScore(0) : handleCustomScoreSubmit}
                sx={{
                  ...specialButtonSx,
                  height: `calc(${isMobile ? '45px' : '60px'} * 2 + 8px)`,
                  fontSize: isMobile ? '1.4rem' : '1.8rem',
                  bgcolor: customScore.length === 0 ? theme.palette.error.main : theme.palette.success.dark,
                  '&:hover': {
                    bgcolor: customScore.length === 0 ? theme.palette.error.dark : theme.palette.success.main,
                  }
                }}
              >
                {customScore.length === 0 ? 'NO SCORE' : 'ENTER'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScoreInput; 