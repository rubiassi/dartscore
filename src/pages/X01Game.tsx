import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import ScoreInput from '../components/game/ScoreInput';
import CheckoutValidator from '../utils/CheckoutValidator';
import { GameConfig, Player, CheckoutGuide } from '../types/game';
import GameStats from '../components/game/GameStats';
import PlayerStats from '../components/game/PlayerStats';
import GameStatistics from '../utils/GameStatistics';

// Interface for spillerdata
interface PlayerGameData {
  throwHistory: {
    score: number;
    dartsUsed: number;
    doublesAttempted: number;
    isCheckout: boolean;
  }[];
  legsWon: number[];
  setsWon: number;
}

const X01Game: React.FC = () => {
  const location = useLocation();
  const gameConfig = location.state as GameConfig;
  const players = gameConfig.players;
  const { showingStats } = useGame();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const appBarHeight = isMobile ? 56 : 64;

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, gameConfig.startingScore]))
  );
  const [averages, setAverages] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );
  const [lastThrows, setLastThrows] = useState<{ [key: string]: number[] }>(
    Object.fromEntries(players.map(p => [p.id, []]))
  );
  const [dartsThrown, setDartsThrown] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );
  const [checkoutPercentages, setCheckoutPercentages] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );
  const [setsWon, setSetsWon] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );
  const [legsWon, setLegsWon] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );
  const [setAvg, setSetAvg] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );
  const [legAvg, setLegAvg] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );
  const [doubleAttempts, setDoubleAttempts] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );
  const [checkoutThrows, setCheckoutThrows] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );
  const [checkoutGuide, setCheckoutGuide] = useState<CheckoutGuide | null>(null);
  const [playerGameData, setPlayerGameData] = useState<{ [key: string]: PlayerGameData }>({});
  const [currentLegDarts, setCurrentLegDarts] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );
  const [currentLegAverage, setCurrentLegAverage] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );

  // Initialiser spillerdata
  useEffect(() => {
    const initialData: { [key: string]: PlayerGameData } = {};
    players.forEach(player => {
      initialData[player.id] = {
        throwHistory: [],
        legsWon: [],
        setsWon: 0
      };
    });
    setPlayerGameData(initialData);
  }, []);

  // Opdater spillerdata når der scores
  const updatePlayerGameData = (
    playerId: string, 
    score: number, 
    dartsUsed: number, 
    doublesAttempted: number,
    isCheckout: boolean
  ) => {
    setPlayerGameData(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        throwHistory: [
          ...prev[playerId].throwHistory,
          { score, dartsUsed, doublesAttempted, isCheckout }
        ]
      }
    }));
  };

  // Opdater når en leg vindes
  const updateLegsWon = (playerId: string, dartsUsed: number) => {
    // Opdater playerGameData
    setPlayerGameData(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        legsWon: [...prev[playerId].legsWon, dartsUsed]
      }
    }));

    // Opdater legsWon state
    setLegsWon(prev => ({
      ...prev,
      [playerId]: prev[playerId] + 1
    }));

    // Opdater leg gennemsnit
    const gameData = playerGameData[playerId];
    if (gameData) {
      const currentLeg = gameData.throwHistory.slice(
        gameData.throwHistory.findIndex(t => t.isCheckout) + 1
      );
      const newLegAvg = GameStatistics.calculateLegAverage(gameData, currentLeg);
      setLegAvg(prev => ({
        ...prev,
        [playerId]: newLegAvg
      }));
    }
  };

  // Opdater når et set vindes
  const updateSetsWon = (playerId: string) => {
    // Opdater playerGameData
    setPlayerGameData(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        setsWon: prev[playerId].setsWon + 1
      }
    }));

    // Opdater setsWon state
    setSetsWon(prev => ({
      ...prev,
      [playerId]: prev[playerId] + 1
    }));

    // Opdater set gennemsnit
    const gameData = playerGameData[playerId];
    if (gameData) {
      const currentSet = gameData.throwHistory.slice(
        gameData.throwHistory.findIndex(t => t.isCheckout && gameData.setsWon > 0) + 1
      );
      const newSetAvg = GameStatistics.calculateSetAverage(gameData, currentSet);
      setSetAvg(prev => ({
        ...prev,
        [playerId]: newSetAvg
      }));
    }
  };

  // Tjek om et set er vundet
  const shouldUpdateSet = () => {
    const currentPlayer = players[currentPlayerIndex];
    const playerLegsWon = playerGameData[currentPlayer.id].legsWon.length;
    return playerLegsWon > 0 && playerLegsWon % gameConfig.legsPerSet === 0;
  };

  // Nulstil spillet for en ny leg
  const resetLeg = () => {
    // Nulstil scores til startingScore
    setScores(Object.fromEntries(players.map(p => [p.id, gameConfig.startingScore])));
    
    // Nulstil leg-specifikke statistikker
    setLastThrows(Object.fromEntries(players.map(p => [p.id, []])));
    setCheckoutThrows(Object.fromEntries(players.map(p => [p.id, 0])));
    setCurrentLegDarts(Object.fromEntries(players.map(p => [p.id, 0])));
    setCurrentLegAverage(Object.fromEntries(players.map(p => [p.id, 0])));
    
    // Opdater checkout procentdel for alle spillere
    players.forEach(player => {
      const gameData = playerGameData[player.id];
      if (gameData) {
        const checkoutPercentage = GameStatistics.calculateCheckoutPercentage(gameData);
        setCheckoutPercentages(prev => ({
          ...prev,
          [player.id]: checkoutPercentage
        }));
      }
    });
  };

  const handleScore = (score: number, dartsUsed: number = 3, doublesAttempted: number = 0) => {
    const currentPlayer = players[currentPlayerIndex];
    const currentScore = scores[currentPlayer.id];
    const isCheckout = currentScore - score === 0;
    
    // Håndtér 0-score (bust eller miss)
    if (score === 0) {
      if (gameConfig.useDoubles) {
        setDoubleAttempts(prev => ({
          ...prev,
          [currentPlayer.id]: prev[currentPlayer.id] + doublesAttempted
        }));
      }
      setCurrentPlayerIndex((current) => 
        current === players.length - 1 ? 0 : current + 1
      );
      return;
    }

    const newScore = currentScore - score;

    // Tjek for mulig checkout
    if (newScore === 0) {
      if (gameConfig.useDoubles && doublesAttempted === 0) {
        // Ugyldig checkout (ikke double)
        setDoubleAttempts(prev => ({
          ...prev,
          [currentPlayer.id]: prev[currentPlayer.id] + 1
        }));
        setCurrentPlayerIndex((current) => 
          current === players.length - 1 ? 0 : current + 1
        );
        return;
      }
    } else if (newScore < 0 || (gameConfig.useDoubles && newScore === 1)) {
      // Bust - score er for høj eller efterlader 1 (ugyldig checkout når useDoubles er aktiv)
      setCurrentPlayerIndex((current) => 
        current === players.length - 1 ? 0 : current + 1
      );
      return;
    }

    // Opdater spillerdata
    updatePlayerGameData(
      currentPlayer.id,
      score,
      dartsUsed,
      doublesAttempted,
      isCheckout
    );

    if (isCheckout) {
      // Opdater current leg darts med det sidste kast først
      const finalLegDarts = currentLegDarts[currentPlayer.id] + dartsUsed;
      
      // Opdater darts thrown før vi opdaterer legs/sets
      setDartsThrown(prev => ({
        ...prev,
        [currentPlayer.id]: prev[currentPlayer.id] + dartsUsed
      }));

      // Opdater current leg darts
      setCurrentLegDarts(prev => ({
        ...prev,
        [currentPlayer.id]: finalLegDarts
      }));

      // Opdater legs/sets vundet med det totale antal darts brugt i leggen
      updateLegsWon(currentPlayer.id, finalLegDarts);
      
      // Check om set er vundet og opdater
      if (shouldUpdateSet()) {
        updateSetsWon(currentPlayer.id);
      }
      
      // Nulstil spillet for ny leg
      resetLeg();
      
      // Gå til næste spiller for den nye leg
      setCurrentPlayerIndex((current) => 
        current === players.length - 1 ? 0 : current + 1
      );
      return;
    }

    // Normal score opdatering
    applyScore(score, dartsUsed, doublesAttempted, newScore);
  };

  const applyScore = (score: number, dartsUsed: number, doublesAttempted: number, newScore: number) => {
    const currentPlayer = players[currentPlayerIndex];
  
    // Opdater score
    setScores(prev => ({
      ...prev,
      [currentPlayer.id]: newScore
    }));

    // Opdater statistik
    setLastThrows(prev => ({
      ...prev,
      [currentPlayer.id]: [score, ...(prev[currentPlayer.id] || [])].slice(0, 3)
    }));

    // Opdater total darts thrown
    setDartsThrown(prev => ({
      ...prev,
      [currentPlayer.id]: prev[currentPlayer.id] + dartsUsed
    }));

    // Opdater current leg darts
    setCurrentLegDarts(prev => ({
      ...prev,
      [currentPlayer.id]: prev[currentPlayer.id] + dartsUsed
    }));

    // Beregn nyt leg gennemsnit
    const currentLegThrows = lastThrows[currentPlayer.id];
    const newLegThrows = [score, ...currentLegThrows];
    const legAverage = (newLegThrows.reduce((a, b) => a + b, 0) / newLegThrows.length) * (3 / dartsUsed);
    
    setCurrentLegAverage(prev => ({
      ...prev,
      [currentPlayer.id]: legAverage
    }));

    // Hvis det er en checkout, opdater checkout statistik
    if (newScore === 0) {
      setCheckoutThrows(prev => ({
        ...prev,
        [currentPlayer.id]: dartsUsed
      }));
      
      // Opdater double forsøg
      setDoubleAttempts(prev => ({
        ...prev,
        [currentPlayer.id]: prev[currentPlayer.id] + doublesAttempted
      }));
      
      // Opdater checkout procentdel med GameStatistics
      const gameData = playerGameData[currentPlayer.id];
      if (gameData) {
        const checkoutPercentage = GameStatistics.calculateCheckoutPercentage(gameData);
        setCheckoutPercentages(prev => ({
          ...prev,
          [currentPlayer.id]: checkoutPercentage
        }));
      }
    } else if (doublesAttempted > 0) {
      // Opdater double forsøg selv når det ikke er checkout
      setDoubleAttempts(prev => ({
        ...prev,
        [currentPlayer.id]: prev[currentPlayer.id] + doublesAttempted
      }));
    }

    // Beregn nyt gennemsnit
    const throws = lastThrows[currentPlayer.id];
    const newThrows = [score, ...throws];
    const average = (newThrows.reduce((a, b) => a + b, 0) / newThrows.length) * (3 / dartsUsed);
    
    setAverages(prev => ({
      ...prev,
      [currentPlayer.id]: average
    }));

    // Gå til næste spiller
    setCurrentPlayerIndex((current) => 
      current === players.length - 1 ? 0 : current + 1
    );
  };

  // Opdater checkout guide når spillerens score ændres
  useEffect(() => {
    const currentPlayer = players[currentPlayerIndex];
    const currentScore = scores[currentPlayer.id];
    
    if (gameConfig.useDoubles && currentScore <= 170) {
      const checkoutInfo = CheckoutValidator.checkPossibleDoubleAttempt(currentScore, 0);
      if (checkoutInfo.possibleDoubleAttempt && checkoutInfo.checkoutRoute) {
        setCheckoutGuide({
          score: currentScore,
          combinations: [checkoutInfo.checkoutRoute]
        });
      } else {
        setCheckoutGuide(null);
      }
    } else {
      setCheckoutGuide(null);
    }
  }, [currentPlayerIndex, scores, gameConfig.useDoubles, players]);

  // Beregn statistikker for den aktuelle spiller
  const calculatePlayerStats = (playerId: string) => {
    const gameData = playerGameData[playerId];
    if (!gameData) return null;

    // Find aktuel leg og set
    const currentLeg = gameData.throwHistory.slice(
      gameData.throwHistory.findIndex(t => t.isCheckout) + 1
    );
    const currentSet = gameData.throwHistory.slice(
      gameData.throwHistory.findIndex(t => t.isCheckout && gameData.setsWon > 0) + 1
    );

    return {
      averages: {
        overall: GameStatistics.calculateOverallAverage(gameData),
        leg: GameStatistics.calculateLegAverage(gameData, currentLeg),
        set: GameStatistics.calculateSetAverage(gameData, currentSet),
        firstNine: GameStatistics.calculateFirstNineAverage(gameData)
      },
      checkouts: {
        percentage: GameStatistics.calculateCheckoutPercentage(gameData),
        successful: GameStatistics.getSuccessfulCheckouts(gameData),
        attempts: GameStatistics.getCheckoutAttempts(gameData)
      },
      legsWon: {
        nine: GameStatistics.getLegsWonByDarts(gameData, 9),
        tenToTwelve: GameStatistics.getLegsWonByDartsRange(gameData, 10, 12),
        thirteenToFifteen: GameStatistics.getLegsWonByDartsRange(gameData, 13, 15),
        sixteenToTwenty: GameStatistics.getLegsWonByDartsRange(gameData, 16, 20),
        twentyOneToTwentyFive: GameStatistics.getLegsWonByDartsRange(gameData, 21, 25),
        twentySixToThirty: GameStatistics.getLegsWonByDartsRange(gameData, 26, 30),
        thirtyPlus: GameStatistics.getLegsWonByDartsOver(gameData, 30)
      },
      scoring: {
        oneEighty: GameStatistics.getScoringCount(gameData, 180),
        oneFortyPlus: GameStatistics.getScoringRangeCount(gameData, 140, 179),
        oneHundredPlus: GameStatistics.getScoringRangeCount(gameData, 100, 139),
        sixtyPlus: GameStatistics.getScoringRangeCount(gameData, 60, 99),
        fortyPlus: GameStatistics.getScoringRangeCount(gameData, 40, 59),
        twentyPlus: GameStatistics.getScoringRangeCount(gameData, 20, 39),
        oneToTwenty: GameStatistics.getScoringRangeCount(gameData, 1, 19)
      },
      gameData: gameData
    };
  };

  // Render game content based on stats visibility
  const renderGameContent = () => {
    // Beregn statistikker for begge spillere
    const player1Stats = calculatePlayerStats(players[0].id);
    const player2Stats = calculatePlayerStats(players[1].id);

    if (showingStats) {
      if (player1Stats && player2Stats) {
        return (
          <GameStats 
            player1={{
              name: players[0].name,
              stats: player1Stats
            }}
            player2={{
              name: players[1].name,
              stats: player2Stats
            }}
          />
        );
      }
      return null;
    }

    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#2c3e50',
          overflow: 'hidden',
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          top: `${appBarHeight}px`
        }}
      >
        {/* Players Section - Score Area */}
        <Box 
          className="score-area"
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}
        >
          {players.map((player, index) => {
            const playerStats = index === 0 ? player1Stats : player2Stats;
            
            return (
              <Box
                key={player.id}
                className={index === 0 ? "css-tbnn2" : "css-1cnq292"}
                sx={{
                  flex: 1,
                  height: '100%',
                  bgcolor: index === currentPlayerIndex ? '#34495e' : '#2c3e50',
                  color: index === currentPlayerIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderRight: index === 0 ? '1px solid #34495e' : 'none',
                  overflow: 'hidden',
                  transition: 'background-color 0.3s ease'
                }}
              >
                <PlayerStats
                  name={player.name}
                  score={scores[player.id]}
                  isActive={index === currentPlayerIndex}
                  average={playerStats ? playerStats.averages.overall : 0}
                  setAverage={playerStats ? playerStats.averages.set : 0}
                  legAverage={currentLegAverage[player.id]}
                  lastThrows={lastThrows[player.id]}
                  roundScore={0}
                  ninedartsAvg={playerStats ? playerStats.averages.firstNine : 0}
                  checkoutPercentage={playerStats ? playerStats.checkouts.percentage : 0}
                  setsWon={setsWon[player.id]}
                  legsWon={legsWon[player.id]}
                  dartsThrown={currentLegDarts[player.id]}
                  doubleAttempts={playerStats ? playerStats.checkouts.attempts : 0}
                  checkoutThrows={checkoutThrows[player.id]}
                  successfulCheckouts={playerStats ? playerStats.checkouts.successful : 0}
                >
                  {gameConfig.useDoubles && scores[player.id] <= 170 && scores[player.id] >= 2 && (
                    <Typography 
                      sx={{ 
                        color: '#4caf50',
                        fontSize: {
                          xs: '1.1rem',
                          sm: '1.3rem',
                          md: '1.5rem'
                        },
                        fontWeight: 700,
                        textAlign: 'center',
                        width: '100%',
                        mt: 1
                      }}
                    >
                      {CheckoutValidator.getCheckoutRoute(scores[player.id])}
                    </Typography>
                  )}
                </PlayerStats>
              </Box>
            );
          })}
        </Box>

        {/* Score Input Section - Input Area */}
        <Box 
          className="input-area"
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <ScoreInput
            currentPlayer={players[currentPlayerIndex]}
            currentScore={scores[players[currentPlayerIndex].id]}
            onScore={handleScore}
            gameConfig={gameConfig}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box 
      className="game-container"
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        pt: `${appBarHeight}px`
      }}
    >
      {renderGameContent()}
    </Box>
  );
};

export default X01Game; 