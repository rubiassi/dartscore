import React, { useState, useEffect } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton, ListItemIcon, ListItemText, IconButton, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Button, DrawerProps, CssBaseline } from '@mui/material';
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
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

const drawerWidth = 240;

// Constants for layout
const LAYOUT_CONSTANTS = {
  MOBILE: {
    APPBAR_HEIGHT: 56,
    DRAWER_WIDTH: 0
  },
  DESKTOP: {
    APPBAR_HEIGHT: 64,
    DRAWER_WIDTH: drawerWidth,
    COLLAPSED_WIDTH: 7 // theme.spacing(7)
  }
};

// Root container styling
const RootContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  width: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default
}));

// AppBar styling
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  width: '100%',
  zIndex: theme.zIndex.drawer + 1
}));

// Toolbar med explicit højder
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: LAYOUT_CONSTANTS.MOBILE.APPBAR_HEIGHT,
  padding: theme.spacing(0, 1),
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    minHeight: LAYOUT_CONSTANTS.DESKTOP.APPBAR_HEIGHT,
    padding: theme.spacing(0, 2)
  }
}));

// Base drawer styling
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(['width', 'transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    borderRight: `1px solid ${theme.palette.divider}`,
    top: LAYOUT_CONSTANTS.MOBILE.APPBAR_HEIGHT,
    height: `calc(100% - ${LAYOUT_CONSTANTS.MOBILE.APPBAR_HEIGHT}px)`,
    [theme.breakpoints.up('sm')]: {
      top: LAYOUT_CONSTANTS.DESKTOP.APPBAR_HEIGHT,
      height: `calc(100% - ${LAYOUT_CONSTANTS.DESKTOP.APPBAR_HEIGHT}px)`
    }
  }
}));

// Main content area
const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  width: '100%',
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create(['width', 'margin'], {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.sharp
  }),
  height: '100vh',
  overflow: 'hidden',
  paddingTop: LAYOUT_CONSTANTS.MOBILE.APPBAR_HEIGHT,

  [theme.breakpoints.up('sm')]: {
    paddingTop: LAYOUT_CONSTANTS.DESKTOP.APPBAR_HEIGHT,
    width: '100%',

    '&.drawer-open': {
      width: `calc(100% - ${LAYOUT_CONSTANTS.DESKTOP.DRAWER_WIDTH}px)`,
      marginLeft: LAYOUT_CONSTANTS.DESKTOP.DRAWER_WIDTH
    }
  }
}));

// Content wrapper
const ContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',

  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3)
  }
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }: { theme: Theme }) => ({
  borderRadius: '0.5rem',
  margin: '0.25rem 0.5rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: 'inherit',
  minWidth: 40,
}));

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

interface NavigationLayoutProps {
  children: React.ReactNode;
}

const NavigationLayout = ({ children }: NavigationLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [isOpen, setIsOpen] = useState(false);
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

  // Opdateret useEffect - drawer skal forblive lukket på mobile/tablet
  useEffect(() => {
    if (isMobile || isTablet) {
      setIsOpen(false);
    }
  }, [isMobile, isTablet]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else if (isTablet) {
      setIsOpen(!isOpen);
    } else {
      // På desktop kan vi tillade at den er åben som default hvis ønsket
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
    <Box>
      <List>
        {navigationItems.map((item) => (
          <StyledListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => {
              if (isInGame) {
                setShowGameInterruptDialog(true);
              } else {
                navigate(item.path);
              }
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
          >
            <StyledListItemIcon>
              {item.icon}
            </StyledListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                sx: {
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }
              }}
            />
          </StyledListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <RootContainer>
      <CssBaseline />
      <StyledAppBar>
        <StyledToolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {isMobile ? <MenuIcon /> : (isOpen ? <ChevronLeftIcon /> : <MenuIcon />)}
          </IconButton>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            overflow: 'hidden'
          }}>
            {(isInGame || !isOnDashboard) && (
              <IconButton color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                flexGrow: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {getCurrentPageTitle()}
            </Typography>
            {isInGame && (
              <IconButton 
                color="inherit" 
                onClick={showingStats ? handleBackToGame : handleStats}
              >
                {showingStats ? <SportsScoreIcon /> : <BarChartIcon />}
              </IconButton>
            )}
          </Box>
        </StyledToolbar>
      </StyledAppBar>

      {/* Mobile drawer */}
      <StyledDrawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: LAYOUT_CONSTANTS.DESKTOP.DRAWER_WIDTH,
            transform: mobileOpen ? 'none' : 'translateX(-100%)'
          }
        }}
      >
        {drawer}
      </StyledDrawer>

      {/* Desktop drawer */}
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: isOpen ? LAYOUT_CONSTANTS.DESKTOP.DRAWER_WIDTH : 0,
            transform: isOpen ? 'none' : 'translateX(-100%)',
            visibility: 'visible'
          }
        }}
        open={isOpen}
      >
        {drawer}
      </StyledDrawer>

      <MainContent
        className={isOpen ? 'drawer-open' : ''}
      >
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>

      {/* Game Interrupt Dialog */}
      <Dialog
        open={showGameInterruptDialog}
        onClose={() => setShowGameInterruptDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            borderRadius: '0.5rem',
            margin: 2,
            maxWidth: 'calc(100% - 32px)',
            maxHeight: 'calc(100% - 32px)',
          }
        }}
      >
        <DialogTitle>
          Leave Game?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to leave the current game? All progress will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowGameInterruptDialog(false)}
            sx={{ color: theme.palette.text.primary }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowGameInterruptDialog(false);
              navigate('/dashboard');
            }}
            variant="contained"
            color="error"
          >
            Leave Game
          </Button>
        </DialogActions>
      </Dialog>
    </RootContainer>
  );
};

export default NavigationLayout; 