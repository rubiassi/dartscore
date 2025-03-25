import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'firebase/auth';
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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LoginDialog from '../components/dialogs/LoginDialog';
import GuestDialog from '../components/dialogs/GuestDialog';
import BotDialog from '../components/dialogs/BotDialog';
import FriendDialog from '../components/dialogs/FriendDialog';
import { GameConfig, Player, PlayerType } from '../types/game';
import SettingsIcon from '@mui/icons-material/Settings';
import NavigationLayout from '../components/layout/NavigationLayout';

// Interfaces og typer
type MatchFormat = 'first' | 'best';
type Position = 0 | 1 | 2 | 3;
type SwapDirection = 'next' | 'previous' | 'across';

interface GameSettings {
  gameType: number;
  matchFormat: MatchFormat;
  sets: number;
  legs: number;
  formatType: 'legs' | 'sets';
  formatCount: number;
  inMode: 'straight' | 'double' | 'triple';
  outMode: 'double' | 'master' | 'straight';
  checkoutRate: boolean;
}

interface PlayerCardProps {
  player: Player;
  index: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  isHome: boolean;
  totalPlayers: number;
  onPlayerTypeChange: (index: number, type: PlayerType) => void;
}

interface FirebaseUser {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface Friend {
  id: string;
  name: string;
}

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: FirebaseUser) => void;
}

const isBot = (type: PlayerType): type is 'bot' => type === 'bot';

// Tilføj ItemTypes konstant
const ItemTypes = {
  PLAYER_CARD: 'playerCard'
};

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  index, 
  onMoveUp,
  onMoveDown,
  onEdit, 
  onRemove, 
  isHome, 
  totalPlayers,
  onPlayerTypeChange 
}) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      position: 'relative',
      mb: 1,
      backgroundColor: theme.palette.background.paper
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar src={player.avatar}>
              {player.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6">{player.name}</Typography>
          </Box>
          <Box>
            <IconButton 
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
            >
              <ArrowUpwardIcon />
            </IconButton>
            <IconButton 
              onClick={() => onMoveDown(index)}
              disabled={index === totalPlayers - 1}
            >
              <ArrowDownwardIcon />
            </IconButton>
            <IconButton onClick={() => onEdit(index)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onRemove(index)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  '&:hover': {
    borderColor: theme.palette.action.hover,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  gap: theme.spacing(1),
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: theme.palette.primary.main,
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.text.primary,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.action.hover,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(1),
  width: '100%',
  '& .MuiToggleButton-root': {
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
}));

const X01Setup = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser } = useAuth();
  
  // Player Settings
  const [players, setPlayers] = useState<Player[]>(() => {
    // Hvis der er en logget ind bruger, start med denne som første spiller
    if (currentUser) {
      return [
        { 
          id: currentUser.uid, 
          name: currentUser.displayName || 'User', 
          score: 501, 
          type: 'user',
          avatar: currentUser.photoURL || undefined 
        },
        { 
          id: 'guest-2', 
          name: '', 
          score: 501, 
          type: 'guest', 
          avatar: undefined 
        }
      ];
    }
    return [
      { id: 'guest-1', name: '', score: 501, type: 'guest', avatar: undefined },
      { id: 'guest-2', name: '', score: 501, type: 'guest', avatar: undefined }
    ];
  });
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<{index: number, name: string} | null>(null);
  
  // Game Settings
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    gameType: 501,
    matchFormat: 'first',
    sets: 1,
    legs: 3,
    formatType: 'legs',
    formatCount: 5,
    inMode: 'straight',
    outMode: 'double',
    checkoutRate: false
  });

  // Game settings
  const [startingScore, setStartingScore] = useState<number>(501);
  const [startingScoreDialogOpen, setStartingScoreDialogOpen] = useState(false);
  const [matchFormatDialogOpen, setMatchFormatDialogOpen] = useState(false);
  const [setsDialogOpen, setSetsDialogOpen] = useState(false);
  const [legsDialogOpen, setLegsDialogOpen] = useState(false);
  const [startingInDialogOpen, setStartingInDialogOpen] = useState(false);
  const [doubleOut, setDoubleOut] = useState<boolean>(true);
  const [startingIn, setStartingIn] = useState('straight');
  
  // Game options
  const [isTraining, setIsTraining] = useState(false);
  const [scoreAnnouncer, setScoreAnnouncer] = useState(false);
  const [randomStart, setRandomStart] = useState(false);
  
  // Checkout options
  const [showCheckout, setShowCheckout] = useState(true);
  const [useDoubles, setUseDoubles] = useState(true);

  // Dialog states
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [botDialogOpen, setBotDialogOpen] = useState(false);
  const [friendDialogOpen, setFriendDialogOpen] = useState(false);
  const [playerTypeDialogOpen, setPlayerTypeDialogOpen] = useState(false);

  // Out rules
  const [outRulesDialogOpen, setOutRulesDialogOpen] = useState(false);

  const startingScoreOptions = [
    { value: 101, label: '101' },
    { value: 170, label: '170' },
    { value: 301, label: '301' },
    { value: 501, label: '501' },
    { value: 701, label: '701' },
    { value: 1001, label: '1001' }
  ];

  const handleStartingScoreSelect = (value: number) => {
    setStartingScore(value);
    setGameSettings(prev => ({ ...prev, gameType: value }));
    // Opdater alle spilleres score
    setPlayers(currentPlayers => 
      currentPlayers.map(player => ({
        ...player,
        score: value
      }))
    );
    setStartingScoreDialogOpen(false);
  };

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
      const newPlayer: Player = {
        id: `guest-${Date.now()}`,
        name,
        score: gameSettings.gameType,
        type: 'guest',
        avatar: undefined
      };

      setPlayers(currentPlayers => {
        const newPlayers = [...currentPlayers];
        if (currentPlayers.length === 1) {
          newPlayers[2] = newPlayer;
        } else {
          newPlayers[selectedPlayer] = newPlayer;
        }
        return newPlayers;
      });
    }
    setGuestDialogOpen(false);
  };

  const handleLoginSuccess = (user: User) => {
    if (selectedPlayer !== null) {
      setPlayers(currentPlayers => {
        const newPlayers = [...currentPlayers];
        newPlayers[selectedPlayer] = {
          id: user.uid,
          name: user.displayName || 'User',
          score: gameSettings.gameType,
          type: 'user',
          avatar: user.photoURL || undefined
        };
        return newPlayers;
      });
    }
    setLoginDialogOpen(false);
  };

  const handleSelectBot = (difficulty: string) => {
    if (selectedPlayer !== null) {
      setPlayers(currentPlayers => {
        const newPlayers = [...currentPlayers];
        newPlayers[selectedPlayer] = {
          id: `bot-${Date.now()}`,
          name: `Bot (${difficulty})`,
          score: gameSettings.gameType,
          type: 'bot',
          botDifficulty: difficulty,
          avatar: undefined
        };
        return newPlayers;
      });
    }
    setBotDialogOpen(false);
  };

  const handleAddPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { 
        id: `guest-${Date.now()}`,
        name: '', 
        score: gameSettings.gameType, 
        type: 'guest',
        avatar: undefined
      }]);
    }
  };

  const handlePlayerTypeSelect = (type: PlayerType) => {
    setPlayerTypeDialogOpen(false);
    // Hvis det er den anden spiller, sæt selectedPlayer til position 2 (højre kolonne)
    setSelectedPlayer(players.length === 1 ? 2 : players.length);
    switch (type) {
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
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(currentPlayers => currentPlayers.filter((_, i) => i !== index));
  };

  const getRequiredWins = () => {
    if (gameSettings.matchFormat === 'first') return gameSettings.formatCount;
    return Math.ceil(gameSettings.formatCount / 2);
  };

  const handleStartGame = () => {
    if (players.every(player => player.name.trim())) {
      const gameConfig: GameConfig = {
        players: players.map(player => ({
          ...player,
          score: startingScore // Brug startingScore i stedet for gameType
        })),
        gameType: startingScore, // Brug startingScore her også
        startingScore: startingScore,
        matchFormat: gameSettings.matchFormat,
        sets: gameSettings.sets,
        legs: gameSettings.legs,
        legsPerSet: gameSettings.legs,
        inMode: gameSettings.inMode,
        outMode: gameSettings.outMode,
        isTraining,
        scoreAnnouncer,
        randomStart,
        showCheckout,
        useDoubles
      };
      
      navigate('/x01game', { state: { gameConfig } });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newPlayers = [...players];
      [newPlayers[index - 1], newPlayers[index]] = [newPlayers[index], newPlayers[index - 1]];
      setPlayers(newPlayers);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < players.length - 1) {
      const newPlayers = [...players];
      [newPlayers[index], newPlayers[index + 1]] = [newPlayers[index + 1], newPlayers[index]];
      setPlayers(newPlayers);
    }
  };

  const handleEditPlayer = (index: number) => {
    const player = players[index];
    if (player.type === 'guest') {
      setEditingPlayer({ index, name: player.name });
    }
  };

  const handleSavePlayerName = () => {
    if (editingPlayer) {
      setPlayers(currentPlayers => {
        const newPlayers = [...currentPlayers];
        newPlayers[editingPlayer.index] = {
          ...newPlayers[editingPlayer.index],
          name: editingPlayer.name
        };
        return newPlayers;
      });
      setEditingPlayer(null);
    }
  };

  const handleMatchFormatChange = (prev: GameSettings): GameSettings => ({ 
    ...prev, 
    matchFormat: 'first' as MatchFormat 
  });

  const handleSetsChange = (prev: GameSettings, value: number): GameSettings => ({ 
    ...prev, 
    sets: value 
  });

  const handleLegsChange = (prev: GameSettings, value: number): GameSettings => ({ 
    ...prev, 
    legs: value 
  });

  const handleInModeChange = (prev: GameSettings): GameSettings => ({ 
    ...prev, 
    inMode: 'straight' as 'straight' | 'double' | 'triple'
  });

  const handleOutModeChange = (prev: GameSettings): GameSettings => ({ 
    ...prev, 
    outMode: 'double' as 'double' | 'master' | 'straight'
  });

  return (
    <Box sx={{ 
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      p: 2,
      color: theme.palette.text.primary
    }}>
      <Container maxWidth="sm">
        <StyledPaper>
          {/* Header sektion */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Spilleropsætning
              </Typography>
            </Box>
            
            {players.length < 4 && (
              <Tooltip title="Tilføj spiller" arrow>
                <StyledButton
                  onClick={handleAddPlayer}
                  startIcon={<PersonAddIcon />}
                >
                  Tilføj spiller
                </StyledButton>
              </Tooltip>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            {players.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                index={index}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onEdit={handleEditPlayer}
                onRemove={handleRemovePlayer}
                isHome={index < Math.ceil(players.length / 2)}
                totalPlayers={players.length}
                onPlayerTypeChange={handlePlayerTypeChange}
              />
            ))}
          </Box>
        </StyledPaper>

        {/* Game Settings */}
        <StyledPaper>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}>
            <Typography sx={{ flex: 1 }}>Starting score</Typography>
            <Box sx={{ flex: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setStartingScoreDialogOpen(true)}
                fullWidth
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'space-between',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  py: 1
                }}
              >
                {startingScore}
              </Button>
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
              <Button
                variant="outlined"
                onClick={() => setMatchFormatDialogOpen(true)}
                fullWidth
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'space-between',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  py: 1
                }}
              >
                {gameSettings.matchFormat === 'first' ? 'First to' : 'Best of'}
              </Button>
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
              <Button
                variant="outlined"
                onClick={() => setSetsDialogOpen(true)}
                sx={{
                  flex: 1,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'space-between',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  py: 1
                }}
              >
                {`${gameSettings.sets} set${gameSettings.sets > 1 ? 's' : ''}`}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setLegsDialogOpen(true)}
                sx={{
                  flex: 1,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'space-between',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  py: 1
                }}
              >
                {`${gameSettings.legs} leg${gameSettings.legs > 1 ? 's' : ''}`}
              </Button>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}>
            <Typography sx={{ flex: 1 }}>In rules</Typography>
            <Box sx={{ flex: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setStartingInDialogOpen(true)}
                fullWidth
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'space-between',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  py: 1
                }}
              >
                {gameSettings.inMode === 'straight' ? 'Straight in' : 'Double in'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            mb: 2,
            gap: 2 
          }}>
            <Typography sx={{ flex: 1 }}>Out rules</Typography>
            <Box sx={{ flex: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setOutRulesDialogOpen(true)}
                fullWidth
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'space-between',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  py: 1,
                  mb: 2
                }}
              >
                {gameSettings.outMode === 'double' ? 'Double out' : 'Kommer snart'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            mb: 2,
            gap: 2 
          }}>
            <Typography sx={{ flex: 1 }}>Checkout options</Typography>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 2
              }}>
                <Typography>Checkout</Typography>
                <Switch 
                  checked={showCheckout}
                  onChange={(e) => setShowCheckout(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00875A',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00875A',
                    },
                  }}
                />
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  display: 'block',
                  textAlign: 'right',
                  mt: 0.5
                }}
              >
                show checkout popup
              </Typography>
            </Box>
          </Box>
        </StyledPaper>

        {/* Game Options */}
        <StyledPaper>
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
        </StyledPaper>

        {/* Start Game Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleStartGame}
          sx={{
            py: 2,
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            borderRadius: theme.shape.borderRadius * 2,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Let's Play Darts
        </Button>

        {/* Edit Player Name Dialog */}
        <Dialog 
          open={!!editingPlayer} 
          onClose={() => setEditingPlayer(null)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }
          }}
        >
          <DialogTitle>Edit Player Name</DialogTitle>
          <DialogContent>
            <StyledTextField
              autoFocus
              margin="dense"
              label="Player Name"
              type="text"
              fullWidth
              value={editingPlayer?.name || ''}
              onChange={(e) => setEditingPlayer(prev => prev ? {...prev, name: e.target.value} : null)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingPlayer(null)} sx={{ color: theme.palette.text.primary }}>
              Cancel
            </Button>
            <Button onClick={handleSavePlayerName} sx={{ color: theme.palette.primary.main }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Player Type Dialog */}
        <Dialog
          open={playerTypeDialogOpen}
          onClose={() => setPlayerTypeDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              minWidth: '300px'
            }
          }}
        >
          <DialogTitle>Vælg spillertype</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handlePlayerTypeSelect('login')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                textTransform: 'none',
                py: 1
              }}
            >
              Log ind
            </Button>
            <Button
              variant="outlined"
              onClick={() => handlePlayerTypeSelect('guest')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                textTransform: 'none',
                py: 1
              }}
            >
              Gæst
            </Button>
            <Button
              variant="outlined"
              onClick={() => handlePlayerTypeSelect('bot')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                textTransform: 'none',
                py: 1
              }}
            >
              Bot
            </Button>
            <Button
              variant="outlined"
              onClick={() => handlePlayerTypeSelect('friend')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                textTransform: 'none',
                py: 1
              }}
            >
              Ven
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPlayerTypeDialogOpen(false)} sx={{ color: 'white' }}>
              Annuller
            </Button>
          </DialogActions>
        </Dialog>

        {/* Starting Score Dialog */}
        <Dialog
          open={startingScoreDialogOpen}
          onClose={() => setStartingScoreDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              minWidth: '300px'
            }
          }}
        >
          <DialogTitle>Vælg start score</DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column'
            }}>
              {startingScoreOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => handleStartingScoreSelect(option.value)}
                  sx={{
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    ...(startingScore === option.value && {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                    }),
                    gap: 2
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: startingScore === option.value ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {startingScore === option.value && (
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: '#00875A'
                        }}
                      />
                    )}
                  </Box>
                  {option.label}
                </Button>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setStartingScoreDialogOpen(false)} 
              sx={{ color: 'white' }}
            >
              Annuller
            </Button>
            <Button 
              onClick={() => setStartingScoreDialogOpen(false)}
              sx={{ color: '#00875A' }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Match Format Dialog */}
        <Dialog
          open={matchFormatDialogOpen}
          onClose={() => setMatchFormatDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              minWidth: '300px'
            }
          }}
        >
          <DialogTitle>Vælg format</DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                onClick={() => {
                  setGameSettings(handleMatchFormatChange);
                  setMatchFormatDialogOpen(false);
                }}
                sx={{
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.matchFormat === 'first' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: gameSettings.matchFormat === 'first' ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {gameSettings.matchFormat === 'first' && (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#00875A'
                      }}
                    />
                  )}
                </Box>
                First to
              </Button>
              <Button
                onClick={() => {
                  setGameSettings(prev => ({ ...prev, matchFormat: 'best' }));
                  setMatchFormatDialogOpen(false);
                }}
                sx={{
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.matchFormat === 'best' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: gameSettings.matchFormat === 'best' ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {gameSettings.matchFormat === 'best' && (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#00875A'
                      }}
                    />
                  )}
                </Box>
                Best of
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMatchFormatDialogOpen(false)} sx={{ color: 'white' }}>
              Annuller
            </Button>
          </DialogActions>
        </Dialog>

        {/* Sets Dialog */}
        <Dialog
          open={setsDialogOpen}
          onClose={() => setSetsDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              minWidth: '300px'
            }
          }}
        >
          <DialogTitle>Vælg antal sets</DialogTitle>
          <DialogContent>
            <Box>
              <ToggleButtonGroup
                value={gameSettings.sets}
                exclusive
                onChange={(_, value) => value && setGameSettings(prev => ({ ...prev, sets: value }))}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 1,
                  width: '100%',
                  '& .MuiToggleButton-root': {
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(0, 135, 90, 0.2)',
                      color: '#00875A',
                      '&:hover': {
                        bgcolor: 'rgba(0, 135, 90, 0.3)',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <ToggleButton key={value} value={value}>
                    {value}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSetsDialogOpen(false)} sx={{ color: 'white' }}>
              Annuller
            </Button>
            <Button onClick={() => setSetsDialogOpen(false)} sx={{ color: '#00875A' }}>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Legs Dialog */}
        <Dialog
          open={legsDialogOpen}
          onClose={() => setLegsDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              minWidth: '300px'
            }
          }}
        >
          <DialogTitle>Vælg antal legs</DialogTitle>
          <DialogContent>
            <Box>
              <ToggleButtonGroup
                value={gameSettings.legs}
                exclusive
                onChange={(_, value) => value && setGameSettings(prev => ({ ...prev, legs: value }))}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 1,
                  width: '100%',
                  '& .MuiToggleButton-root': {
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(0, 135, 90, 0.2)',
                      color: '#00875A',
                      '&:hover': {
                        bgcolor: 'rgba(0, 135, 90, 0.3)',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => (
                  <ToggleButton key={value} value={value}>
                    {value}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLegsDialogOpen(false)} sx={{ color: 'white' }}>
              Annuller
            </Button>
            <Button onClick={() => setLegsDialogOpen(false)} sx={{ color: '#00875A' }}>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Starting In Dialog */}
        <Dialog
          open={startingInDialogOpen}
          onClose={() => setStartingInDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              minWidth: '300px'
            }
          }}
        >
          <DialogTitle>Vælg start regel</DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                onClick={() => {
                  setGameSettings(handleInModeChange);
                  setStartingInDialogOpen(false);
                }}
                sx={{
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.inMode === 'straight' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: gameSettings.inMode === 'straight' ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {gameSettings.inMode === 'straight' && (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#00875A'
                      }}
                    />
                  )}
                </Box>
                Straight in
              </Button>
              <Button
                onClick={() => {
                  setGameSettings(prev => ({ ...prev, inMode: 'double' }));
                  setStartingInDialogOpen(false);
                }}
                sx={{
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.inMode === 'double' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: gameSettings.inMode === 'double' ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {gameSettings.inMode === 'double' && (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#00875A'
                      }}
                    />
                  )}
                </Box>
                Double in
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStartingInDialogOpen(false)} sx={{ color: 'white' }}>
              Annuller
            </Button>
          </DialogActions>
        </Dialog>

        {/* Out Rules Dialog */}
        <Dialog
          open={outRulesDialogOpen}
          onClose={() => setOutRulesDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              minWidth: '300px'
            }
          }}
        >
          <DialogTitle>Vælg out regel</DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                onClick={() => {
                  setGameSettings(handleOutModeChange);
                  setOutRulesDialogOpen(false);
                }}
                sx={{
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.outMode === 'double' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: gameSettings.outMode === 'double' ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {gameSettings.outMode === 'double' && (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#00875A'
                      }}
                    />
                  )}
                </Box>
                Double out
              </Button>
              <Button
                disabled
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 3,
                  py: 1.5,
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                  Master out
                </Box>
                <Typography variant="caption" sx={{ color: '#00875A' }}>
                  Kommer snart
                </Typography>
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOutRulesDialogOpen(false)} sx={{ color: 'white' }}>
              Annuller
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialogs */}
        <LoginDialog 
          open={loginDialogOpen} 
          onClose={() => setLoginDialogOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
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
          onSelectFriend={(friend) => {
            if (selectedPlayer !== null) {
              setPlayers(currentPlayers => {
                const newPlayers = [...currentPlayers];
                newPlayers[selectedPlayer] = {
                  id: friend.id,
                  name: friend.name,
                  score: gameSettings.gameType,
                  type: 'friend',
                  avatar: friend.avatar
                };
                return newPlayers;
              });
            }
            setFriendDialogOpen(false);
          }}
        />
      </Container>
    </Box>
  );
};

export default X01Setup; 