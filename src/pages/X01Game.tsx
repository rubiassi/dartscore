import React, { useEffect, useMemo } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import ScoreInput from '../components/game/ScoreInput';
import CheckoutValidator from '../utils/CheckoutValidator';
import { GameConfig, Player } from '../types/game';
import { ThrowHistory } from '../types/statistics';
import GameStats from '../components/game/GameStats';
import PlayerStats from '../components/game/PlayerStats';
import { useGameState } from '../hooks/useGameState';
import { useGameStats } from '../hooks/useGameStats';

// Styled components
const GameContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  maxHeight: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.standard
  }),
  [theme.breakpoints.between('sm', 'md')]: {
    height: '100%',
    '& > div': {
      minHeight: 0
    }
  },
  '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
    flexDirection: 'column',
    '& > div': {
      minHeight: 0
    }
  }
}));

const PlayerSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  flex: 1,
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  backgroundColor: isActive 
    ? theme.palette.background.paper 
    : theme.palette.background.default,
  color: isActive 
    ? theme.palette.text.primary 
    : theme.palette.text.secondary,
  borderRight: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  transition: theme.transitions.create(
    ['background-color', 'color', 'border-color', 'box-shadow', 'transform'],
    { duration: theme.transitions.duration.standard }
  ),
  '&:last-child': {
    borderRight: 'none',
  },
  '&:hover': {
    backgroundColor: isActive 
      ? theme.palette.background.paper 
      : theme.palette.action.hover,
  },
  '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
    borderRight: 'none',
    transform: isActive ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isActive ? theme.shadows[8] : theme.shadows[2],
    '& > div': {
      padding: theme.spacing(2),
      '& h1': {
        fontSize: '4rem',
        lineHeight: 1,
        marginBottom: theme.spacing(1)
      }
    }
  }
}));

const ScoreArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '50%',
  minHeight: 0,
  maxHeight: '50vh',
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  overflow: 'hidden',
  '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
    height: '60%',
    maxHeight: '60vh',
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexDirection: 'row',
    padding: theme.spacing(1),
    gap: theme.spacing(1),
    '& > div': {
      flex: 1,
      minHeight: 0,
      width: '50%',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2]
    }
  }
}));

const InputArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
  justifyContent: 'flex-end',
  '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': {
    height: '40%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0
  }
}));

const StyledCheckoutText = styled(Typography)`
  color: #4caf50;
  font-weight: 700;
  text-align: center;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(0.25)};
  padding: ${({ theme }) => theme.spacing(0.25)};
  background-color: ${({ theme }) => theme.palette.action.hover};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  font-size: ${({ theme }) => ({
    [theme.breakpoints.down('sm')]: '0.75rem',
    [theme.breakpoints.between('sm', 'md')]: '0.7rem',
    [theme.breakpoints.between('md', 'lg')]: '0.9rem',
    [theme.breakpoints.up('lg')]: '1rem',
    '@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)': '1.1rem'
  })};
  transition: ${({ theme }) => theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.standard,
  })};
  &:hover {
    background-color: ${({ theme }) => theme.palette.action.selected};
    transform: scale(1.02);
  }
`;

const NoStatsMessage = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2),
  boxShadow: theme.shadows[2]
}));

const X01Game: React.FC = () => {
  const location = useLocation();
  const gameConfig = location.state as GameConfig;
  const players = gameConfig?.players?.filter(Boolean) || [];
  const { showingStats } = useGame();

  const [gameState, dispatch] = useGameState(gameConfig);
  const { currentPlayerIndex, scores, lastThrows, currentLegDarts, currentLegAverage, checkoutGuide } = gameState;

  // Individuelle stats hooks for hver spiller - kaldes ubetinget
  const player1Stats = useGameStats(gameState.playerGameData[players[0]?.id || '']);
  const player2Stats = useGameStats(gameState.playerGameData[players[1]?.id || '']);

  // Beregn stats for alle spillere med null-check i memo
  const playerStats = useMemo(() => {
    const stats: { [key: string]: ReturnType<typeof useGameStats> } = {};
    
    // Kun tilføj stats hvis spilleren eksisterer
    if (players[0]?.id) {
      stats[players[0].id] = player1Stats;
    }
    if (players[1]?.id) {
      stats[players[1].id] = player2Stats;
    }
    
    return stats;
  }, [players, player1Stats, player2Stats]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // Hjælpefunktioner til sikker spillerhåndtering
  const getPlayerById = (id: string) => players.find(player => player?.id === id);
  const getCurrentPlayer = () => players.find((_, index) => index === currentPlayerIndex);

  // Opdater checkout guide når aktiv spiller ændres
  useEffect(() => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer?.id) return;

    const currentScore = scores[currentPlayer.id];
    
    if (gameConfig.useDoubles && currentScore <= 170) {
      const checkoutInfo = CheckoutValidator.checkPossibleDoubleAttempt(currentScore, 0);
      if (checkoutInfo.possibleDoubleAttempt && checkoutInfo.checkoutRoute) {
        dispatch({
          type: 'SET_CHECKOUT_GUIDE',
          guide: {
          score: currentScore,
          combinations: [checkoutInfo.checkoutRoute]
          }
        });
      } else {
        dispatch({ type: 'SET_CHECKOUT_GUIDE', guide: null });
      }
    } else {
      dispatch({ type: 'SET_CHECKOUT_GUIDE', guide: null });
    }
  }, [currentPlayerIndex, scores, gameConfig.useDoubles]);

  // Håndter score input
  const handleScore = (score: number, dartsUsed: number = 3, doublesAttempted: number = 0) => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    const currentScore = scores[currentPlayer.id];
    const newScore = currentScore - score;

    // Opdater throw historik
    const throwData: ThrowHistory = {
      score,
      dartsUsed,
      doublesAttempted,
      isCheckout: newScore === 0
    };
    dispatch({ type: 'ADD_THROW', playerId: currentPlayer.id, throwData });

    // Opdater score
    dispatch({ type: 'UPDATE_SCORE', playerId: currentPlayer.id, score: newScore });

    // Hvis det er en checkout (newScore === 0)
    if (newScore === 0) {
      // Opdater legs won for spilleren
      dispatch({ 
        type: 'ADD_LEG_WIN', 
        playerId: currentPlayer.id,
        darts: dartsUsed
      });
      
      // Tjek om sættet er vundet
      if (shouldUpdateSet()) {
        dispatch({ type: 'ADD_SET_WIN', playerId: currentPlayer.id });
      }
      
      // Reset scores for alle spillere til ny leg
      players.forEach(player => {
        if (player?.id) {
          dispatch({ type: 'UPDATE_SCORE', playerId: player.id, score: gameConfig.startingScore });
        }
      });

      // Find næste startspiller for den nye leg
      // Hvis der ikke er random start, så tag næste spiller i rækken
      if (!gameConfig.randomStart) {
        const nextStarterIndex = (currentPlayerIndex + 1) % players.length;
        dispatch({ 
          type: 'SET_CURRENT_PLAYER',
          index: nextStarterIndex
        });
      } else {
        // Hvis random start er aktiveret, vælg en tilfældig spiller
        const randomIndex = Math.floor(Math.random() * players.length);
        dispatch({ 
          type: 'SET_CURRENT_PLAYER',
          index: randomIndex
        });
      }
    } else {
      // Skift spiller hvis ikke checkout
      dispatch({ 
        type: 'SET_CURRENT_PLAYER',
        index: currentPlayerIndex === players.length - 1 ? 0 : currentPlayerIndex + 1
      });
    }
  };

  // Tjek om et set er vundet
  const shouldUpdateSet = () => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer?.id) return false;
    
    const playerData = gameState.playerGameData[currentPlayer.id];
    if (!playerData) return false;
    
    const playerLegsWon = playerData.legsWon.length;
    return playerLegsWon > 0 && playerLegsWon % gameConfig.legsPerSet === 0;
  };

  // Render game content
  const renderGameContent = () => {
    if (showingStats && players.length >= 2) {
      const player1 = players[0];
      const player2 = players[1];
      
      if (player1?.id && player2?.id) {
          return (
            <GameStats 
              player1={{
                name: player1.name,
              stats: { ...playerStats[player1.id], gameData: gameState.playerGameData[player1.id] }
              }}
              player2={{
                name: player2.name,
              stats: { ...playerStats[player2.id], gameData: gameState.playerGameData[player2.id] }
              }}
            />
          );
      }
      
      return (
        <NoStatsMessage>
          <Typography variant="h6" color="text.secondary">
            Utilstrækkelige spillerdata til at vise statistik
          </Typography>
        </NoStatsMessage>
      );
    }

    const validPlayers = players.filter(player => player?.id);
    
    return (
      <GameContainer>
        <ScoreArea>
          {validPlayers.map((player, index) => {
            if (!player?.id) return null;

            const stats = playerStats[player.id];
            const playerScore = scores[player.id] ?? gameConfig.startingScore;
            const playerLastThrows = lastThrows[player.id] ?? [];
            const playerCurrentLegAverage = currentLegAverage[player.id] ?? 0;
            const playerSetsWon = gameState.playerGameData[player.id].setsWon ?? 0;
            const playerLegsWon = gameState.playerGameData[player.id].legsWon.length ?? 0;
            const playerCurrentLegDarts = currentLegDarts[player.id] ?? 0;
            
            return (
              <PlayerSection
                key={player.id}
                isActive={index === currentPlayerIndex}
              >
                <PlayerStats
                  name={player.name}
                  score={playerScore}
                  isActive={index === currentPlayerIndex}
                  average={stats.averages.overall}
                  setAverage={stats.averages.set}
                  legAverage={playerCurrentLegAverage}
                  lastThrows={playerLastThrows}
                  roundScore={0}
                  ninedartsAvg={stats.averages.firstNine}
                  checkoutPercentage={stats.checkouts.percentage}
                  setsWon={playerSetsWon}
                  legsWon={playerLegsWon}
                  dartsThrown={playerCurrentLegDarts}
                  doubleAttempts={stats.checkouts.attempts}
                  checkoutThrows={0}
                  successfulCheckouts={stats.checkouts.successful}
                  onUpdateScore={handleScore}
                >
                  {gameConfig.useDoubles && playerScore <= 170 && playerScore >= 2 ? (
                    <StyledCheckoutText>
                      {CheckoutValidator.getCheckoutRoute(playerScore)}
                    </StyledCheckoutText>
                  ) : null}
                </PlayerStats>
              </PlayerSection>
            );
          })}
        </ScoreArea>

        <InputArea>
          {validPlayers[currentPlayerIndex] && (
            <ScoreInput
              currentPlayer={validPlayers[currentPlayerIndex]}
              currentScore={scores[validPlayers[currentPlayerIndex].id] ?? gameConfig.startingScore}
              onScore={handleScore}
              gameConfig={gameConfig}
            />
          )}
        </InputArea>
      </GameContainer>
    );
  };

  return (
    <GameContainer>
      {renderGameContent()}
    </GameContainer>
  );
};

export default X01Game; 