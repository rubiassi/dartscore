import { useState } from 'react';
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
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginDialog from '../components/dialogs/LoginDialog';
import GuestDialog from '../components/dialogs/GuestDialog';
import BotDialog from '../components/dialogs/BotDialog';
import FriendDialog from '../components/dialogs/FriendDialog';
import { GameConfig, Player, PlayerType } from '../types/game';
import NavigationLayout from '../components/layout/NavigationLayout';
import AddIcon from '@mui/icons-material/Add';

// Interfaces og typer
type MatchFormat = 'first' | 'best';

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
        }
      ];
    }
    return [];
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
    checkoutRate: true
  });

  // Game settings
  const [startingScore, setStartingScore] = useState<number>(501);
  const [startingScoreDialogOpen, setStartingScoreDialogOpen] = useState(false);
  const [matchFormatDialogOpen, setMatchFormatDialogOpen] = useState(false);
  const [setsDialogOpen, setSetsDialogOpen] = useState(false);
  const [legsDialogOpen, setLegsDialogOpen] = useState(false);
  const [startingInDialogOpen, setStartingInDialogOpen] = useState(false);
  
  // Game options
  const [isTraining, setIsTraining] = useState(false);
  const [scoreAnnouncer, setScoreAnnouncer] = useState(false);
  
  // Checkout options
  const [showCheckout, setShowCheckout] = useState(true);

  // Dialog states
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [botDialogOpen, setBotDialogOpen] = useState(false);
  const [friendDialogOpen, setFriendDialogOpen] = useState(false);
  const [playerTypeDialogOpen, setPlayerTypeDialogOpen] = useState(false);

  // Out rules
  const [outRulesDialogOpen, setOutRulesDialogOpen] = useState(false);

  // Tilføj state for aktiv spiltype
  const [gameType, setGameType] = useState<'singles' | 'teams'>('singles');

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
        // Hvis der kun er én spiller, tilføj den nye spiller som nummer 2
        if (currentPlayers.length === 1) {
          newPlayers.push(newPlayer);
        } else {
          // Ellers erstat den valgte position med den nye spiller
          newPlayers[selectedPlayer] = newPlayer;
        }
        return newPlayers;
      });
    }
    setGuestDialogOpen(false);
    setSelectedPlayer(null);
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
      const gameConfig: GameConfig = {
        players,
        gameType: gameSettings.gameType,
        startingScore: gameSettings.gameType,
        matchFormat: gameSettings.matchFormat,
        sets: gameSettings.formatType === 'sets' ? gameSettings.formatCount : 1,
        legs: gameSettings.formatType === 'sets' ? 5 : gameSettings.formatCount,
        legsPerSet: gameSettings.formatType === 'sets' ? 5 : 1,
        inMode: gameSettings.inMode,
        outMode: gameSettings.outMode,
        isTraining,
        scoreAnnouncer,
        randomStart: false,
        showCheckout: gameSettings.checkoutRate,
        useDoubles: gameSettings.outMode === 'double',
        formatType: gameSettings.formatType,
        formatCount: gameSettings.formatCount
      };
      
      // Log kampregler
      console.log('Kampregler der sendes med:');
      console.log('Match Format:', gameConfig.matchFormat);
      console.log('Format Type:', gameConfig.formatType);
      console.log('Format Count:', gameConfig.formatCount);
      console.log('Antal Sets:', gameConfig.sets);
      console.log('Antal Legs:', gameConfig.legs);
      console.log('Legs per Set:', gameConfig.legsPerSet);
      console.log('In Mode:', gameConfig.inMode);
      console.log('Out Mode:', gameConfig.outMode);
      console.log('Starting Score:', gameConfig.startingScore);
      console.log('Use Doubles:', gameConfig.useDoubles);
      console.log('Show Checkout:', gameConfig.showCheckout);
      console.log('Training Mode:', gameConfig.isTraining);
      console.log('Score Announcer:', gameConfig.scoreAnnouncer);
      
      navigate('/x01game', { state: { gameConfig } });
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

  const handleInModeChange = (prev: GameSettings): GameSettings => ({ 
    ...prev, 
    inMode: 'straight' as 'straight' | 'double' | 'triple'
  });

  const handleOutModeChange = (prev: GameSettings): GameSettings => ({ 
    ...prev, 
    outMode: 'double' as 'double' | 'master' | 'straight'
  });

  // New state for format count dialog
  const [formatCountDialogOpen, setFormatCountDialogOpen] = useState(false);

  return (
    <NavigationLayout>
    <Box sx={{ 
      bgcolor: theme.palette.background.default,
      minHeight: '100%',
      height: '100%',
      p: { xs: 1, sm: 2 },
      color: theme.palette.text.primary,
      overflow: 'auto'
    }}>
      <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2 }, height: '100%' }}>
        <StyledPaper sx={{ mb: { xs: 1, sm: 2 } }}>
          {/* Header sektion */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
              mb: 2,
              mx: -3,
              mt: -3,
              px: 3,
              py: 2,
              borderTopLeftRadius: theme => theme.shape.borderRadius * 2,
              borderTopRightRadius: theme => theme.shape.borderRadius * 2,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)'
              }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupsIcon sx={{ 
                  color: 'white',
                  filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))',
                  fontSize: '1.5rem'
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 500,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  fontSize: '1.1rem'
                }}>
                Spilleropsætning
              </Typography>
            </Box>
            
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setGameType('singles')}
                  sx={{
                    color: 'white',
                    borderColor: gameType === 'singles' ? 'white' : 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: gameType === 'singles' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    backdropFilter: 'blur(4px)',
                    py: 0.5,
                    px: 1,
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    lineHeight: 1
                  }}
                  startIcon={<PersonIcon sx={{ fontSize: '1rem', mr: 0.5 }} />}
                >
                  Single Players
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setGameType('teams')}
                  sx={{
                    color: 'white',
                    borderColor: gameType === 'teams' ? 'white' : 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: gameType === 'teams' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    backdropFilter: 'blur(4px)',
                    py: 0.5,
                    px: 1,
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    lineHeight: 1
                  }}
                  startIcon={<GroupsIcon sx={{ fontSize: '1rem', mr: 0.5 }} />}
                >
                  Teams
                </Button>
              </Box>
          </Box>

            {/* Player Grid */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {gameType === 'singles' ? (
                // Singles Layout
                <>
                  {/* Player 1 Section */}
                  <Grid item xs={12} md={5.4}>
                    <Card sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      height: '100%'
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={players[0]?.avatar}>
                            {players[0]?.name?.[0] || 'G'}
                          </Avatar>
                          <Typography variant="h6">
                            {players[0]?.name || 'Guest'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* VS Section */}
                  <Grid item xs={12} md={1.2} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(4px)',
                      color: theme.palette.primary.main,
                      fontWeight: 900,
                      fontSize: '1rem',
                      fontFamily: 'arial',
                      position: 'relative',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      VS
                    </Box>
                  </Grid>

                  {/* Player 2 Section */}
                  <Grid item xs={12} md={5.4}>
                    {players[1] ? (
                      <Card sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        height: '100%',
                        position: 'relative'
                      }}>
                        <IconButton
                          onClick={() => handleRemovePlayer(1)}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              color: 'white',
                              bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={players[1]?.avatar}>
                              {players[1]?.name?.[0] || 'G'}
                            </Avatar>
                            <Typography variant="h6">
                              {players[1]?.name || 'Guest'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                      onClick={() => {
                        setSelectedPlayer(1);
                        setPlayerTypeDialogOpen(true);
                      }}
                      >
                        <CardContent sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <AddIcon sx={{ fontSize: '2rem' }} />
                          <Typography>
                            Tilføj Modstander
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </Grid>
                </>
              ) : (
                // Teams Layout
                <>
                  {/* Team 1 Section */}
                  <Grid item xs={12} md={5.4}>
                    <Grid container spacing={2}>
                      {/* Team 1 Player 1 */}
                      <Grid item xs={12}>
                        <Card sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          height: '100%'
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar src={players[0]?.avatar}>
                                {players[0]?.name?.[0] || 'G'}
                              </Avatar>
                              <Typography variant="h6">
                                {players[0]?.name || 'Guest'}
                              </Typography>
          </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      {/* Team 1 Player 2 */}
                      <Grid item xs={12}>
                        {players[1] ? (
                          <Card sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            height: '100%'
                          }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={players[1]?.avatar}>
                                  {players[1]?.name?.[0] || 'G'}
                                </Avatar>
                                <Typography variant="h6">
                                  {players[1]?.name || 'Guest'}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                          onClick={() => {
                            setSelectedPlayer(1);
                            setPlayerTypeDialogOpen(true);
                          }}
                          >
                            <CardContent sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <AddIcon sx={{ fontSize: '2rem' }} />
                              <Typography>
                                Tilføj Medspiller
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* VS Section */}
                  <Grid item xs={12} md={1.2} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(4px)',
                      color: theme.palette.primary.main,
                      fontWeight: 900,
                      fontSize: '1rem',
                      fontFamily: 'arial',
                      position: 'relative',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      VS
          </Box>
                  </Grid>

                  {/* Team 2 Section */}
                  <Grid item xs={12} md={5.4}>
                    <Grid container spacing={2}>
                      {/* Team 2 Player 1 */}
                      <Grid item xs={12}>
                        {players[2] ? (
                          <Card sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            height: '100%'
                          }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={players[2]?.avatar}>
                                  {players[2]?.name?.[0] || 'G'}
                                </Avatar>
                                <Typography variant="h6">
                                  {players[2]?.name || 'Guest'}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                          onClick={() => {
                            setSelectedPlayer(2);
                            setPlayerTypeDialogOpen(true);
                          }}
                          >
                            <CardContent sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <AddIcon sx={{ fontSize: '2rem' }} />
                              <Typography>
                                Tilføj Medspiller
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Grid>
                      {/* Team 2 Player 2 */}
                      <Grid item xs={12}>
                        {players[3] ? (
                          <Card sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            height: '100%'
                          }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={players[3]?.avatar}>
                                  {players[3]?.name?.[0] || 'G'}
                                </Avatar>
                                <Typography variant="h6">
                                  {players[3]?.name || 'Guest'}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                          onClick={() => {
                            setSelectedPlayer(3);
                            setPlayerTypeDialogOpen(true);
                          }}
                          >
                            <CardContent sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <AddIcon sx={{ fontSize: '2rem' }} />
                              <Typography>
                                Tilføj Medspiller
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
        </StyledPaper>

        {/* Game Settings */}
        <StyledPaper sx={{ mb: { xs: 1, sm: 2 } }}>
            {/* Header sektion */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2,
              mx: -3,
              mt: -3,
              px: 3,
              py: 2,
              borderTopLeftRadius: theme => theme.shape.borderRadius * 2,
              borderTopRightRadius: theme => theme.shape.borderRadius * 2,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon sx={{ 
                  color: 'white',
                  filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))',
                  fontSize: '1.5rem'
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 500,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  fontSize: '1.1rem'
                }}>
                  Spilopsætning
                </Typography>
              </Box>
            </Box>

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
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'space-between',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  py: 1,
                  height: 40,
                  fontSize: '0.875rem'
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
            <Typography sx={{ flex: 1 }}>Match format</Typography>
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              gap: 1
            }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setGameSettings(prev => ({ ...prev, matchFormat: 'first' }));
                }}
                sx={{
                  flex: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: gameSettings.matchFormat === 'first' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: gameSettings.matchFormat === 'first' ? 2 : 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.matchFormat === 'first' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  textTransform: 'none',
                  height: 40,
                  fontSize: '0.875rem'
                }}
              >
                First to
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setGameSettings(prev => ({ ...prev, matchFormat: 'best' }));
                }}
                sx={{
                  flex: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: gameSettings.matchFormat === 'best' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: gameSettings.matchFormat === 'best' ? 2 : 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.matchFormat === 'best' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  textTransform: 'none',
                  height: 40,
                  fontSize: '0.875rem'
                }}
              >
                Best of
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
                onClick={() => setGameSettings(prev => ({ ...prev, formatType: 'sets' }))}
                sx={{
                  width: 100,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: gameSettings.formatType === 'sets' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: gameSettings.formatType === 'sets' ? 2 : 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.formatType === 'sets' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  textTransform: 'none',
                  height: 40,
                  fontSize: '0.875rem'
                }}
              >
                Sets
              </Button>
              <Button
                variant="outlined"
                onClick={() => setFormatCountDialogOpen(true)}
                sx={{
                  width: 60,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  height: 40,
                  fontSize: '0.875rem'
                }}
              >
                {gameSettings.formatCount}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setGameSettings(prev => ({ ...prev, formatType: 'legs' }))}
                sx={{
                  width: 100,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: gameSettings.formatType === 'legs' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: gameSettings.formatType === 'legs' ? 2 : 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.formatType === 'legs' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  textTransform: 'none',
                  height: 40,
                  fontSize: '0.875rem'
                }}
              >
                Legs
              </Button>
            </Box>
          </Box>

          {/* Format Count Dialog */}
          <Dialog
            open={formatCountDialogOpen}
            onClose={() => setFormatCountDialogOpen(false)}
            PaperProps={{
              sx: {
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                width: '280px'
              }
            }}
          >
            <DialogTitle>Vælg antal {gameSettings.formatType === 'sets' ? 'sets' : 'legs'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
                p: 2
              }}>
                {Array.from({ length: 21 }, (_, i) => i + 1).map((number) => (
                  <Button
                    key={number}
                    onClick={() => {
                      setGameSettings(prev => ({ 
                        ...prev, 
                        formatCount: number,
                        sets: prev.formatType === 'sets' ? number : prev.sets,
                        legs: prev.formatType === 'legs' ? number : prev.legs
                      }));
                      setFormatCountDialogOpen(false);
                    }}
                    sx={{
                      height: 52,
                      width: '100%',
                      fontSize: '1.1rem',
                      color: 'white',
                      borderColor: gameSettings.formatCount === number ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                      bgcolor: gameSettings.formatCount === number ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '@media (min-width: 768px)': {
                        padding: '1rem 2.5rem',
                      }
                    }}
                  >
                    {number}
                  </Button>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFormatCountDialogOpen(false)} sx={{ color: 'white' }}>
                Annuller
              </Button>
            </DialogActions>
          </Dialog>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Typography sx={{ 
              flex: 1,
              minWidth: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>In rules</Typography>
            <Box sx={{ 
              display: 'flex',
              gap: 1,
              width: { xs: '100%', sm: 292 },
              justifyContent: { xs: 'space-between', sm: 'flex-end' }
            }}>
              <Button
                variant="outlined"
                onClick={() => setGameSettings(prev => ({ ...prev, inMode: 'straight' }))}
                sx={{
                  flex: { xs: 1, sm: 'none' },
                  width: { sm: 140 },
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: gameSettings.inMode === 'straight' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: gameSettings.inMode === 'straight' ? 2 : 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.inMode === 'straight' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  textTransform: 'none',
                  height: 40,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Straight
              </Button>
              <Button
                variant="outlined"
                onClick={() => setGameSettings(prev => ({ ...prev, inMode: 'double' }))}
                sx={{
                  flex: { xs: 1, sm: 'none' },
                  width: { sm: 140 },
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: gameSettings.inMode === 'double' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: gameSettings.inMode === 'double' ? 2 : 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.inMode === 'double' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  textTransform: 'none',
                  height: 40,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Double
              </Button>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Typography sx={{ 
              flex: 1,
              minWidth: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>Out rules</Typography>
            <Box sx={{ 
              display: 'flex',
              gap: 1,
              width: { xs: '100%', sm: 292 },
              justifyContent: { xs: 'space-between', sm: 'flex-end' }
            }}>
              <Button
                variant="outlined"
                onClick={() => setGameSettings(prev => ({ ...prev, outMode: 'straight' }))}
                sx={{
                  flex: { xs: 1, sm: 'none' },
                  width: { sm: 85 },
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: gameSettings.outMode === 'straight' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: gameSettings.outMode === 'straight' ? 2 : 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.outMode === 'straight' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  textTransform: 'none',
                  height: 40,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Straight
              </Button>
              <Button
                variant="outlined"
                onClick={() => setGameSettings(prev => ({ ...prev, outMode: 'double' }))}
                sx={{
                  flex: { xs: 1, sm: 'none' },
                  width: { sm: 85 },
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: gameSettings.outMode === 'double' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: gameSettings.outMode === 'double' ? 2 : 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.outMode === 'double' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  textTransform: 'none',
                  height: 40,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Double
              </Button>
              <Button
                variant="outlined"
                onClick={() => setGameSettings(prev => ({ ...prev, outMode: 'master' }))}
                sx={{
                  flex: { xs: 1, sm: 'none' },
                  width: { sm: 85 },
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  borderColor: gameSettings.outMode === 'master' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: gameSettings.outMode === 'master' ? 2 : 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(gameSettings.outMode === 'master' && {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  }),
                  textTransform: 'none',
                  height: 40,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Master
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
        <StyledPaper sx={{ mb: { xs: 1, sm: 2 } }}>
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
            bgcolor: '#00875A',
            '&:hover': {
              bgcolor: '#006644',
            },
            borderRadius: theme.shape.borderRadius * 2,
            textTransform: 'none',
            fontSize: '1rem',
            mb: { xs: 1, sm: 2 }
          }}
        >
          Start game
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
    </NavigationLayout>
  );
};

export default X01Setup; 