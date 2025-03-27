import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Avatar,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Divider,
  Badge,
  Card,
  CardContent,
  Tooltip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import NavigationLayout from '../components/layout/NavigationLayout';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TranslateIcon from '@mui/icons-material/Translate';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { alpha, darken } from '@mui/material/styles';
import { keyframes } from '@mui/system';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

// Mock data - Dette skal erstattes med rigtig data fra Firebase
const mockUserStats = {
  memberSince: '2024-01-15',
  bio: 'Passioneret dartspiller med fokus på præcision og konstant forbedring',
  favoriteGameType: 'X01',
  averageScore: 65.5,
  highestCheckout: 156,
  oneEighties: 12,
  bestLeg: 15,
  level: 42,
  xp: 7800,
  totalXp: 10000,
  gamesPlayed: 234,
  gamesWon: 156,
  achievements: [
    { id: 1, name: '180!', description: 'Første 180 score', date: '2024-02-01' },
    { id: 2, name: 'Checkout King', description: '100+ checkout', date: '2024-02-15' },
  ],
  recentGames: [
    { id: 1, opponent: 'John Doe', result: 'Vundet', score: '3-2', date: '2024-03-10' },
    { id: 2, opponent: 'Jane Smith', result: 'Tabt', score: '2-3', date: '2024-03-09' },
  ],
};

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  // Animationer defineret inde i komponenten
  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  `;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderPersonalInfo = () => (
    <StyledContentSection>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Personlige oplysninger</Typography>
        <IconButton onClick={() => setIsEditing(!isEditing)}>
          <EditIcon />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={4}
            defaultValue={mockUserStats.bio}
            disabled={!isEditing}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Kaldenavn"
            defaultValue={currentUser?.displayName}
            disabled={!isEditing}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            defaultValue={currentUser?.email}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="textSecondary">
            Medlem siden: {new Date(mockUserStats.memberSince).toLocaleDateString('da-DK')}
          </Typography>
        </Grid>
      </Grid>
    </StyledContentSection>
  );

  const renderStatistics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <StyledContentSection>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 4,
            '&::after': {
              content: '""',
              flex: 1,
              height: '2px',
              background: `linear-gradient(to right, 
                ${theme.palette.primary.main}, 
                transparent)`,
            }
          }}>
            <Typography variant="h5" sx={{
              fontWeight: 'bold',
              background: `linear-gradient(45deg, 
                ${theme.palette.primary.main}, 
                ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Dart statistikker
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledStatCard>
                <StyledCardContent>
                  <Box sx={{ 
                    position: 'relative',
                    mb: 2,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120%',
                      height: '120%',
                      background: `radial-gradient(circle, 
                        ${alpha(theme.palette.primary.main, 0.1)}, 
                        transparent 70%)`,
                      animation: `${pulse} 3s infinite`,
                    }
                  }}>
                    <SportsScoreIcon sx={{ fontSize: 48 }} />
                  </Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Favorit spilletype
                  </Typography>
                  <Typography variant="h4" sx={{
                    background: `linear-gradient(45deg, 
                      ${theme.palette.primary.main}, 
                      ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                  }}>
                    {mockUserStats.favoriteGameType}
                  </Typography>
                </StyledCardContent>
              </StyledStatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledStatCard>
                <StyledCardContent>
                  <Box sx={{ mb: 2 }}>
                    <SportsScoreIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  </Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Gennemsnit
                  </Typography>
                  <Typography variant="h4">
                    {mockUserStats.averageScore}
                  </Typography>
                </StyledCardContent>
              </StyledStatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledStatCard>
                <StyledCardContent>
                  <Box sx={{ mb: 2 }}>
                    <SportsScoreIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  </Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Højeste checkout
                  </Typography>
                  <Typography variant="h4">
                    {mockUserStats.highestCheckout}
                  </Typography>
                </StyledCardContent>
              </StyledStatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledStatCard>
                <StyledCardContent>
                  <Box sx={{ mb: 2 }}>
                    <SportsScoreIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  </Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Antal 180'ere
                  </Typography>
                  <Typography variant="h4">
                    {mockUserStats.oneEighties}
                  </Typography>
                </StyledCardContent>
              </StyledStatCard>
            </Grid>
          </Grid>
        </StyledContentSection>
      </Grid>
    </Grid>
  );

  const renderAchievements = () => (
    <StyledContentSection>
      <Box sx={{ 
        p: 4,
        borderRadius: theme.shape.borderRadius * 2,
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.1)}, 
          ${alpha(theme.palette.secondary.main, 0.1)})`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at top right, 
            ${alpha(theme.palette.primary.main, 0.2)}, 
            transparent 70%)`,
          animation: `${float} 6s ease-in-out infinite`,
        }
      }}>
        <Typography variant="h6" gutterBottom sx={{
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-8px',
            left: 0,
            width: '40px',
            height: '3px',
            backgroundColor: 'primary.main',
            borderRadius: '2px',
          }
        }}>
          Præstationer
        </Typography>
        <Box sx={{ 
          mb: 4,
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(45deg, rgba(20, 184, 166, 0.1), rgba(52, 73, 94, 0.1))',
        }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Niveau {mockUserStats.level}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2">
              {mockUserStats.xp} / {mockUserStats.totalXp} XP
            </Typography>
            <Typography variant="body2" color="primary">
              ({Math.round((mockUserStats.xp / mockUserStats.totalXp) * 100)}%)
            </Typography>
          </Box>
          <StyledProgressBar
            variant="determinate"
            value={(mockUserStats.xp / mockUserStats.totalXp) * 100}
          />
        </Box>
        <Typography variant="subtitle1" gutterBottom>Opnåede achievements</Typography>
        <List>
          {mockUserStats.achievements.map((achievement) => (
            <StyledListItem key={achievement.id}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <EmojiEventsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={achievement.name}
                secondary={`${achievement.description} - ${new Date(achievement.date).toLocaleDateString('da-DK')}`}
              />
            </StyledListItem>
          ))}
        </List>
      </Box>
    </StyledContentSection>
  );

  const renderGameHistory = () => (
    <StyledContentSection>
      <Typography variant="h6" gutterBottom>Kamphistorik</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StyledStatCard>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Antal kampe
              </Typography>
              <Typography variant="h4">
                {mockUserStats.gamesPlayed}
              </Typography>
            </CardContent>
          </StyledStatCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StyledStatCard>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Vundne kampe
              </Typography>
              <Typography variant="h4">
                {mockUserStats.gamesWon}
              </Typography>
            </CardContent>
          </StyledStatCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StyledStatCard>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Win ratio
              </Typography>
              <Typography variant="h4">
                {Math.round((mockUserStats.gamesWon / mockUserStats.gamesPlayed) * 100)}%
              </Typography>
            </CardContent>
          </StyledStatCard>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom>Seneste kampe</Typography>
        <List>
          {mockUserStats.recentGames.map((game) => (
            <StyledListItem key={game.id}>
              <ListItemText
                primary={`vs. ${game.opponent}`}
                secondary={`${game.result} ${game.score} - ${new Date(game.date).toLocaleDateString('da-DK')}`}
              />
              <Chip
                label={game.result}
                color={game.result === 'Vundet' ? 'success' : 'error'}
                size="small"
              />
            </StyledListItem>
          ))}
        </List>
      </Box>
    </StyledContentSection>
  );

  const renderSettings = () => (
    <StyledContentSection>
      <Typography variant="h6" gutterBottom>Indstillinger</Typography>
      <List>
        <StyledListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Privatliv"
            secondary="Hvem kan se din profil"
          />
          <FormControlLabel
            control={<Switch />}
            label="Offentlig profil"
          />
        </StyledListItem>
        <StyledListItem>
          <ListItemAvatar>
            <Avatar>
              <NotificationsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Notifikationer"
            secondary="Håndter dine notifikationsindstillinger"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Aktiv"
          />
        </StyledListItem>
        <StyledListItem>
          <ListItemAvatar>
            <Avatar>
              <TranslateIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Sprog"
            secondary="Vælg dit foretrukne sprog"
          />
          <Button variant="outlined" size="small">
            Dansk
          </Button>
        </StyledListItem>
        <StyledListItem>
          <ListItemAvatar>
            <Avatar>
              <LightModeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Tema"
            secondary="Vælg mellem lyst og mørkt tema"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Mørkt tema"
          />
        </StyledListItem>
      </List>
    </StyledContentSection>
  );

  // Styled components med adgang til theme
  const StyledProfileHeader = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6),
    marginBottom: theme.spacing(4),
    backgroundColor: 'transparent',
    borderRadius: theme.shape.borderRadius * 3,
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.15)}, 
        ${alpha(theme.palette.secondary.main, 0.15)})`,
      zIndex: -1,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: -100,
      right: -100,
      width: 200,
      height: 200,
      background: `radial-gradient(circle, 
        ${alpha(theme.palette.primary.main, 0.2)}, 
        transparent 70%)`,
      borderRadius: '50%',
      animation: `${float} 6s ease-in-out infinite`,
    }
  }));

  const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    border: `4px solid transparent`,
    boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
    background: `linear-gradient(45deg, 
      ${theme.palette.primary.main}, 
      ${theme.palette.secondary.main})`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1) rotate(5deg)',
      boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`,
    },
    [theme.breakpoints.down('sm')]: {
      width: 100,
      height: 100,
    },
  }));

  const StyledContentSection = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    marginBottom: theme.spacing(4),
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  }));

  const StyledStatCard = styled(Card)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: `linear-gradient(to right, 
        ${theme.palette.primary.main}, 
        ${theme.palette.secondary.main})`,
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out',
    },
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: `0 20px 30px ${alpha(theme.palette.common.black, 0.2)}`,
      '&::before': {
        opacity: 1,
      },
    },
  }));

  const StyledCardContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: theme.spacing(2),
    '& .MuiSvgIcon-root': {
      fontSize: 48,
      color: theme.palette.primary.main,
      transition: 'all 0.3s ease-in-out',
    },
    '&:hover .MuiSvgIcon-root': {
      transform: 'scale(1.2) rotate(10deg)',
      color: theme.palette.secondary.main,
    },
  }));

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      width: 32,
      height: 32,
      borderRadius: '50%',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }));

  const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({
    height: 12,
    borderRadius: 6,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '& .MuiLinearProgress-bar': {
      borderRadius: 6,
      backgroundImage: `linear-gradient(45deg, 
        ${theme.palette.primary.main}, 
        ${theme.palette.secondary.main})`,
      animation: `${pulse} 2s infinite`,
    },
  }));

  const StyledChip = styled(Chip)(({ theme }) => ({
    background: `linear-gradient(45deg, 
      ${theme.palette.primary.main}, 
      ${theme.palette.secondary.main})`,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    padding: theme.spacing(2, 1),
    '& .MuiChip-icon': {
      color: theme.palette.common.white,
    },
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
  }));

  const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    marginBottom: theme.spacing(1),
    backgroundColor: alpha(theme.palette.background.paper, 0.4),
    backdropFilter: 'blur(5px)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      transform: 'scale(1.02)',
      '& .MuiListItemAvatar-root .MuiAvatar-root': {
        backgroundColor: theme.palette.primary.main,
        transform: 'scale(1.1) rotate(10deg)',
      },
    },
  }));

  const StyledIconButton = styled(IconButton)(({ theme }) => ({
    background: `linear-gradient(45deg, 
      ${theme.palette.primary.main}, 
      ${theme.palette.secondary.main})`,
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    '&:hover': {
      transform: 'rotate(15deg) scale(1.1)',
    },
  }));

  return (
    <NavigationLayout>
      <Container maxWidth="lg">
        <StyledProfileHeader>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Skift profilbillede">
                    <IconButton size="small" sx={{
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        '& svg': {
                          color: 'white',
                        },
                      },
                    }}>
                      <PhotoCameraIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <StyledAvatar
                  src={currentUser?.photoURL || undefined}
                  alt={currentUser?.displayName || 'Profilbillede'}
                />
              </StyledBadge>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom sx={{
                background: 'linear-gradient(45deg, #fff, rgba(255,255,255,0.8))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}>
                {currentUser?.displayName || 'Dart Spiller'}
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                {currentUser?.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <StyledChip
                  icon={<SportsScoreIcon />}
                  label={`Niveau ${mockUserStats.level}`}
                  color="primary"
                />
                <StyledChip
                  icon={<EmojiEventsIcon />}
                  label={`${mockUserStats.achievements.length} Achievements`}
                  color="secondary"
                />
              </Box>
            </Grid>
          </Grid>
        </StyledProfileHeader>

        {/* Tabs med opdateret styling */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 3,
          '& .MuiTabs-indicator': {
            height: '3px',
            borderRadius: '3px 3px 0 0',
          },
          '& .MuiTab-root': {
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Profil sektioner"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PersonIcon />} label="Profil" />
            <Tab icon={<TimelineIcon />} label="Statistik" />
            <Tab icon={<EmojiEventsIcon />} label="Præstationer" />
            <Tab icon={<HistoryIcon />} label="Kamphistorik" />
            <Tab icon={<SettingsIcon />} label="Indstillinger" />
          </Tabs>
        </Box>

        {/* Tab indhold */}
        <TabPanel value={activeTab} index={0}>
          {renderPersonalInfo()}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {renderStatistics()}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {renderAchievements()}
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {renderGameHistory()}
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          {renderSettings()}
        </TabPanel>
      </Container>
    </NavigationLayout>
  );
};

export default ProfilePage; 