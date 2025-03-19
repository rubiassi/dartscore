import {
  Box,
  Typography,
} from '@mui/material';

interface PlayerStatsProps {
  name: string;
  score: number;
  isActive: boolean;
  average: number;
  setAverage?: number;
  legAverage?: number;
  lastThrows: number[];
  roundScore: number;
  ninedartsAvg: number;
  checkoutPercentage: number;
  setsWon?: number;
  legsWon?: number;
  dartsThrown?: number;
  doubleAttempts?: number;
  checkoutThrows?: number;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({
  name,
  score,
  isActive,
  average,
  setAverage = 0,
  legAverage = 0,
  lastThrows,
  roundScore,
  ninedartsAvg,
  checkoutPercentage,
  setsWon = 0,
  legsWon = 0,
  dartsThrown = 0,
  doubleAttempts = 0,
  checkoutThrows = 0,
}) => {
  const latestScore = lastThrows.length > 0 ? lastThrows[0] || '-' : '-';

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#2c3e50',
        color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRight: '1px solid #34495e'
      }}
    >
      {isActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#4caf50',
            m: 2
          }}
        />
      )}
      
      <Box sx={{ p: 2 }}>
        <Typography 
          sx={{ 
            fontSize: '0.875rem',
            mb: 1,
            ml: 3
          }}
        >
          {name}
        </Typography>
        <Typography 
          variant="h1"
          sx={{ 
            fontSize: '5rem',
            fontWeight: 700,
            lineHeight: 1,
            ml: 3
          }}
        >
          {score}
        </Typography>
      </Box>

      <Box sx={{ px: 2, flex: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Darts:</Typography>
            <Typography>{dartsThrown}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Checkout:</Typography>
            <Typography>{checkoutPercentage.toFixed(2)}%</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Double Attempts:</Typography>
            <Typography>{doubleAttempts}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Set:</Typography>
              <Typography>{setsWon}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Leg:</Typography>
              <Typography>{legsWon}</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Game:</Typography>
            <Typography>{average.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Set:</Typography>
            <Typography>{setAverage.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Leg:</Typography>
            <Typography>{legAverage.toFixed(2)}</Typography>
          </Box>
        </Box>

        <Box 
          sx={{ 
            mt: 'auto',
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Last score:</Typography>
          <Typography>{latestScore}</Typography>
          {checkoutThrows > 0 && (
            <Typography sx={{ ml: 'auto', color: '#4caf50' }}>
              {checkoutThrows} darts
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerStats; 