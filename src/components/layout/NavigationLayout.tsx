import React, { useState, useEffect } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton, ListItemIcon, ListItemText, IconButton, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import HistoryIcon from '@mui/icons-material/History';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BarChartIcon from '@mui/icons-material/BarChart';

const drawerWidth = 240;

interface NavigationLayoutProps {
  children: React.ReactNode;
}

// Dialog for game interruption
interface GameInterruptDialogProps {
  open: boolean;
  onClose: () => void;
  onAbortGame: () => void;
  onNewGame: () => void;
}

const GameInterruptDialog: React.FC<GameInterruptDialogProps> = ({
  open,
  onClose,
  onAbortGame,
  onNewGame
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: '#34495e',
          color: 'white',
          minWidth: 300
        }
      }}
    >
      <DialogTitle>Er du sikker på, at du vil afbryde spillet?</DialogTitle>
      <DialogActions sx={{ flexDirection: 'column', gap: 1, p: 2 }}>
        <Button 
          fullWidth 
          variant="contained" 
          color="error" 
          onClick={onAbortGame}
          sx={{ color: 'white' }}
        >
          Afbryd spil
        </Button>
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          onClick={onNewGame}
          sx={{ color: 'white' }}
        >
          Spil andet spil
        </Button>
        <Button 
          fullWidth 
          variant="outlined" 
          onClick={onClose}
          sx={{ color: 'white', borderColor: 'white' }}
        >
          Annuller
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const navigationItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: "Let's play darts", icon: <SportsScoreIcon />, path: '/local' },
  { text: 'Your profile', icon: <PersonIcon />, path: '/profile' },
  { text: 'Friends', icon: <GroupIcon />, path: '/friends' },
  { text: 'Teams', icon: <PeopleIcon />, path: '/teams' },
  { text: 'Statistics', icon: <TimelineIcon />, path: '/statistics' },
  { text: 'Games history', icon: <HistoryIcon />, path: '/history' },
  { text: 'Achievements', icon: <EmojiEventsIcon />, path: '/achievements' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'About', icon: <InfoIcon />, path: '/about' },
];

const NavigationLayout = ({ children }: NavigationLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showGameInterruptDialog, setShowGameInterruptDialog] = useState(false);
  const { showingStats, setShowingStats } = useGame();

  // Check if we're in a game
  const isInGame = location.pathname.includes('/x01game');
  // Check if we're on dashboard
  const isOnDashboard = location.pathname === '/dashboard';
  // Store previous location for back navigation
  const [previousLocation, setPreviousLocation] = useState<string>('/dashboard');

  // Update previous location when location changes
  useEffect(() => {
    if (location.pathname !== previousLocation) {
      setPreviousLocation(location.pathname);
    }
  }, [location]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleBack = () => {
    if (isInGame) {
      setShowGameInterruptDialog(true);
    } else {
      navigate(-1);
    }
  };

  const handleAbortGame = () => {
    setShowGameInterruptDialog(false);
    navigate('/dashboard');
  };

  const handleNewGame = () => {
    setShowGameInterruptDialog(false);
    navigate('/local');
  };

  const handleStats = () => {
    setShowingStats(true);
  };

  const handleBackToGame = () => {
    setShowingStats(false);
  };

  const getCurrentPageTitle = () => {
    if (showingStats) return 'Statistik';
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.text : 'DartScore';
  };

  const drawer = (
    <Box sx={{ overflow: 'auto', mt: 2 }}>
      <List>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            selected={location.pathname === item.path}
            sx={{ 
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
              '&.Mui-selected': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
              '&.Mui-selected:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Game Interrupt Dialog */}
      <GameInterruptDialog
        open={showGameInterruptDialog}
        onClose={() => setShowGameInterruptDialog(false)}
        onAbortGame={handleAbortGame}
        onNewGame={handleNewGame}
      />

      {/* Top Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#2c3e50',
          width: '100%',
        }}
      >
        <Toolbar>
          {!isOnDashboard ? (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleBack}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              {isMobile ? <MenuIcon /> : (isOpen ? <ChevronLeftIcon /> : <MenuIcon />)}
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              textAlign: showingStats ? 'center' : 'left'
            }}
          >
            {getCurrentPageTitle()}
          </Typography>

          {isInGame && showingStats && (
            <IconButton
              color="inherit"
              onClick={handleBackToGame}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {isInGame && !showingStats && (
            <IconButton
              color="inherit"
              onClick={handleStats}
              sx={{ 
                ml: 'auto',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <BarChartIcon />
            </IconButton>
          )}

          {!isInGame && (
            <IconButton
              color="inherit"
              onClick={() => navigate('/profile')}
            >
              <PersonIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Side Navigation */}
      <Drawer
        variant={isMobile ? "temporary" : "temporary"}
        open={isMobile ? mobileOpen : isOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: '#34495e',
            color: 'white',
            position: 'fixed',
            height: '100%',
            zIndex: theme.zIndex.drawer,
          },
        }}
      >
        <Toolbar /> {/* Spacing for AppBar */}
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: 0,
          width: '100%',
        }}
      >
        <Toolbar /> {/* Spacing for AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default NavigationLayout; 