import { Box, Button, Container, Typography, Grid, Paper, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      {/* Header */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              Velkommen tilbage!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Klar til at spille dart?
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Hurtig Start Sektion */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Hurtig Start
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => navigate('/local')}
                    startIcon={<SportsScoreIcon />}
                    sx={{ py: 2 }}
                  >
                    Start Nyt Spil
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    disabled
                    startIcon={<EmojiEventsIcon />}
                    sx={{ py: 2 }}
                  >
                    Start Turnering
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Seneste Spil */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Seneste Spil
              </Typography>
              <Typography color="text.secondary">
                Du har ikke spillet nogen spil endnu.
              </Typography>
            </Paper>
          </Grid>

          {/* Sidepanel */}
          <Grid item xs={12} md={4}>
            {/* Statistik Kort */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Dine Statistikker
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Spil i alt: 0
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Gennemsnitlig score: -
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Bedste checkout: -
                </Typography>
              </Box>
            </Paper>

            {/* Indstillinger Kort */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Hurtige Links
              </Typography>
              <Button
                fullWidth
                startIcon={<SettingsIcon />}
                sx={{ justifyContent: 'flex-start', mb: 1 }}
                disabled
              >
                Indstillinger
              </Button>
              <Button
                fullWidth
                startIcon={<EmojiEventsIcon />}
                sx={{ justifyContent: 'flex-start' }}
                disabled
              >
                Achievements
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 