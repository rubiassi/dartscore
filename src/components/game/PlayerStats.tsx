import React, { memo, useMemo } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PlayerType } from '../../types/game';

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
  playerType?: PlayerType;
  avatar?: string;
  children?: React.ReactNode;
  onUpdateScore?: (score: number, dartsUsed?: number, doublesAttempted?: number) => void;
  showCheckout?: boolean;
  useDoubles?: boolean;
}

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  position: 'relative',
  borderRight: `1px solid ${theme.palette.divider}`,
  overflow: 'auto'
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center'
}));

const StyledStats = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

const StyledStatRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const scoreStyles = {
  fontSize: {
    xs: '3.6rem',
    sm: '5.4rem',
    md: '7.2rem',
    lg: '9rem'
  },
  fontWeight: 700,
  lineHeight: 0.75,
  mb: 1
};

const PlayerStats = memo<PlayerStatsProps>(({
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
  playerType = 'guest',
  avatar,
  children,
  onUpdateScore,
  showCheckout = true,
  useDoubles = true
}) => {
  const stats = useMemo(() => ({
    latestScore: lastThrows.length > 0 ? lastThrows[0] || '-' : '-',
    averagePerDart: dartsThrown > 0 ? (score / dartsThrown).toFixed(2) : '0.00',
    checkoutSuccess: doubleAttempts > 0 ? ((successfulCheckouts / doubleAttempts) * 100).toFixed(2) : '0.00'
  }), [lastThrows, score, dartsThrown, successfulCheckouts, doubleAttempts]);

  return (
    <StyledContainer
      sx={{
        opacity: isActive ? 1 : 0.7,
        transition: 'opacity 0.3s ease'
      }}
    >
      {isActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'success.main'
          }}
        />
      )}

      <StyledHeader>
        <Avatar 
          src={avatar}
          sx={{ mb: 1, width: 48, height: 48 }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {name}
        </Typography>
        <Typography variant="h1" sx={scoreStyles}>
          {score}
        </Typography>
        {children}
      </StyledHeader>

      <StyledStats>
        <Box>
          <StyledStatRow>
            <Typography color="text.secondary">Darts:</Typography>
            <Typography>{dartsThrown}</Typography>
          </StyledStatRow>
          <StyledStatRow>
            <Typography color="text.secondary">Avg/Dart:</Typography>
            <Typography>{stats.averagePerDart}</Typography>
          </StyledStatRow>
          <StyledStatRow>
            <Typography color="text.secondary">Checkout:</Typography>
            <Typography>
              {successfulCheckouts}/{doubleAttempts} - {stats.checkoutSuccess}%
            </Typography>
          </StyledStatRow>
        </Box>

        <Box>
          <StyledStatRow>
            <Typography color="text.secondary">Game:</Typography>
            <Typography>{average.toFixed(2)}</Typography>
          </StyledStatRow>
          <StyledStatRow>
            <Typography color="text.secondary">Set:</Typography>
            <Typography>{setAverage.toFixed(2)}</Typography>
          </StyledStatRow>
          <StyledStatRow>
            <Typography color="text.secondary">Leg:</Typography>
            <Typography>{legAverage.toFixed(2)}</Typography>
          </StyledStatRow>
        </Box>

        <Box>
          <StyledStatRow>
            <Typography color="text.secondary">Sets:</Typography>
            <Typography color="success.main">{setsWon}</Typography>
          </StyledStatRow>
          <StyledStatRow>
            <Typography color="text.secondary">Legs:</Typography>
            <Typography color="success.main">{legsWon}</Typography>
          </StyledStatRow>
          <StyledStatRow>
            <Typography color="text.secondary">9-Dart Avg:</Typography>
            <Typography>{ninedartsAvg.toFixed(2)}</Typography>
          </StyledStatRow>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <StyledStatRow>
            <Typography color="text.secondary">Last score:</Typography>
            <Typography>{stats.latestScore}</Typography>
            {checkoutThrows > 0 && (
              <Typography color="success.main" sx={{ ml: 'auto' }}>
                {checkoutThrows} darts
              </Typography>
            )}
          </StyledStatRow>
        </Box>
      </StyledStats>
    </StyledContainer>
  );
});

PlayerStats.displayName = 'PlayerStats';

export default PlayerStats; 