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
  successfulCheckouts?: number;
  children?: React.ReactNode;
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
  successfulCheckouts = 0,
  children
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
      
      <Box 
        sx={{ 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography 
          sx={{ 
            fontSize: '1rem',
            mb: 1
          }}
        >
          {name}
        </Typography>
        <Typography 
          variant="h1"
          sx={{ 
            fontSize: {
              xs: '6rem',    // Mobile
              sm: '7rem',    // Tablet
              md: '8rem'     // Desktop
            },
            fontWeight: 700,
            lineHeight: 0.9
          }}
        >
          {score}
        </Typography>
        <Box 
          sx={{ 
            height: {
              xs: '2rem',    // Mobile
              sm: '2.3rem',  // Tablet
              md: '2.5rem'   // Desktop
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </Box>

      <Box sx={{ px: 2, flex: 1, mt: -2 }}>
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: {
                xs: '0.7rem',    // Mobile
                sm: '0.8rem',    // Tablet
                md: '0.9rem'     // iPad Pro/Desktop
              }
            }}>Darts:</Typography>
            <Typography sx={{ 
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem'
              }
            }}>{dartsThrown}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem'
              }
            }}>Checkout:</Typography>
            <Typography sx={{ 
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem'
              }
            }}>
              {successfulCheckouts}/{doubleAttempts} - {checkoutPercentage.toFixed(2)}%
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 2,
              mb: 2,
              py: 1.5,
              borderTop: '2px solid rgba(255,255,255,0.15)',
              borderBottom: '2px solid rgba(255,255,255,0.15)',
              backgroundColor: 'rgba(255,255,255,0.02)'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Typography 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1.1rem',
                    md: '1.3rem'
                  },
                  fontWeight: 600,
                  mb: 0.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Set
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: {
                    xs: '1.8rem',
                    sm: '2.2rem',
                    md: '2.8rem'
                  },
                  fontWeight: 700,
                  color: '#4caf50',
                  textShadow: '0 0 10px rgba(76, 175, 80, 0.3)'
                }}
              >
                {setsWon}
              </Typography>
            </Box>
            <Box 
              sx={{ 
                width: '2px', 
                bgcolor: 'rgba(255,255,255,0.15)',
                mx: 2
              }} 
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Typography 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1.1rem',
                    md: '1.3rem'
                  },
                  fontWeight: 600,
                  mb: 0.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Leg
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: {
                    xs: '1.8rem',
                    sm: '2.2rem',
                    md: '2.8rem'
                  },
                  fontWeight: 700,
                  color: '#4caf50',
                  textShadow: '0 0 10px rgba(76, 175, 80, 0.3)'
                }}
              >
                {legsWon}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem'
              }
            }}>Game:</Typography>
            <Typography sx={{ 
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem'
              }
            }}>{average.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem'
              }
            }}>Set:</Typography>
            <Typography sx={{ 
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem'
              }
            }}>{setAverage.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem'
              }
            }}>Leg:</Typography>
            <Typography sx={{ 
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem'
              }
            }}>{legAverage.toFixed(2)}</Typography>
          </Box>
        </Box>

        <Box 
          sx={{ 
            mt: 'auto',
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography sx={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: {
              xs: '0.7rem',
              sm: '0.8rem',
              md: '0.9rem'
            }
          }}>Last score:</Typography>
          <Typography sx={{ 
            fontSize: {
              xs: '0.7rem',
              sm: '0.8rem',
              md: '0.9rem'
            }
          }}>{latestScore}</Typography>
          {checkoutThrows > 0 && (
            <Typography sx={{ 
              ml: 'auto', 
              color: '#4caf50', 
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem'
              }
            }}>
              {checkoutThrows} darts
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerStats; 