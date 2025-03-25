import { Box, Button, Container, Typography, Grid, Paper, Dialog } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupsIcon from '@mui/icons-material/Groups';
import DevicesIcon from '@mui/icons-material/Devices';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../contexts/AuthContext';

// Styled components
const StyledHeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  marginBottom: theme.spacing(6),
}));

const StyledFeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 500,
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  '&.MuiButton-contained': {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
  },
}));

const features = [
  {
    icon: <SportsScoreIcon sx={{ fontSize: 40 }} />,
    title: 'Hold Styr på Scores',
    description: 'Nem og præcis score-tracking for alle dine dartspil.'
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    title: 'Detaljeret Statistik',
    description: 'Følg din udvikling med omfattende statistikker og indsigt.'
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    title: 'Spil med Venner',
    description: 'Del spillet med venner og familie, og hold styr på resultaterne.'
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 40 }} />,
    title: 'Tilgængelig Overalt',
    description: 'Brug DartScore på alle dine enheder - mobil, tablet eller computer.'
  }
];

const InfoPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    setSignupOpen(false);
    navigate('/dashboard');
  };

  const handleLoginClick = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };

  const handleSignupClick = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  };

  return (
    <Box>
      {/* Hero Section */}
      <StyledHeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}
              >
                Lad os spille dart!
              </Typography>
              <Typography 
                variant="h5" 
                paragraph
                sx={{ 
                  opacity: 0.9,
                  mb: 4,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                Brug DartScore til at holde styr på dine scores og statistikker!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <StyledActionButton 
                  variant="contained" 
                  onClick={handleLoginClick}
                >
                  Log Ind
                </StyledActionButton>
                <StyledActionButton 
                  variant="outlined"
                  onClick={handleSignupClick}
                  sx={{
                    borderColor: 'common.white',
                    color: 'common.white',
                    '&:hover': {
                      borderColor: 'common.white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Opret Konto
                </StyledActionButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Her kunne man tilføje et billede eller illustration */}
            </Grid>
          </Grid>
        </Container>
      </StyledHeroSection>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2
            }}
          >
            Opdag DartScore
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              mb: 6,
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}
          >
            Din ultimative dartskive-app designet til at tracke scores og statistikker uden besvær.
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StyledFeatureCard>
                  <Box sx={{ color: 'primary.main' }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h3"
                    sx={{ 
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </StyledFeatureCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 8,
            mb: 8,
            py: 6,
            backgroundColor: 'background.paper',
            borderRadius: 4
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 3
            }}
          >
            Klar til at forbedre dit dartspil?
          </Typography>
          <StyledActionButton 
            variant="contained" 
            onClick={() => navigate('/dashboard')}
            sx={{
              backgroundColor: 'primary.main',
              color: 'common.white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            Kom i Gang Nu
          </StyledActionButton>
        </Box>
      </Container>

      {/* Login Dialog */}
      <Dialog 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <LoginForm 
          onSuccess={handleLoginSuccess}
          onRegisterClick={handleSignupClick}
        />
      </Dialog>

      {/* Signup Dialog */}
      <Dialog 
        open={signupOpen} 
        onClose={() => setSignupOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <SignupForm 
          onSuccess={handleLoginSuccess}
          onLoginClick={handleLoginClick}
        />
      </Dialog>
    </Box>
  );
};

export default InfoPage; 