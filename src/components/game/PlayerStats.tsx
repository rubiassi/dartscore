import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
  Button
} from '@mui/material';
import CheckoutGuide from './CheckoutGuide';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useState, useCallback } from 'react';

interface PlayerStatsProps {
  name: string;
  score: number;
  isActive: boolean;
  average: number;
  lastThrows: number[];
  roundScore: number;
  ninedartsAvg: number;
  checkoutPercentage: number;
  onEndGame?: () => void;
}

const PlayerStats = ({ 
  name, 
  score, 
  isActive, 
  average, 
  lastThrows,
  roundScore,
  ninedartsAvg,
  checkoutPercentage,
  onEndGame
}: PlayerStatsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Beregn seneste score - hvis der ikke er nogen score endnu, vis '-'
  const latestScore = lastThrows.length > 0 ? lastThrows[0] || '-' : '-';

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <Paper
      elevation={isActive ? 8 : 1}
      sx={{
        p: isMobile ? 1 : 2,
        bgcolor: isActive ? 'primary.light' : 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Knapper i øverste højre hjørne */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 1,
          zIndex: 1
        }}
      >
        <IconButton
          onClick={toggleFullscreen}
          size={isMobile ? "small" : "medium"}
          sx={{ bgcolor: 'background.paper' }}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
        <Button
          variant="contained"
          color="error"
          size={isMobile ? "small" : "medium"}
          onClick={onEndGame}
          sx={{ minWidth: 0 }}
        >
          Afslut spil
        </Button>
      </Box>

      <Box sx={{ mb: 1, textAlign: 'center' }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          gutterBottom 
          sx={{ mb: 0.5 }}
        >
          {name}
        </Typography>
        <Typography 
          variant={isMobile ? "h3" : "h2"} 
          sx={{ 
            fontWeight: 'bold',
            lineHeight: 1
          }}
        >
          {score}
        </Typography>
        <Box 
          sx={{ 
            mt: 1, 
            height: isMobile ? '32px' : '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {score <= 170 && score >= 2 && <CheckoutGuide score={score} />}
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Typography 
        variant="subtitle2" 
        color="text.secondary"
        sx={{ mb: 1, textAlign: 'center' }}
      >
        Seneste score: {latestScore}
      </Typography>

      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1 }}
      >
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
          >
            Gennemsnit
          </Typography>
          <Typography variant={isMobile ? "body1" : "h6"}>
            {average.toFixed(1)}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
          >
            9 darts gns.
          </Typography>
          <Typography variant={isMobile ? "body1" : "h6"}>
            {ninedartsAvg.toFixed(1)}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
          >
            Checkout %
          </Typography>
          <Typography variant={isMobile ? "body1" : "h6"}>
            {checkoutPercentage.toFixed(1)}%
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default PlayerStats; 