import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import ScoreInput from '../components/game/ScoreInput';
import CheckoutDialog from '../components/game/CheckoutDialog';
import CheckoutValidator from '../utils/CheckoutValidator';
import { GameConfig, Player, CheckoutGuide } from '../types/game';

interface X01GameProps {
  gameConfig: GameConfig;
  players: Player[];
}

const X01Game: React.FC<X01GameProps> = ({ gameConfig, players }) => {
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
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState<{
    route?: string;
    remainingScore?: number;
    isCheckoutAttempt: boolean;
  } | null>(null);
  const [selectedScore, setSelectedScore] = useState<number>(0);

  const handleScore = (score: number, dartsUsed: number = 3, isDouble: boolean = false) => {
    const currentPlayer = players[currentPlayerIndex];
    const currentScore = scores[currentPlayer.id];
    
    // Håndtér 0-score (bust eller miss)
    if (score === 0) {
      if (gameConfig.doubleOut) {
        setDoubleAttempts(prev => ({
          ...prev,
          [currentPlayer.id]: prev[currentPlayer.id] + 1
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
      if (gameConfig.doubleOut && !isDouble) {
        // Brug CheckoutValidator til at tjekke, om scoren kunne være en double-checkout
        const checkoutInfo = CheckoutValidator.validateCheckout(currentScore, score);
        if (checkoutInfo.isPossible) {
          setSelectedScore(score);
          setCheckoutInfo({
            route: checkoutInfo.checkoutRoute,
            remainingScore: 0,
            isCheckoutAttempt: true
          });
          setShowCheckoutDialog(true);
          return;
        } else {
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
      }
    } else if (newScore < 0 || (gameConfig.doubleOut && newScore === 1)) {
      // Bust - score er for høj eller efterlader 1 (ugyldig checkout når doubleOut er aktiv)
      setCurrentPlayerIndex((current) => 
        current === players.length - 1 ? 0 : current + 1
      );
      return;
    } else if (newScore > 0 && newScore <= 170 && gameConfig.doubleOut) {
      // Tjek om spilleren kunne forsøge checkout på næste kast
      const checkoutInfo = CheckoutValidator.checkPossibleDoubleAttempt(currentScore, score);
      if (checkoutInfo.possibleDoubleAttempt) {
        setSelectedScore(score);
        setCheckoutInfo({
          route: checkoutInfo.checkoutRoute,
          remainingScore: newScore,
          isCheckoutAttempt: false
        });
        setShowCheckoutDialog(true);
        return;
      }
    }

    // Normal score opdatering når det ikke er checkout
    applyScore(score, dartsUsed, isDouble, newScore);
  };

  const applyScore = (score: number, dartsUsed: number, isDouble: boolean, newScore: number) => {
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

    setDartsThrown(prev => ({
      ...prev,
      [currentPlayer.id]: prev[currentPlayer.id] + dartsUsed
    }));

    // Hvis det er en checkout, opdater checkout statistik
    if (newScore === 0) {
      setCheckoutThrows(prev => ({
        ...prev,
        [currentPlayer.id]: dartsUsed
      }));
      
      // Opdater checkout procentdel
      const attempts = doubleAttempts[currentPlayer.id];
      const successRate = attempts > 0 ? (1 / (attempts + 1)) * 100 : 100;
      setCheckoutPercentages(prev => ({
        ...prev,
        [currentPlayer.id]: successRate
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

  const handleCheckoutResponse = (response: { 
    hadDoubleAttempt?: boolean; 
    isCheckout?: boolean; 
    dartsUsed?: number;
    doubleAttempts?: number;
  }) => {
    const currentPlayer = players[currentPlayerIndex];
    const currentPlayerScore = scores[currentPlayer.id];
    
    if (checkoutInfo?.isCheckoutAttempt) {
      // Håndtér checkout bekræftelse
      if (response.isCheckout && response.dartsUsed) {
        // Gyldig checkout
        applyScore(selectedScore, response.dartsUsed, true, 0);
        
        // Opdater double-forsøg, hvis angivet
        setDoubleAttempts(prev => ({
          ...prev,
          [currentPlayer.id]: prev[currentPlayer.id] + (response.doubleAttempts || 0)
        }));
      } else {
        // Ugyldig checkout (bust)
        setDoubleAttempts(prev => ({
          ...prev,
          [currentPlayer.id]: prev[currentPlayer.id] + 1
        }));
        setCurrentPlayerIndex((current) => 
          current === players.length - 1 ? 0 : current + 1
        );
      }
    } else {
      // Håndtér almindeligt kast med mulig double forsøg
      if (response.hadDoubleAttempt) {
        setDoubleAttempts(prev => ({
          ...prev,
          [currentPlayer.id]: prev[currentPlayer.id] + 1
        }));
      }
      
      // Opdater spillerens score
      const newScore = currentPlayerScore - selectedScore;
      applyScore(selectedScore, 3, false, newScore);
    }
    
    setShowCheckoutDialog(false);
    setCheckoutInfo(null);
  };

  // Opdater checkout guide når spillerens score ændres
  useEffect(() => {
    const currentPlayer = players[currentPlayerIndex];
    const currentScore = scores[currentPlayer.id];
    
    if (gameConfig.doubleOut && currentScore <= 170) {
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
  }, [currentPlayerIndex, scores, gameConfig.doubleOut, players]);

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        marginTop: `${appBarHeight}px`,
        height: `calc(100vh - ${appBarHeight}px)`,
        bgcolor: '#2c3e50',
        overflow: 'hidden',
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0
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
        {players.map((player, index) => (
          <Box
            key={player.id}
            className={index === 0 ? "css-tbnn2" : "css-1cnq292"}
            sx={{
              flex: 1,
              height: '100%',
              bgcolor: '#2c3e50',
              color: index === currentPlayerIndex ? '#fff' : 'rgba(255,255,255,0.5)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderRight: index === 0 ? '1px solid #34495e' : 'none',
              overflow: 'hidden'
            }}
          >
            {index === currentPlayerIndex && (
              <Box
                className="css-vr33al"
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
            
            <Box className="css-19midj6" sx={{ p: 2 }}>
              <Typography 
                className="css-1iemo1c-MuiTypography-root"
                sx={{ 
                  fontSize: {
                    xs: '0.75rem',     // Mobile: ~15% smaller
                    sm: '0.8rem',      // Tablet: ~10% smaller
                    md: '0.875rem'     // Desktop: 100%
                  },
                  mb: 1,
                  ml: 3
                }}
              >
                {player.name}
              </Typography>
              <Typography 
                variant="h1"
                className="css-1wyzjgh-MuiTypography-root"
                sx={{ 
                  fontSize: {
                    xs: '4rem',        // Mobile: ~20% smaller
                    sm: '4.5rem',      // Tablet: ~10% smaller
                    md: '5rem'         // Desktop: 100%
                  },
                  fontWeight: 700,
                  lineHeight: 1,
                  ml: 3
                }}
              >
                {scores[player.id]}
              </Typography>
            </Box>

            <Box className="css-101ju1p" sx={{ px: 2, flex: 1, overflow: 'auto' }}>
              <Box className="css-1qm1lh" sx={{ mb: 2 }}>
                <Box className="css-wax5jp" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography 
                    className="css-1y8dsxu-MuiTypography-root" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    Darts:
                  </Typography>
                  <Typography 
                    className="css-rizt0-MuiTypography-root"
                    sx={{ 
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    {dartsThrown[player.id]}
                  </Typography>
                </Box>
                <Box className="css-wax5jp" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography 
                    className="css-1y8dsxu-MuiTypography-root" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    Checkout:
                  </Typography>
                  <Typography 
                    className="css-rizt0-MuiTypography-root"
                    sx={{ 
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    {checkoutPercentages[player.id].toFixed(2)}%
                  </Typography>
                </Box>
                <Box className="css-wax5jp" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography 
                    className="css-1y8dsxu-MuiTypography-root" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    Double Attempts:
                  </Typography>
                  <Typography 
                    className="css-rizt0-MuiTypography-root"
                    sx={{ 
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    {doubleAttempts[player.id]}
                  </Typography>
                </Box>
                <Box className="css-gg4vpm" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box className="css-1i27l4i" sx={{ display: 'flex', gap: 1 }}>
                    <Typography 
                      className="css-1y8dsxu-MuiTypography-root" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: {
                          xs: '0.75rem',  // Mobile: ~15% smaller
                          sm: '0.8rem',   // Tablet: ~10% smaller
                          md: '0.875rem'  // Desktop: 100%
                        }
                      }}
                    >
                      Set:
                    </Typography>
                    <Typography 
                      className="css-rizt0-MuiTypography-root"
                      sx={{ 
                        fontSize: {
                          xs: '0.75rem',  // Mobile: ~15% smaller
                          sm: '0.8rem',   // Tablet: ~10% smaller
                          md: '0.875rem'  // Desktop: 100%
                        }
                      }}
                    >
                      {setsWon[player.id]}
                    </Typography>
                  </Box>
                  <Box className="css-1i27l4i" sx={{ display: 'flex', gap: 1 }}>
                    <Typography 
                      className="css-1y8dsxu-MuiTypography-root" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: {
                          xs: '0.75rem',  // Mobile: ~15% smaller
                          sm: '0.8rem',   // Tablet: ~10% smaller
                          md: '0.875rem'  // Desktop: 100%
                        }
                      }}
                    >
                      Leg:
                    </Typography>
                    <Typography 
                      className="css-rizt0-MuiTypography-root"
                      sx={{ 
                        fontSize: {
                          xs: '0.75rem',  // Mobile: ~15% smaller
                          sm: '0.8rem',   // Tablet: ~10% smaller
                          md: '0.875rem'  // Desktop: 100%
                        }
                      }}
                    >
                      {legsWon[player.id]}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="css-1qm1lh" sx={{ mb: 2 }}>
                <Box className="css-wax5jp" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography 
                    className="css-1y8dsxu-MuiTypography-root" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    Game:
                  </Typography>
                  <Typography 
                    className="css-rizt0-MuiTypography-root"
                    sx={{ 
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    {averages[player.id].toFixed(2)}
                  </Typography>
                </Box>
                <Box className="css-wax5jp" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography 
                    className="css-1y8dsxu-MuiTypography-root" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    Set:
                  </Typography>
                  <Typography 
                    className="css-rizt0-MuiTypography-root"
                    sx={{ 
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    {setAvg[player.id].toFixed(2)}
                  </Typography>
                </Box>
                <Box className="css-gg4vpm" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography 
                    className="css-1y8dsxu-MuiTypography-root" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    Leg:
                  </Typography>
                  <Typography 
                    className="css-rizt0-MuiTypography-root"
                    sx={{ 
                      fontSize: {
                        xs: '0.75rem',  // Mobile: ~15% smaller
                        sm: '0.8rem',   // Tablet: ~10% smaller
                        md: '0.875rem'  // Desktop: 100%
                      }
                    }}
                  >
                    {legAvg[player.id].toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Box 
                className="css-17voejd"
                sx={{ 
                  mt: 'auto',
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography 
                  className="css-1y8dsxu-MuiTypography-root" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: {
                      xs: '0.75rem',  // Mobile: ~15% smaller
                      sm: '0.8rem',   // Tablet: ~10% smaller
                      md: '0.875rem'  // Desktop: 100%
                    }
                  }}
                >
                  Last score:
                </Typography>
                <Typography 
                  className="css-rizt0-MuiTypography-root"
                  sx={{ 
                    fontSize: {
                      xs: '0.75rem',  // Mobile: ~15% smaller
                      sm: '0.8rem',   // Tablet: ~10% smaller
                      md: '0.875rem'  // Desktop: 100%
                    }
                  }}
                >
                  {lastThrows[player.id].length > 0 ? lastThrows[player.id][0] : '-'}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
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
          checkoutGuide={checkoutGuide}
        />
      </Box>

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={showCheckoutDialog}
        onClose={handleCheckoutResponse}
        checkoutInfo={checkoutInfo}
        showCheckoutOptions={true}
      />
    </Box>
  );
};

export default X01Game; 