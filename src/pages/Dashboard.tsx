import { Box, Button, Container, Typography, Grid, Paper, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import NavigationLayout from '../components/layout/NavigationLayout';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
}));

const StyledActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  '&.MuiButton-contained': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  '&.MuiButton-outlined': {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: theme.palette.text.primary,
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    color: 'rgba(255, 255, 255, 0.3)',
  }
}));

const StyledQuickLink = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  '&.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.3)',
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  backgroundColor: theme.palette.primary.main,
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <NavigationLayout>
      <Box sx={{ 
        bgcolor: theme => theme.palette.background.default,
        minHeight: '100vh'
      }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <StyledAvatar>
              <PersonIcon />
            </StyledAvatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                Velkommen tilbage!
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ color: 'text.secondary' }}
              >
                Klar til at spille dart?
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Hurtig Start Sektion */}
            <Grid item xs={12} md={8}>
              <StyledPaper sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <SportsScoreIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    Hurtig Start
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <StyledActionButton
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/local')}
                      startIcon={<SportsScoreIcon />}
                    >
                      Start Nyt Spil
                    </StyledActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledActionButton
                      variant="outlined"
                      fullWidth
                      disabled
                      startIcon={<EmojiEventsIcon />}
                    >
                      Start Turnering
                    </StyledActionButton>
                  </Grid>
                </Grid>
              </StyledPaper>

              {/* Seneste Spil */}
              <StyledPaper>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <EmojiEventsIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    Seneste Spil
                  </Typography>
                </Box>
                <Typography sx={{ color: 'text.secondary' }}>
                  Du har ikke spillet nogen spil endnu.
                </Typography>
              </StyledPaper>
            </Grid>

            {/* Sidepanel */}
            <Grid item xs={12} md={4}>
              {/* Statistik Kort */}
              <StyledPaper sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <SportsScoreIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    Dine Statistikker
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Spil i alt: 0
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Gennemsnitlig score: -
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Bedste checkout: -
                  </Typography>
                </Box>
              </StyledPaper>

              {/* Indstillinger Kort */}
              <StyledPaper>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <SettingsIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    Hurtige Links
                  </Typography>
                </Box>
                <StyledQuickLink
                  fullWidth
                  startIcon={<SettingsIcon />}
                  onClick={() => navigate('/settings')}
                >
                  Indstillinger
                </StyledQuickLink>
                <StyledQuickLink
                  fullWidth
                  startIcon={<EmojiEventsIcon />}
                  disabled
                >
                  Achievements
                </StyledQuickLink>
              </StyledPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </NavigationLayout>
  );
};

export default Dashboard; 