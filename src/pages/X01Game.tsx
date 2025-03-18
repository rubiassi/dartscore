import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ScoreInput from '../components/game/ScoreInput';
import PlayerStats from '../components/game/PlayerStats';
import CheckoutDialog from '../components/game/CheckoutDialog';
import CheckoutValidator from '../utils/CheckoutValidator';

interface GameConfig {
  gameType: number;
  players: string[];
  sets: number;
  legs: number;
}

interface PlayerState {
  score: number;
  throws: number[][];  // Array af runder, hver runde har 1 score (sum af 3 pile)
  roundScores: number[];  // Score for hver runde
  average: number;
  setsWon: number;
  legsWon: number;
  checkoutAttempts: number;  // Antal forsøg på checkout
  checkoutSuccesses: number; // Antal succesfulde checkouts
  firstNineScores: number[]; // Scores for de første 9 pile i hvert leg
  currentLegScores: number; // Antal scores i det nuværende leg
  dartsThrown: number;  // Totalt antal pile kastet
  checkoutDartsThrown: number;  // Antal pile brugt på checkouts
}

const X01Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameConfig = location.state as GameConfig;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [playerStates, setPlayerStates] = useState<PlayerState[]>(
    gameConfig.players.map(() => ({
      score: gameConfig.gameType,
      throws: [[]],
      roundScores: [],
      average: 0,
      setsWon: 0,
      legsWon: 0,
      checkoutAttempts: 0,
      checkoutSuccesses: 0,
      firstNineScores: [],
      currentLegScores: 0,
      dartsThrown: 0,
      checkoutDartsThrown: 0
    }))
  );

  // State for checkout dialog
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [pendingScore, setPendingScore] = useState<number | null>(null);
  const [checkoutInfo, setCheckoutInfo] = useState<{
    route?: string;
    remainingScore?: number;
    isCheckoutAttempt: boolean;
  } | null>(null);

  const calculateAverage = (scores: number[][]) => {
    const totalScore = scores.reduce((sum, round) => 
      sum + (round[0] || 0), 0
    );
    return scores.length > 0 ? totalScore / scores.length : 0;
  };

  const calculateNineDartsAverage = (scores: number[]) => {
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + score, 0);
    return total / scores.length;
  };

  const calculateCheckoutPercentage = (attempts: number, successes: number) => {
    if (attempts === 0) return 0;
    return (successes / attempts) * 100;
  };

  const handleCheckoutDialogClose = (response: { 
    hadDoubleAttempt?: boolean; 
    isCheckout?: boolean; 
    dartsUsed?: number;
    doubleAttempts?: number;
  }) => {
    setShowCheckoutDialog(false);
    if (pendingScore === null) return;

    const currentPlayerState = playerStates[currentPlayer];
    const newPlayerStates = [...playerStates];

    if (response.hadDoubleAttempt !== undefined) {
      // Dette var et checkout forsøg
      if (response.hadDoubleAttempt) {
        newPlayerStates[currentPlayer].checkoutAttempts++;
      }
      processScore(pendingScore, newPlayerStates);
    } else if (response.isCheckout !== undefined) {
      // Dette var en potentiel checkout (score = 0)
      if (response.isCheckout && response.dartsUsed) {
        // Succesfuld checkout
        newPlayerStates[currentPlayer].checkoutAttempts++;
        newPlayerStates[currentPlayer].checkoutSuccesses++;
        newPlayerStates[currentPlayer].checkoutDartsThrown += response.doubleAttempts || 1; // Brug doubleAttempts hvis angivet
        // Juster det totale antal pile baseret på hvor mange der blev brugt
        newPlayerStates[currentPlayer].dartsThrown -= (3 - response.dartsUsed);
        processScore(pendingScore, newPlayerStates);
        
        // Start næste leg
        startNewLeg(newPlayerStates);
      } else {
        // Bust - gå til næste spiller uden at registrere scoren
        setCurrentPlayer((currentPlayer + 1) % gameConfig.players.length);
      }
    }

    setPendingScore(null);
    setCheckoutInfo(null);
  };

  const startNewLeg = (states: PlayerState[]) => {
    // Nulstil score for alle spillere
    for (let i = 0; i < states.length; i++) {
      states[i].score = gameConfig.gameType;
      states[i].currentLegScores = 0;
      states[i].throws.push([]); // Start ny runde for alle spillere
    }
    setPlayerStates([...states]);
  };

  const processScore = (score: number, states: PlayerState[]) => {
    const currentPlayerState = states[currentPlayer];
    const newScore = currentPlayerState.score - score;
    
    // Add score to current round
    states[currentPlayer].throws[states[currentPlayer].throws.length - 1] = [score];
    states[currentPlayer].score = newScore;
    states[currentPlayer].roundScores.push(score);

    // Opdater first nine scores - tæl de første 3 runder i hvert leg
    if (states[currentPlayer].currentLegScores < 3) {
      states[currentPlayer].firstNineScores.push(score);
    }
    states[currentPlayer].currentLegScores++;

    // Hvis leg er slut (score = 0), nulstil currentLegScores
    if (newScore === 0) {
      for (let player of states) {
        player.currentLegScores = 0;
      }
      // Opdater checkout statistik
      const checkoutInfo = CheckoutValidator.validateCheckout(currentPlayerState.score, score);
      if (checkoutInfo.isPossible) {
        states[currentPlayer].checkoutSuccesses++;
        states[currentPlayer].checkoutDartsThrown += checkoutInfo.minimumDarts;
      }
    }

    // Opdater antal kastede pile
    states[currentPlayer].dartsThrown += 3;  // Standard er 3 pile per runde

    // Update average
    states[currentPlayer].average = calculateAverage(states[currentPlayer].throws);

    setPlayerStates(states);

    // Move to next player
    setCurrentPlayer((currentPlayer + 1) % gameConfig.players.length);
    // Start new round for next player
    states[currentPlayer].throws.push([]);
  };

  const handleScore = (score: number) => {
    const currentPlayerState = playerStates[currentPlayer];
    
    // Check if score would go below 0
    if (currentPlayerState.score - score < 0) {
      // Bust - next player
      setCurrentPlayer((currentPlayer + 1) % gameConfig.players.length);
      return;
    }

    // Hvis scoren vil give 0, vis checkout dialog
    if (currentPlayerState.score - score === 0) {
      setPendingScore(score);
      setCheckoutInfo({
        isCheckoutAttempt: false
      });
      setShowCheckoutDialog(true);
      return;
    }

    // Tjek for mulig checkout
    if (currentPlayerState.score <= 170) {
      const checkoutInfo = CheckoutValidator.checkPossibleDoubleAttempt(
        currentPlayerState.score,
        score
      );

      if (checkoutInfo.possibleDoubleAttempt && checkoutInfo.checkoutRoute) {
        setPendingScore(score);
        setCheckoutInfo({
          route: checkoutInfo.checkoutRoute,
          remainingScore: currentPlayerState.score - score,
          isCheckoutAttempt: true
        });
        setShowCheckoutDialog(true);
        return;
      }
    }

    // Hvis ingen checkout mulighed, fortsæt normalt
    const newPlayerStates = [...playerStates];
    processScore(score, newPlayerStates);
  };

  const handleUndo = () => {
    if (currentPlayer === 0 && playerStates[playerStates.length - 1].throws[0].length === 0) return; // Nothing to undo

    const newPlayerStates = [...playerStates];
    let newCurrentPlayer = currentPlayer;

    // Go back to previous player
    newCurrentPlayer = (currentPlayer - 1 + gameConfig.players.length) % gameConfig.players.length;
    
    // Get the last throw
    const previousPlayerThrows = newPlayerStates[newCurrentPlayer].throws;
    const lastRound = previousPlayerThrows[previousPlayerThrows.length - 1];
    
    if (lastRound && lastRound.length > 0) {
      // Restore previous score
      const lastScore = lastRound[0];
      newPlayerStates[newCurrentPlayer].score += lastScore;
      
      // Remove last score
      previousPlayerThrows.pop();
      if (previousPlayerThrows.length === 0) {
        previousPlayerThrows.push([]);
      }
      
      // Remove from roundScores
      newPlayerStates[newCurrentPlayer].roundScores.pop();

      // Hvis det var en af de første 3 runder i et leg, fjern også fra firstNineScores
      if (newPlayerStates[newCurrentPlayer].currentLegScores <= 3) {
        newPlayerStates[newCurrentPlayer].firstNineScores.pop();
      }
      newPlayerStates[newCurrentPlayer].currentLegScores = Math.max(0, newPlayerStates[newCurrentPlayer].currentLegScores - 1);
      
      // Update average
      newPlayerStates[newCurrentPlayer].average = calculateAverage(previousPlayerThrows);
    }

    setPlayerStates(newPlayerStates);
    setCurrentPlayer(newCurrentPlayer);
  };

  const handleEndGame = useCallback(() => {
    // TODO: Implementer dialog der bekræfter afslutning af spillet
    if (window.confirm('Er du sikker på at du vil afslutte spillet?')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Section - Scores */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: 'background.default'
        }}
      >
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom 
          textAlign="center"
          sx={{ mb: 3 }}
        >
          {gameConfig.gameType} - Leg 1, Set 1
        </Typography>

        <Grid 
          container 
          spacing={2}
          sx={{ mb: 2 }}
        >
          {playerStates.map((playerState, index) => (
            <Grid item xs={12} md={6} key={index}>
              <PlayerStats
                name={gameConfig.players[index]}
                score={playerState.score}
                isActive={index === currentPlayer}
                average={calculateAverage(playerState.throws)}
                lastThrows={playerState.throws[playerState.throws.length - 1] || []}
                roundScore={playerState.currentLegScores}
                ninedartsAvg={calculateNineDartsAverage(playerState.firstNineScores)}
                checkoutPercentage={calculateCheckoutPercentage(playerState.checkoutAttempts, playerState.checkoutSuccesses)}
                onEndGame={handleEndGame}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Bottom Section - Input */}
      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          p: 2,
          bgcolor: 'background.paper',
          maxHeight: isMobile ? '60vh' : '45vh',
          minHeight: isMobile ? '60vh' : '45vh'
        }}
      >
        <ScoreInput
          onScore={handleScore}
          onUndo={handleUndo}
        />

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              if (window.confirm('Er du sikker på at du vil forlade spillet?')) {
                navigate('/local');
              }
            }}
          >
            Afslut spil
          </Button>
        </Box>
      </Box>

      {/* Checkout Dialog */}
      {showCheckoutDialog && checkoutInfo && (
        <CheckoutDialog
          open={showCheckoutDialog}
          onClose={handleCheckoutDialogClose}
          checkoutRoute={checkoutInfo.route}
          remainingScore={checkoutInfo.remainingScore}
          isCheckoutAttempt={checkoutInfo.isCheckoutAttempt}
        />
      )}
    </Box>
  );
};

export default X01Game; 