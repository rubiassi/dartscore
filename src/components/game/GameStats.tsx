import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import GameStatistics from '../../utils/GameStatistics';

interface PlayerStats {
  averages: {
    overall: number;
    set: number;
    leg: number;
    firstNine: number;
  };
  checkouts: {
    percentage: number;
    successful: number;
    attempts: number;
  };
  legsWon: {
    nine: number;
    tenToTwelve: number;
    thirteenToFifteen: number;
    sixteenToTwenty: number;
    twentyOneToTwentyFive: number;
    twentySixToThirty: number;
    thirtyPlus: number;
  };
  scoring: {
    oneEighty: number;
    oneFortyPlus: number;
    oneHundredPlus: number;
    sixtyPlus: number;
    fortyPlus: number;
    twentyPlus: number;
    oneToTwenty: number;
  };
  gameData: any;
}

interface GameStatsProps {
  player1: {
    name: string;
    stats: PlayerStats;
  };
  player2: {
    name: string;
    stats: PlayerStats;
  };
}

const StatsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  color: theme.palette.text.primary,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 20,
  left: 0,
  right: 0,
  bottom: 0,
  paddingTop: theme.spacing(8),
  overflowY: 'auto',
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.standard,
  })
}));

const StatsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
  padding: `${theme.spacing(1)} 0`,
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const StatValue = styled(Typography)(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  padding: `0 ${theme.spacing(3)}`,
  transition: theme.transitions.create(['color'], {
    duration: theme.transitions.duration.short,
  })
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(['background-color', 'border-color'], {
    duration: theme.transitions.duration.standard,
  })
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  textAlign: 'center',
  textTransform: 'uppercase',
  fontSize: '0.9rem',
  letterSpacing: 1,
  fontWeight: 600
}));

const PlayerHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  padding: `0 ${theme.spacing(2)}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(1),
  transition: theme.transitions.create(['border-color'], {
    duration: theme.transitions.duration.standard,
  })
}));

const PlayerName = styled(Typography)(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  fontWeight: 600,
  color: theme.palette.primary.main
}));

const StatRow: React.FC<{ 
  label: string;
  player1Value: string | number;
  player2Value: string | number;
}> = ({ label, player1Value, player2Value }) => (
  <StatsRow>
    <StatValue>{player1Value}</StatValue>
    <StatLabel>{label}</StatLabel>
    <StatValue>{player2Value}</StatValue>
  </StatsRow>
);

const SectionTitleComponent: React.FC<{ title: string }> = ({ title }) => (
  <SectionHeader>
    <SectionTitle>{title}</SectionTitle>
  </SectionHeader>
);

const PlayerHeader: React.FC<{ 
  player1Name: string;
  player2Name: string;
}> = ({ player1Name, player2Name }) => (
  <PlayerHeaderContainer>
    <PlayerName>{player1Name}</PlayerName>
    <Box sx={{ flex: 1 }} />
    <PlayerName>{player2Name}</PlayerName>
  </PlayerHeaderContainer>
);

const GameStats: React.FC<GameStatsProps> = ({
  player1,
  player2
}) => {
  return (
    <StatsContainer>
      <PlayerHeader player1Name={player1.name} player2Name={player2.name} />

      {/* General Section */}
      <SectionTitleComponent title="General" />
      <StatRow 
        label="average" 
        player1Value={player1.stats.averages.overall.toFixed(2)}
        player2Value={player2.stats.averages.overall.toFixed(2)}
      />
      <StatRow 
        label="set average" 
        player1Value={player1.stats.averages.set.toFixed(2)}
        player2Value={player2.stats.averages.set.toFixed(2)}
      />
      <StatRow 
        label="leg average" 
        player1Value={player1.stats.averages.leg.toFixed(2)}
        player2Value={player2.stats.averages.leg.toFixed(2)}
      />
      <StatRow 
        label="first 9 average" 
        player1Value={player1.stats.averages.firstNine.toFixed(2)}
        player2Value={player2.stats.averages.firstNine.toFixed(2)}
      />
      <StatRow 
        label="darts thrown" 
        player1Value={player1.stats.checkouts.attempts}
        player2Value={player2.stats.checkouts.attempts}
      />
      <StatRow 
        label="highest finish" 
        player1Value={player1.stats.scoring.oneEighty}
        player2Value={player2.stats.scoring.oneEighty}
      />

      {/* Checkout Section */}
      <SectionTitleComponent title="Checkout" />
      <StatRow 
        label="percentage" 
        player1Value={`${player1.stats.checkouts.percentage.toFixed(2)}%`}
        player2Value={`${player2.stats.checkouts.percentage.toFixed(2)}%`}
      />
      <StatRow 
        label="darts" 
        player1Value={`${player1.stats.checkouts.successful}/${player1.stats.checkouts.attempts}`}
        player2Value={`${player2.stats.checkouts.successful}/${player2.stats.checkouts.attempts}`}
      />

      {/* Total Darts og Highest Finish Section */}
      <SectionTitleComponent title="Game Stats" />
      <StatRow 
        label="Total Darts" 
        player1Value={GameStatistics.calculateTotalDartsThrown(player1.stats.gameData)}
        player2Value={GameStatistics.calculateTotalDartsThrown(player2.stats.gameData)}
      />
      <StatRow 
        label="Highest Finish" 
        player1Value={GameStatistics.calculateHighestFinish(player1.stats.gameData)}
        player2Value={GameStatistics.calculateHighestFinish(player2.stats.gameData)}
      />

      {/* Legs Won Section */}
      <SectionTitleComponent title="Leg won in darts" />
      <StatRow 
        label="9 darts" 
        player1Value={player1.stats.legsWon.nine}
        player2Value={player2.stats.legsWon.nine}
      />
      <StatRow 
        label="10 - 12 darts" 
        player1Value={player1.stats.legsWon.tenToTwelve}
        player2Value={player2.stats.legsWon.tenToTwelve}
      />
      <StatRow 
        label="13 - 15 darts" 
        player1Value={player1.stats.legsWon.thirteenToFifteen}
        player2Value={player2.stats.legsWon.thirteenToFifteen}
      />
      <StatRow 
        label="16 - 20 darts" 
        player1Value={player1.stats.legsWon.sixteenToTwenty}
        player2Value={player2.stats.legsWon.sixteenToTwenty}
      />
      <StatRow 
        label="21 - 25 darts" 
        player1Value={player1.stats.legsWon.twentyOneToTwentyFive}
        player2Value={player2.stats.legsWon.twentyOneToTwentyFive}
      />
      <StatRow 
        label="26 - 30 darts" 
        player1Value={player1.stats.legsWon.twentySixToThirty}
        player2Value={player2.stats.legsWon.twentySixToThirty}
      />
      <StatRow 
        label="30+ darts" 
        player1Value={player1.stats.legsWon.thirtyPlus}
        player2Value={player2.stats.legsWon.thirtyPlus}
      />

      {/* Scores Section */}
      <SectionTitleComponent title="Scores" />
      <StatRow 
        label="180's" 
        player1Value={player1.stats.scoring.oneEighty}
        player2Value={player2.stats.scoring.oneEighty}
      />
      <StatRow 
        label="140+" 
        player1Value={player1.stats.scoring.oneFortyPlus}
        player2Value={player2.stats.scoring.oneFortyPlus}
      />
      <StatRow 
        label="100+" 
        player1Value={player1.stats.scoring.oneHundredPlus}
        player2Value={player2.stats.scoring.oneHundredPlus}
      />
      <StatRow 
        label="60+" 
        player1Value={player1.stats.scoring.sixtyPlus}
        player2Value={player2.stats.scoring.sixtyPlus}
      />
      <StatRow 
        label="40+" 
        player1Value={player1.stats.scoring.fortyPlus}
        player2Value={player2.stats.scoring.fortyPlus}
      />
      <StatRow 
        label="20+" 
        player1Value={player1.stats.scoring.twentyPlus}
        player2Value={player2.stats.scoring.twentyPlus}
      />
      <StatRow 
        label="1 - 20" 
        player1Value={player1.stats.scoring.oneToTwenty}
        player2Value={player2.stats.scoring.oneToTwenty}
      />
    </StatsContainer>
  );
};

export default GameStats; 