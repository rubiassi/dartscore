import { Box, Typography } from '@mui/material';
import React, { ReactElement } from 'react';

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
  onUpdateScore?: (score: number, dartsUsed: number, doublesAttempted: number) => void;
  showCheckout?: boolean;
  useDoubles?: boolean;
}

const PlayerStatsComponent: React.FC<PlayerStatsProps> = ({
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
  children,
  onUpdateScore,
  showCheckout = true,
  useDoubles = true
}) => {
  const latestScore = lastThrows.length > 0 ? lastThrows[0] || '-' : '-';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#2c3e50',
        color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
        position: 'relative',
        borderRight: '1px solid #34495e',
        overflow: 'auto'
      }}
    >
      {isActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: { xs: 5, sm: 7, md: 9 },
            height: { xs: 5, sm: 7, md: 9 },
            borderRadius: '50%',
            bgcolor: '#4caf50',
            m: { xs: 1, sm: 1.25, md: 1.75 }
          }}
        />
      )}
      
      <Box 
        sx={{ 
          p: { xs: 0.5, sm: 0.75, md: 1 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
            p: 1.5
          }
        }}
      >
        <Typography 
          sx={{ 
            fontSize: { 
              xs: '0.8rem',
              sm: '1rem',
              md: '1.2rem',
              lg: '1.4rem'
            },
            '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
              fontSize: '1.6rem',
              mb: 1
            },
            mb: { xs: 0.25, sm: 0.5, md: 0.75 },
            fontWeight: 600
          }}
        >
          {name}
        </Typography>
        <Typography 
          variant="h1"
          sx={{ 
            fontSize: {
              xs: '3.6rem',
              sm: '5.4rem',
              md: '7.2rem',
              lg: '9rem'
            },
            '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
              fontSize: '8rem !important'
            },
            fontWeight: 700,
            lineHeight: 0.75,
            mb: { xs: 0.25, sm: 0.5, md: 0.75 }
          }}
        >
          {score}
        </Typography>
        <Box 
          sx={{ 
            height: {
              xs: '1rem',
              sm: '1.25rem',
              md: '1.5rem',
              lg: '1.75rem'
            },
            '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
              height: '2rem',
              mt: 1.5
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            mt: { xs: 0.5, sm: 0.75, md: 1 }
          }}
        >
          {children}
        </Box>
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: { xs: 0.25, sm: 0.5, md: 0.75 },
          mb: { xs: 0.25, sm: 0.5, md: 0.75 },
          py: { xs: 0.5, sm: 0.75, md: 1 },
          '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
            mt: 0.5,
            mb: 0.5,
            py: 0.75
          },
          borderTop: '1px solid rgba(255,255,255,0.15)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: 'rgba(255,255,255,0.02)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <Typography 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontSize: {
                xs: '0.6rem',
                sm: '0.7rem',
                md: '0.8rem',
                lg: '0.9rem'
              },
              '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '0.8rem',
                mb: 0.25
              },
              fontWeight: 600,
              mb: { xs: 0.15, sm: 0.25, md: 0.35 },
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Set
          </Typography>
          <Typography 
            sx={{ 
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.4rem',
                lg: '1.6rem'
              },
              '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.2rem'
              },
              fontWeight: 700,
              color: '#4caf50',
              textShadow: '0 0 10px rgba(76, 175, 80, 0.3)',
              lineHeight: 1
            }}
          >
            {setsWon}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            width: '1px', 
            bgcolor: 'rgba(255,255,255,0.15)',
            mx: { xs: 0.25, sm: 0.5, md: 0.75 },
            '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
              mx: 1.5
            }
          }} 
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <Typography 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontSize: {
                xs: '0.6rem',
                sm: '0.7rem',
                md: '0.8rem',
                lg: '0.9rem'
              },
              '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '0.8rem',
                mb: 0.25
              },
              fontWeight: 600,
              mb: { xs: 0.15, sm: 0.25, md: 0.35 },
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Leg
          </Typography>
          <Typography 
            sx={{ 
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.4rem',
                lg: '1.6rem'
              },
              '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.2rem'
              },
              fontWeight: 700,
              color: '#4caf50',
              textShadow: '0 0 10px rgba(76, 175, 80, 0.3)',
              lineHeight: 1
            }}
          >
            {legsWon}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 1.8, sm: 2.7, md: 3.6 }, flex: 1 }}>
        <Box sx={{ mb: { xs: 0.9, sm: 1.8, md: 2.7 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.45 }}>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '0.9rem'
              }
            }}>Darts:</Typography>
            <Typography sx={{ 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.4rem'
              }
            }}>{dartsThrown}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.45 }}>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.4rem'
              }
            }}>Checkout:</Typography>
            <Typography sx={{ 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.4rem'
              }
            }}>
              {successfulCheckouts}/{doubleAttempts} - {checkoutPercentage.toFixed(2)}%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: { xs: 0.9, sm: 1.8, md: 2.7 },
          '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
            mb: 0.9
          }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.45,
            '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
              mb: 0.15
            }
          }}>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.1rem'
              }
            }}>Game:</Typography>
            <Typography sx={{ 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.4rem'
              }
            }}>{average.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.45 }}>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.4rem'
              }
            }}>Set:</Typography>
            <Typography sx={{ 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.4rem'
              }
            }}>{setAverage.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.4rem'
              }
            }}>Leg:</Typography>
            <Typography sx={{ 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.4rem'
              }
            }}>{legAverage.toFixed(2)}</Typography>
          </Box>
        </Box>

        <Box 
          sx={{ 
            mt: 'auto',
            py: { xs: 0.9, sm: 1.35, md: 1.8 },
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.8, sm: 2.7, md: 3.6 },
            '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
              mb: 1.35
            }
          }}
        >
          <Typography sx={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: {
              xs: '0.8rem',
              sm: '0.9rem',
              md: '1.15rem',
              lg: '1.35rem'
            },
            '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
              fontSize: '1.1rem'
            }
          }}>Last score:</Typography>
          <Typography sx={{ 
            fontSize: {
              xs: '0.8rem',
              sm: '0.9rem',
              md: '1.15rem',
              lg: '1.35rem'
            },
            '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
              fontSize: '1.4rem'
            }
          }}>{latestScore}</Typography>
          {checkoutThrows > 0 && (
            <Typography sx={{ 
              ml: 'auto', 
              color: '#4caf50', 
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1.15rem',
                lg: '1.35rem'
              },
              '@media (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)': {
                fontSize: '1.4rem'
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

const PlayerStats = React.memo(PlayerStatsComponent);

PlayerStats.displayName = 'PlayerStats';

export default PlayerStats; 