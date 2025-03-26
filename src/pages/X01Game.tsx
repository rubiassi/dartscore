import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import ScoreInput from '../components/game/ScoreInput';
import CheckoutValidator from '../utils/CheckoutValidator';
import { GameConfig, Player } from '../types/game';
import { ThrowHistory, GameState } from '../types/statistics';
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

const WinnerDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(3),
    minWidth: '300px',
    maxWidth: '90vw',
    textAlign: 'center'
  }
}));

const WinnerTitle = styled(Typography)(({ theme }) => ({
  color: '#4caf50',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  fontSize: '1.5rem'
}));

const WinnerContent = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontSize: '1.1rem'
}));

const X01Game: React.FC = () => {
  const location = useLocation();
  const gameConfig = location.state?.gameConfig as GameConfig;
  const players = gameConfig?.players?.filter(Boolean) || [];
  const { showingStats } = useGame();
  const navigate = useNavigate();
  const [winner, setWinner] = useState<Player | null>(null);
  const hasLogged = useRef(false);

  // Sikkerhedstjek og log af kampregler
  useEffect(() => {
    if (!gameConfig) {
      navigate('/local');
      return;
    }

    // Undgå dobbelt-logging
    if (!hasLogged.current && gameConfig) {
      hasLogged.current = true;
    }
  }, [gameConfig, navigate]);

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
  const getCurrentPlayer = () => {
    const player = players[currentPlayerIndex];
    return player;
  };

  // Opdater score når spillet starter
  useEffect(() => {
    if (players.length > 0) {
      const unsetPlayers = players.filter(player => 
        player?.id && scores[player.id] === undefined
      );
      
      unsetPlayers.forEach(player => {
        if (player?.id) {
          dispatch({ 
            type: 'UPDATE_SCORE', 
            playerId: player.id, 
            score: gameConfig.startingScore 
          });
        }
      });
    }
  }, [players, scores, gameConfig.startingScore, dispatch]);

  // Tjek om et set er vundet
  const shouldUpdateSet = () => {
    // Hvis det ikke er sets format, skal vi ikke opdatere sets
    if (gameConfig.formatType !== 'sets') {
      return false;
    }

    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer?.id) return false;
    
    const playerData = gameState.playerGameData[currentPlayer.id];
    if (!playerData) return false;
    
    // Ved sets spilles der altid Best of 5 legs
    const playerLegsWon = playerData.legsWon.length;
    const legsNeededForSet = 3; // Best of 5 = først til 3
    return playerLegsWon > 0 && playerLegsWon % legsNeededForSet === 0;
  };

  // Tjek om spillet er færdigt
  const isGameFinished = (updatedState?: GameState) => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer?.id) {
      return false;
    }
    
    // Brug enten det opdaterede state eller det nuværende state
    const state = updatedState || gameState;
    const playerData = state.playerGameData[currentPlayer.id];
    
    if (!playerData) {
      return false;
    }

    
    if (gameConfig.formatType === 'legs') {
      const playerLegsWon = playerData.legsWon.length;
      
      if (gameConfig.matchFormat === 'first') {
        // First to X legs
        return playerLegsWon >= gameConfig.formatCount;
      } else {
        // Best of X legs
        const legsNeeded = Math.ceil(gameConfig.formatCount / 2);
        return playerLegsWon >= legsNeeded;
      }
    } else {
      // Sets format
      const playerSetsWon = playerData.setsWon;
      
      if (gameConfig.matchFormat === 'first') {
        // First to X sets
        return playerSetsWon >= gameConfig.formatCount;
      } else {
        // Best of X sets
        const setsNeeded = Math.ceil(gameConfig.formatCount / 2);
        return playerSetsWon >= setsNeeded;
      }
    }
  };

  // Håndter score input
  const handleScore = (score: number, dartsUsed: number = 3, doublesAttempted: number = 0) => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer?.id) return;

    const currentScore = scores[currentPlayer.id];
    const newScore = currentScore - score;

    // Opdater score
    dispatch({ 
      type: 'UPDATE_SCORE', 
      playerId: currentPlayer.id, 
      score: newScore 
    });

    // Hvis det er en checkout (newScore === 0)
    if (newScore === 0) {
      
      // Opdater legs won for spilleren og tjek spilstatus i callback
      dispatch({ 
        type: 'ADD_LEG_WIN', 
        playerId: currentPlayer.id,
        darts: dartsUsed,
        callback: (updatedState) => {
          
          // Tjek om sættet er vundet baseret på opdateret data
          if (shouldUpdateSet()) {
            dispatch({ 
              type: 'ADD_SET_WIN', 
              playerId: currentPlayer.id,
              callback: (finalState) => {
                if (isGameFinished(finalState)) {
                  setWinner(currentPlayer);
                  return;
                }
                resetScoresAndNextPlayer();
              }
            });
          } else {
            if (isGameFinished(updatedState)) {
              setWinner(currentPlayer);
              return;
            }
            resetScoresAndNextPlayer();
          }
        }
      });
    } else {
      // Hvis det ikke er en checkout, gå til næste spiller
      dispatch({ type: 'NEXT_PLAYER' });
    }
  };

  // Hjælpefunktion til at resette scores og gå til næste spiller
  const resetScoresAndNextPlayer = () => {
    // Reset scores for alle spillere til ny leg
    players.forEach(player => {
      if (player?.id) {
        dispatch({ 
          type: 'UPDATE_SCORE', 
          playerId: player.id, 
          score: gameConfig.startingScore 
        });
      }
    });
    
    // Gå til næste spiller
    dispatch({ type: 'NEXT_PLAYER' });
  };

  const handleCloseWinnerDialog = () => {
    setWinner(null);
    navigate('/local');
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
      <>
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
      </>
    );
  };

  return (
    <GameContainer>
      {renderGameContent()}
      
      <WinnerDialog
        open={!!winner}
        onClose={handleCloseWinnerDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <WinnerTitle>
            🎉 Tillykke! 🎉
          </WinnerTitle>
        </DialogTitle>
        <DialogContent>
          <WinnerContent>
            {winner?.name} har vundet spillet!
          </WinnerContent>
          <Typography variant="body1" color="text.secondary">
            {gameConfig.matchFormat === 'first' 
              ? `Vandt ${gameConfig.legs} leg`
              : `Vandt ${Math.ceil((gameConfig.legs * gameConfig.sets) / 2)} ud af ${gameConfig.legs * gameConfig.sets} legs`
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleCloseWinnerDialog}
            sx={{
              bgcolor: '#4caf50',
              '&:hover': {
                bgcolor: '#388e3c'
              }
            }}
          >
            Afslut spil
          </Button>
        </DialogActions>
      </WinnerDialog>
    </GameContainer>
  );
};

export default X01Game; 