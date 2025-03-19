import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Local = () => {
  const navigate = useNavigate();

  const mainGames = [
    { title: 'X01', path: '/x01setup' },
    { title: 'Cricket', path: '/cricket', disabled: true }
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
    <Box sx={{ bgcolor: '#2c3e50', minHeight: '100vh', py: 2 }}>
      <Container maxWidth="lg">
        {/* Main Games */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {mainGames.map((game) => (
            <Grid item xs={12} md={6} key={game.title}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate(game.path)}
                disabled={game.disabled}
                sx={{
                  py: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                {game.title}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Training Games Section */}
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 2,
            pl: 1
          }}
        >
          Training games
        </Typography>

        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {trainingGames[0].map((game) => (
                <Grid item xs={12} key={game.title}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(game.path)}
                    disabled={game.disabled}
                    sx={{
                      py: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    {game.title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {trainingGames[1].map((game) => (
                <Grid item xs={12} key={game.title}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(game.path)}
                    disabled={game.disabled}
                    sx={{
                      py: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    {game.title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Local; 