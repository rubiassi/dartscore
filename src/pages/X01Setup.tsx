import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
import { GameConfig } from '../types/game';
import SettingsIcon from '@mui/icons-material/Settings';

interface Player {
  id: string;
  name: string;
  type: PlayerType;
  avatar?: string;
  botDifficulty?: string;
}

type PlayerType = 'login' | 'guest' | 'bot' | 'friend';
type MatchFormat = 'first' | 'best';
type Position = 0 | 1 | 2 | 3;
type SwapDirection = 'next' | 'previous' | 'across';

const isBot = (type: PlayerType): type is 'bot' => type === 'bot';

// Tilføj ItemTypes konstant
const ItemTypes = {
  PLAYER_CARD: 'playerCard'
};

interface PlayerCardProps {
  player: Player;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  isHome: boolean;
  totalPlayers: number;
  onPlayerTypeChange: (index: number, type: PlayerType) => void;
}

// PlayerCard komponent med drag and drop
const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  index, 
  moveCard, 
  onEdit, 
  onRemove, 
  isHome, 
  totalPlayers,
  onPlayerTypeChange 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLAYER_CARD,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [index]);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PLAYER_CARD,
    hover: (item: { index: number }) => {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  }), [index, moveCard]);

  // Kombinér drag og drop refs
  drag(drop(ref));

  // Beregn card højde baseret på antal spillere (50% højere)
  const cardHeight = totalPlayers <= 2 
    ? { xs: '330px', sm: '375px', md: '420px' }  // 50% højere for 2 spillere
    : { xs: '270px', sm: '300px', md: '330px' }; // 50% højere for 3-4 spillere

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card 
        sx={{ 
          bgcolor: index === 0 ? 'rgba(0, 135, 90, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          color: 'white',
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          height: cardHeight,
          cursor: 'move',
          '&:hover': {
            bgcolor: index === 0 ? 'rgba(0, 135, 90, 0.15)' : 'rgba(255, 255, 255, 0.08)',
          }
        }}
      >
        <CardContent sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          p: { xs: 1, sm: 1.5, md: 2 },
          '&:last-child': { pb: { xs: 1, sm: 1.5, md: 2 } }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
            mb: { xs: 1, sm: 2 }
          }}>
            <Avatar 
              sx={{ 
                bgcolor: index === 0 ? '#00875A' : 'rgba(255, 255, 255, 0.1)',
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 }
              }}
            >
              {player.name.charAt(0)}
            </Avatar>
            <Box sx={{ 
              flex: 1,
              minWidth: 0
            }}>
              <Box>
                <Typography 
                  component="span" 
                  sx={{ 
                    color: '#00875A',
                    fontSize: '0.75rem',
                    display: 'block'
                  }}
                >
                  {index === 0 ? 'SPILLER 1' : index === 1 ? 'SPILLER 2' : `SPILLER ${index + 1}`}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {player.name}
                </Typography>
                {player.type === 'login' && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Rang: #123 • Kampe: 45 • Avg: 45.5
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {player.type === 'guest' && (
                <IconButton 
                  size="small"
                  onClick={() => onEdit(index)}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              {totalPlayers > 1 && (
                <IconButton 
                  size="small"
                  onClick={() => onRemove(index)}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1,
            mt: 'auto'
          }}>
            {player.type === 'login' ? (
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                mb: 1
              }}>
                <Box sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.05)', 
                  p: { xs: 0.75, sm: 1 }, 
                  borderRadius: 1,
                  flex: '1 0 auto',
                  minWidth: { xs: '45%', sm: 'auto' }
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  >
                    Højeste checkout
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#00875A',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    167
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.05)', 
                  p: { xs: 0.75, sm: 1 }, 
                  borderRadius: 1,
                  flex: '1 0 auto',
                  minWidth: { xs: '45%', sm: 'auto' }
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  >
                    Bedste leg
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#00875A',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    15
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ flex: 1 }} />
            )}
            {index === 0 ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onPlayerTypeChange(index, 'login')}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    bgcolor: player.type === 'login' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    textTransform: 'none'
                  }}
                >
                  Log ind
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onPlayerTypeChange(index, 'guest')}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    bgcolor: player.type === 'guest' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    textTransform: 'none'
                  }}
                >
                  Gæst
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => onPlayerTypeChange(index, player.type)}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                  },
                  textTransform: 'none'
                }}
              >
                {player.type === 'login' ? 'Log ind' :
                 player.type === 'guest' ? 'Gæst' : ''}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
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
  
  // Player Settings
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player 1', type: 'guest' }
  ]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<{index: number, name: string} | null>(null);
  
  // Game Settings
  const [gameType, setGameType] = useState<number>(501);
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('first');
  const [sets, setSets] = useState<number>(1);
  const [legs, setLegs] = useState<number>(3);
  const [formatType, setFormatType] = useState<'legs' | 'sets'>('legs');
  const [formatCount, setFormatCount] = useState(5);
  const [inMode, setInMode] = useState<'straight' | 'double' | 'triple'>('straight');
  const [outMode, setOutMode] = useState<'double' | 'master' | 'straight'>('double');
  const [checkoutRate, setCheckoutRate] = useState(false);

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
      const newPlayer = {
        id: String(Date.now()),
        name,
        type: 'guest' as PlayerType
      };

      setPlayers(currentPlayers => {
        const newPlayers = [...currentPlayers];
        // Hvis det er den anden spiller, indsæt i position 2
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

  const handleSelectBot = (difficulty: string) => {
    if (selectedPlayer !== null) {
      setPlayers(currentPlayers => {
        const newPlayers = [...currentPlayers];
        newPlayers[selectedPlayer] = {
          ...newPlayers[selectedPlayer],
          name: `Bot (${difficulty})`,
          type: 'bot',
          botDifficulty: difficulty
        };
        return newPlayers;
      });
    }
    setBotDialogOpen(false);
  };

  const handleAddPlayer = () => {
    if (players.length < 4) {
      setPlayerTypeDialogOpen(true);
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
    if (matchFormat === 'first') return formatCount;
    return Math.ceil(formatCount / 2);
  };

  const handleStartGame = () => {
    // Validér at der er mindst 2 spillere
    if (players.length < 2) {
      alert('Der skal være mindst 2 spillere for at starte spillet');
      return;
    }

    const gameConfig: GameConfig = {
      // Spillere
      players: players.map(player => ({
        id: player.id,
        name: player.name,
        type: player.type,
        botDifficulty: player.botDifficulty,
        avatar: player.avatar
      })),
      
      // Spil indstillinger
      startingScore: gameType,
      matchFormat: matchFormat,
      sets: sets > 1 ? sets : 1, // Kun brug sets hvis større end 1
      legs: sets > 1 ? legs : formatCount, // Brug legs som format hvis sets = 1
      startingIn: inMode,
      outMode: outMode,
      legsPerSet: legs,
      
      // Spil muligheder
      isTraining,
      scoreAnnouncer,
      randomStart,
      
      // Checkout muligheder
      showCheckout,
      useDoubles: outMode === 'double',
    };

    navigate('/x01game', { state: gameConfig });
  };

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const newPlayers = [...players];
    const draggedPlayer = newPlayers[dragIndex];
    
    // Hvis det er den anden spiller der tilføjes, placer den i højre kolonne
    if (newPlayers.length === 2 && dragIndex === 1) {
      newPlayers.splice(dragIndex, 1);
      newPlayers.splice(2, 0, draggedPlayer);
    } else {
      newPlayers.splice(dragIndex, 1);
      newPlayers.splice(hoverIndex, 0, draggedPlayer);
    }
    
    setPlayers(newPlayers);
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

  return (
    <Box sx={{ 
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      p: 2,
      color: theme.palette.text.primary
    }}>
      <Container maxWidth="md">
        <DndProvider backend={HTML5Backend}>
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

            <Box sx={{ 
              display: 'flex',
              gap: { xs: 1, sm: 1.5, md: 2 },
              height: '100%',
              minHeight: { xs: '320px', sm: '360px' },
              mx: 'auto',
              maxWidth: '100%',
              pt: 5
            }}>
              {/* Venstre kolonne */}
              <Box sx={{ 
                flex: '1 1 0',
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1, sm: 1.5, md: 2 },
                height: '100%',
                justifyContent: 'center',
                minWidth: 0 // Vigtigt for at forhindre overflow
              }}>
                {players.slice(0, 1).map((player, index) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    index={index}
                    moveCard={moveCard}
                    onEdit={handleEditPlayer}
                    onRemove={handleRemovePlayer}
                    isHome={true}
                    totalPlayers={players.length}
                    onPlayerTypeChange={handlePlayerTypeChange}
                  />
                ))}
              </Box>

              {/* Midter kolonne */}
              <Box sx={{ 
                flex: '0 0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 1, sm: 2 }
              }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: '50px', sm: '60px', md: '80px' },
                    height: { xs: '50px', sm: '60px', md: '80px' },
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: '#00875A'
                  }}
                >
                  <SportsKabaddiIcon sx={{ fontSize: { xs: 24, sm: 30, md: 40 } }} />
                </Box>
              </Box>

              {/* Højre kolonne */}
              <Box sx={{ 
                flex: '1 1 0',
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1, sm: 1.5, md: 2 },
                height: '100%',
                justifyContent: 'center',
                minWidth: 0 // Vigtigt for at forhindre overflow
              }}>
                {players.slice(1).map((player, index) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    index={index + 1}
                    moveCard={moveCard}
                    onEdit={(i) => handleEditPlayer(i + 1)}
                    onRemove={(i) => handleRemovePlayer(i + 1)}
                    isHome={false}
                    totalPlayers={players.length}
                    onPlayerTypeChange={handlePlayerTypeChange}
                  />
                ))}
              </Box>
            </Box>

            {players.length < 4 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center', 
                mt: { xs: 1, sm: 2 },
                gap: 2
              }}>
                <Typography>Random player start</Typography>
                <Switch 
                  checked={randomStart}
                  onChange={(e) => setRandomStart(e.target.checked)}
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
            )}
          </StyledPaper>
        </DndProvider>

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
                {matchFormat === 'first' ? 'First to' : 'Best of'}
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
                {`${sets} set${sets > 1 ? 's' : ''}`}
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
                {`${legs} leg${legs > 1 ? 's' : ''}`}
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
                {startingIn === 'straight' ? 'Straight in' : 'Double in'}
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
                {outMode === 'double' ? 'Double out' : 'Kommer snart'}
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
                  setMatchFormat('first');
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
                  ...(matchFormat === 'first' && {
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
                    borderColor: matchFormat === 'first' ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {matchFormat === 'first' && (
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
                  setMatchFormat('best');
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
                  ...(matchFormat === 'best' && {
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
                    borderColor: matchFormat === 'best' ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {matchFormat === 'best' && (
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
                value={sets}
                exclusive
                onChange={(_, value) => value && setSets(value)}
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
                value={legs}
                exclusive
                onChange={(_, value) => value && setLegs(value)}
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
                  setStartingIn('straight');
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
                  ...(startingIn === 'straight' && {
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
                    borderColor: startingIn === 'straight' ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {startingIn === 'straight' && (
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
                  setStartingIn('double');
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
                  ...(startingIn === 'double' && {
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
                    borderColor: startingIn === 'double' ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {startingIn === 'double' && (
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
                  setOutMode('double');
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
                  ...(outMode === 'double' && {
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
                    borderColor: outMode === 'double' ? '#00875A' : 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {outMode === 'double' && (
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