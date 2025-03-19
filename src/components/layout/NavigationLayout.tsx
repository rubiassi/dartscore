import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
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

const drawerWidth = 240;

interface NavigationLayoutProps {
  children: React.ReactNode;
}

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

  // Funktion til at finde den aktuelle sides titel
  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.text : 'DartScore';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#2c3e50' // Mørkeblå farve som i billedet
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography variant="h6" component="div">
              {getCurrentPageTitle()}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              color="inherit"
              onClick={() => navigate('/profile')}
            >
              <PersonIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#34495e', // Mørkere blå farve for sidemenu
            color: 'white',
          },
        }}
      >
        <Toolbar /> {/* Spacing for AppBar */}
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {navigationItems.map((item) => (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
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
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <Toolbar /> {/* Spacing for AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default NavigationLayout; 