import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Slider,
  Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import LoginDialog from '../components/dialogs/LoginDialog';
import GuestDialog from '../components/dialogs/GuestDialog';
import BotDialog from '../components/dialogs/BotDialog';
import FriendDialog from '../components/dialogs/FriendDialog';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface Player {
  id: string;
  name: string;
  type: PlayerType;
  avatar?: string;
  botDifficulty?: string;
}

type PlayerType = 'login' | 'guest' | 'bot' | 'friend';
type MatchFormat = 'first' | 'best';

const X01Setup = () => {
  const navigate = useNavigate();
  
  // Player Settings
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player 1', type: 'guest' }
  ]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  
  // Game Settings
  const [gameType, setGameType] = useState<number>(501);
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('first');
  const [sets, setSets] = useState<number>(1);
  const [legs, setLegs] = useState<number>(3);
  const [formatType, setFormatType] = useState<'legs' | 'sets'>('legs');
  const [formatCount, setFormatCount] = useState(5);
  const [inMode, setInMode] = useState('straight');
  const [outMode, setOutMode] = useState('double');
  const [checkoutRate, setCheckoutRate] = useState(false);

  // Game settings
  const [startingScore, setStartingScore] = useState<number>(501);
  const [startingIn, setStartingIn] = useState('straight');
  
  // Game options
  const [isTraining, setIsTraining] = useState(false);
  const [scoreAnnouncer, setScoreAnnouncer] = useState(false);
  const [perDartInput, setPerDartInput] = useState(false);
  const [randomStart, setRandomStart] = useState(false);
  
  // Checkout options
  const [showCheckout, setShowCheckout] = useState(true);
  const [useDoubles, setUseDoubles] = useState(true);
  const [dartsThrown, setDartsThrown] = useState(false);

  // Dialog states
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [botDialogOpen, setBotDialogOpen] = useState(false);
  const [friendDialogOpen, setFriendDialogOpen] = useState(false);

  const handlePlayerTypeChange = (index: number, value: PlayerType) => {
    if (value) {
      setSelectedPlayer(index);
      switch (value) {
        case 'login':
          setLoginDialogOpen(true);
          break;
        case 'guest':
          setGuestDialogOpen(true);
          break;
        case 'bot':
          setBotDialogOpen(true);
          break;
        case 'friend':
          setFriendDialogOpen(true);
          break;
      }
    }
  };

  const handleAddGuest = (name: string, save: boolean) => {
    if (selectedPlayer !== null) {
      const updatedPlayers = [...players];
      updatedPlayers[selectedPlayer] = {
        ...updatedPlayers[selectedPlayer],
        name,
        type: 'guest'
      };
      setPlayers(updatedPlayers);
    }
    setGuestDialogOpen(false);
  };

  const handleSelectBot = (difficulty: string) => {
    if (selectedPlayer !== null) {
      const updatedPlayers = [...players];
      updatedPlayers[selectedPlayer] = {
        ...updatedPlayers[selectedPlayer],
        name: `Bot (${difficulty})`,
        type: 'bot',
        botDifficulty: difficulty
      };
      setPlayers(updatedPlayers);
    }
    setBotDialogOpen(false);
  };

  const handleAddPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { 
        id: (players.length + 1).toString(), 
        name: `Player ${players.length + 1}`,
        type: 'guest'
      }]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
  };

  const getRequiredWins = () => {
    if (matchFormat === 'first') return formatCount;
    return Math.ceil(formatCount / 2);
  };

  const handleStartGame = () => {
    // Validér at der er mindst 2 spillere
    if (players.length < 2) {
      alert('Der skal være mindst 2 spillere for at starte spillet');
      return;
    }

    const gameConfig = {
      // Spillere
      players: players.map(player => ({
        id: player.id,
        name: player.name,
        type: player.type,
        botDifficulty: player.botDifficulty
      })),
      
      // Spil indstillinger
      startingScore,
      matchFormat,
      sets,
      legs,
      startingIn,
      
      // Spil muligheder
      isTraining,
      scoreAnnouncer,
      perDartInput,
      randomStart,
      
      // Checkout muligheder
      showCheckout,
      useDoubles,
      dartsThrown
    };

    navigate('/x01game', { state: gameConfig });
  };

  return (
    <Box sx={{ 
      bgcolor: '#1a1f2e', 
      minHeight: '100vh', 
      p: 2,
      color: 'white'
    }}>
      <Container maxWidth="md">
        {/* Players Section */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 2, 
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            borderRadius: 2
          }}
        >
          {players.map((player, index) => (
            <Box 
              key={player.id}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: index < players.length - 1 ? 2 : 0,
                gap: 2
              }}
            >
              <DragIndicatorIcon sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
              
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                {player.name.charAt(0)}
              </Avatar>
              
              <Typography sx={{ flex: 1 }}>{player.name}</Typography>

              <ToggleButtonGroup
                value={player.type}
                exclusive
                onChange={(e, value) => handlePlayerTypeChange(index, value as PlayerType)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }
                  }
                }}
              >
                <ToggleButton value="login">Login</ToggleButton>
                <ToggleButton value="guest">Guest</ToggleButton>
                <ToggleButton value="bot">Bot</ToggleButton>
                <ToggleButton value="friend">Friend</ToggleButton>
              </ToggleButtonGroup>

              <IconButton 
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <EditIcon fontSize="small" />
              </IconButton>

              {players.length > 1 && (
                <IconButton 
                  size="small"
                  onClick={() => handleRemovePlayer(index)}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}

          {players.length < 4 && (
            <Button
              onClick={handleAddPlayer}
              sx={{
                mt: 2,
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Add Player
            </Button>
          )}
        </Paper>

        {/* Game Settings */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 2, 
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}>
            <Typography sx={{ flex: 1 }}>Starting score</Typography>
            <Box sx={{ flex: 1 }}>
              <Select
                value={startingScore}
                onChange={(e) => setStartingScore(e.target.value as number)}
                fullWidth
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'white',
                  }
                }}
              >
                <MenuItem value={101}>101</MenuItem>
                <MenuItem value={170}>170</MenuItem>
                <MenuItem value={301}>301</MenuItem>
                <MenuItem value={501}>501</MenuItem>
                <MenuItem value={701}>701</MenuItem>
                <MenuItem value={1001}>1001</MenuItem>
              </Select>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}>
            <Typography sx={{ flex: 1 }}>First to / Best of</Typography>
            <Box sx={{ flex: 1 }}>
              <Select
                value={matchFormat}
                onChange={(e) => setMatchFormat(e.target.value as MatchFormat)}
                fullWidth
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'white',
                  }
                }}
              >
                <MenuItem value="first">First to</MenuItem>
                <MenuItem value="best">Best of</MenuItem>
              </Select>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}>
            <Typography sx={{ flex: 1 }}>Sets / Legs</Typography>
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              gap: 1 
            }}>
              <Select
                value={sets}
                onChange={(e) => setSets(e.target.value as number)}
                fullWidth
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'white',
                  }
                }}
              >
                <MenuItem value={1}>1 set</MenuItem>
                <MenuItem value={2}>2 sets</MenuItem>
                <MenuItem value={3}>3 sets</MenuItem>
                <MenuItem value={4}>4 sets</MenuItem>
                <MenuItem value={5}>5 sets</MenuItem>
                <MenuItem value={6}>6 sets</MenuItem>
                <MenuItem value={7}>7 sets</MenuItem>
              </Select>
              <Select
                value={legs}
                onChange={(e) => setLegs(e.target.value as number)}
                fullWidth
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'white',
                  }
                }}
              >
                <MenuItem value={1}>1 leg</MenuItem>
                <MenuItem value={2}>2 legs</MenuItem>
                <MenuItem value={3}>3 legs</MenuItem>
                <MenuItem value={4}>4 legs</MenuItem>
                <MenuItem value={5}>5 legs</MenuItem>
                <MenuItem value={6}>6 legs</MenuItem>
                <MenuItem value={7}>7 legs</MenuItem>
                <MenuItem value={8}>8 legs</MenuItem>
                <MenuItem value={9}>9 legs</MenuItem>
                <MenuItem value={10}>10 legs</MenuItem>
                <MenuItem value={11}>11 legs</MenuItem>
                <MenuItem value={12}>12 legs</MenuItem>
              </Select>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2 
          }}>
            <Typography sx={{ flex: 1 }}>Starting in</Typography>
            <Box sx={{ flex: 1 }}>
              <Select
                value={startingIn}
                onChange={(e) => setStartingIn(e.target.value as string)}
                fullWidth
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'white',
                  }
                }}
              >
                <MenuItem value="straight">Straight in</MenuItem>
                <MenuItem value="double">Double in</MenuItem>
              </Select>
            </Box>
          </Box>
        </Paper>

        {/* Game Options */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 2, 
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography>Training</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                excluded from statistics
              </Typography>
            </Box>
            <Switch 
              checked={isTraining}
              onChange={(e) => setIsTraining(e.target.checked)}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}>
            <Typography sx={{ flex: 1 }}>Score announcer</Typography>
            <Switch 
              checked={scoreAnnouncer}
              onChange={(e) => setScoreAnnouncer(e.target.checked)}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography>Per dart input</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                input score per dart
              </Typography>
            </Box>
            <Switch 
              checked={perDartInput}
              onChange={(e) => setPerDartInput(e.target.checked)}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2 
          }}>
            <Typography sx={{ flex: 1 }}>Random player start</Typography>
            <Switch 
              checked={randomStart}
              onChange={(e) => setRandomStart(e.target.checked)}
            />
          </Box>
        </Paper>

        {/* Checkout Options */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
            Checkout options
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography>Checkout</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                show checkout popup
              </Typography>
            </Box>
            <Switch 
              checked={showCheckout}
              onChange={(e) => setShowCheckout(e.target.checked)}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography>Use doubles</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                need a double to finish
              </Typography>
            </Box>
            <Switch 
              checked={useDoubles}
              onChange={(e) => setUseDoubles(e.target.checked)}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2 
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography>Darts thrown</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                bust with less darts
              </Typography>
            </Box>
            <Switch 
              checked={dartsThrown}
              onChange={(e) => setDartsThrown(e.target.checked)}
            />
          </Box>
        </Paper>

        {/* Start Game Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleStartGame}
          sx={{
            py: 2,
            bgcolor: '#00875A',
            '&:hover': {
              bgcolor: '#007A51',
            },
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Let's Play Darts
        </Button>

        {/* Dialogs */}
        <LoginDialog 
          open={loginDialogOpen} 
          onClose={() => setLoginDialogOpen(false)} 
        />
        
        <GuestDialog 
          open={guestDialogOpen} 
          onClose={() => setGuestDialogOpen(false)}
          onAddGuest={handleAddGuest}
        />
        
        <BotDialog 
          open={botDialogOpen} 
          onClose={() => setBotDialogOpen(false)}
          onSelectDifficulty={handleSelectBot}
        />
        
        <FriendDialog 
          open={friendDialogOpen} 
          onClose={() => setFriendDialogOpen(false)} 
        />
      </Container>
    </Box>
  );
};

export default X01Setup; 