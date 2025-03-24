import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
}));

const StyledGameButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    color: 'rgba(255, 255, 255, 0.3)',
  }
}));

const StyledTrainingButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-1px)',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    color: 'rgba(255, 255, 255, 0.3)',
  }
}));

const Local = () => {
  const navigate = useNavigate();

  const mainGames = [
    { 
      title: 'X01', 
      path: '/x01setup',
      icon: <SportsScoreIcon sx={{ fontSize: 32 }} />,
      description: 'Classic X01 dart game with customizable settings'
    },
    { 
      title: 'Cricket', 
      path: '/cricket', 
      icon: <SportsScoreIcon sx={{ fontSize: 32 }} />,
      description: 'Coming soon',
      disabled: true 
    }
  ];

  const trainingGames = [
    [
      { title: 'Bob 27', path: '/bob27', disabled: true },
      { title: 'Game 121', path: '/game121', disabled: true },
      { title: 'Shanghai', path: '/shanghai', disabled: true },
      { title: 'Priestley Trebles', path: '/priestley-trebles', disabled: true },
      { title: 'Catch 40', path: '/catch40', disabled: true }
    ],
    [
      { title: 'Around The Clock', path: '/around-the-clock', disabled: true },
      { title: 'Game 420', path: '/game420', disabled: true },
      { title: 'Kill Bull', path: '/kill-bull', disabled: true },
      { title: '100 Darts At', path: '/100-darts-at', disabled: true },
      { title: 'Random Checkout', path: '/random-checkout', disabled: true }
    ]
  ];

  return (
    <Box sx={{ 
      bgcolor: theme => theme.palette.background.default,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Main Games Section */}
        <StyledPaper>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SportsScoreIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Game Modes
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {mainGames.map((game) => (
                <Grid item xs={12} md={6} key={game.title}>
                  <StyledGameButton
                    fullWidth
                    onClick={() => navigate(game.path)}
                    disabled={game.disabled}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      {game.icon}
                      <Typography variant="h5" sx={{ fontWeight: 500 }}>
                        {game.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          opacity: game.disabled ? 0.5 : 1
                        }}
                      >
                        {game.description}
                      </Typography>
                    </Box>
                  </StyledGameButton>
                </Grid>
              ))}
            </Grid>
          </Box>
        </StyledPaper>

        {/* Training Games Section */}
        <StyledPaper>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FitnessCenterIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Training Games
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {trainingGames[0].map((game) => (
                  <Grid item xs={12} key={game.title}>
                    <StyledTrainingButton
                      fullWidth
                      onClick={() => navigate(game.path)}
                      disabled={game.disabled}
                    >
                      {game.title}
                    </StyledTrainingButton>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {trainingGames[1].map((game) => (
                  <Grid item xs={12} key={game.title}>
                    <StyledTrainingButton
                      fullWidth
                      onClick={() => navigate(game.path)}
                      disabled={game.disabled}
                    >
                      {game.title}
                    </StyledTrainingButton>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default Local; 