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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';

const X01Setup = () => {
  const navigate = useNavigate();
  
  // Player Settings
  const [players, setPlayers] = useState(['']);
  const [isTeamMode, setIsTeamMode] = useState(false);
  const [vsDartbot, setVsDartbot] = useState(false);
  
  // Game Settings
  const [gameType, setGameType] = useState<number>(501);
  const [matchFormat, setMatchFormat] = useState<'bestOf' | 'firstTo'>('bestOf');
  const [formatType, setFormatType] = useState<'legs' | 'sets'>('legs');
  const [formatCount, setFormatCount] = useState(5);
  const [inMode, setInMode] = useState('straight');
  const [outMode, setOutMode] = useState('double');
  const [checkoutRate, setCheckoutRate] = useState(false);

  const handleAddPlayer = () => {
    setPlayers([...players, '']);
  };

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleRemovePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  const getRequiredWins = () => {
    if (matchFormat === 'firstTo') return formatCount;
    return Math.ceil(formatCount / 2);
  };

  const handleStartGame = () => {
    const gameConfig = {
      gameType,
      players: players.filter(player => player.trim() !== ''),
      matchFormat,
      formatType,
      formatCount,
      requiredWins: getRequiredWins(),
      inMode,
      outMode,
      checkoutRate,
      vsDartbot
    };
    navigate('/x01game', { state: gameConfig });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Player Details Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Player Details</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={vsDartbot}
                  onChange={(e) => setVsDartbot(e.target.checked)}
                />
              }
              label="vs. Dartbot"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={isTeamMode ? 'teams' : 'single'}
              exclusive
              onChange={(_, value) => value && setIsTeamMode(value === 'teams')}
              fullWidth
            >
              <ToggleButton value="single">
                <PersonIcon sx={{ mr: 1 }} />
                Single Players
              </ToggleButton>
              <ToggleButton value="teams">
                <GroupsIcon sx={{ mr: 1 }} />
                Teams
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ mb: 2 }}>
            {players.map((player, index) => (
              <Box key={index} sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label={`${isTeamMode ? 'Team' : 'Player'} ${index + 1}`}
                  value={player}
                  onChange={(e) => handlePlayerChange(index, e.target.value)}
                />
                {players.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemovePlayer(index)}
                  >
                    Fjern
                  </Button>
                )}
              </Box>
            ))}
          </Box>

          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            fullWidth
            onClick={handleAddPlayer}
          >
            Tilføj {isTeamMode ? 'Team' : 'Spiller'}
          </Button>
        </Paper>

        {/* Game Settings Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Game Settings
          </Typography>

          {/* Match Format Controls */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Match Format
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <ToggleButtonGroup
                  value={matchFormat}
                  exclusive
                  onChange={(_, value) => value && setMatchFormat(value)}
                  fullWidth
                  size="small"
                >
                  <ToggleButton value="bestOf">
                    Best of
                  </ToggleButton>
                  <ToggleButton value="firstTo">
                    First to
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={6}>
                <ToggleButtonGroup
                  value={formatType}
                  exclusive
                  onChange={(_, value) => value && setFormatType(value)}
                  fullWidth
                  size="small"
                >
                  <ToggleButton value="legs">
                    Legs
                  </ToggleButton>
                  <ToggleButton value="sets">
                    Sets
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
            
            <Box sx={{ px: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                  <Slider
                    value={formatCount}
                    onChange={(_, value) => setFormatCount(value as number)}
                    step={2}
                    marks
                    min={1}
                    max={11}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    value={formatCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setFormatCount(value);
                      }
                    }}
                    type="number"
                    size="small"
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {matchFormat === 'bestOf' 
                ? `First to ${getRequiredWins()} ${formatType}`
                : `Play to ${formatCount} ${formatType}`}
            </Typography>
          </Box>

          {/* X01 Type Selection */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[301, 501, 701].map((type) => (
              <Grid item xs={4} key={type}>
                <Button
                  variant={gameType === type ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => setGameType(type)}
                >
                  {type}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* In/Out Options */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Button
                variant={inMode === 'straight' ? "contained" : "outlined"}
                fullWidth
                onClick={() => setInMode('straight')}
              >
                Straight In
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant={inMode === 'double' ? "contained" : "outlined"}
                fullWidth
                onClick={() => setInMode('double')}
              >
                Double In
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant={inMode === 'master' ? "contained" : "outlined"}
                fullWidth
                onClick={() => setInMode('master')}
              >
                Master In
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Button
                variant={outMode === 'straight' ? "contained" : "outlined"}
                fullWidth
                onClick={() => setOutMode('straight')}
              >
                Straight Out
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant={outMode === 'double' ? "contained" : "outlined"}
                fullWidth
                onClick={() => setOutMode('double')}
              >
                Double Out
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant={outMode === 'master' ? "contained" : "outlined"}
                fullWidth
                onClick={() => setOutMode('master')}
              >
                Master Out
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography>Checkout rate</Typography>
            <Switch
              checked={checkoutRate}
              onChange={(e) => setCheckoutRate(e.target.checked)}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleStartGame}
            disabled={!players.some(p => p.trim())}
          >
            Start game
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default X01Setup; 