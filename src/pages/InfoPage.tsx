import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupsIcon from '@mui/icons-material/Groups';
import DevicesIcon from '@mui/icons-material/Devices';

const InfoPage = () => {
  const navigate = useNavigate();

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

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Lad os spille dart!
              </Typography>
              <Typography variant="h5" paragraph>
                Brug DartScore til at holde styr på dine scores og statistikker!
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  mt: 2,
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                Start Nu!
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Her kunne man tilføje et billede eller illustration */}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Opdag DartScore
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Din ultimative dartskive-app designet til at tracke scores og statistikker uden besvær.
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box sx={{ color: 'primary.main' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Klar til at forbedre dit dartspil?
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 2 }}
          >
            Kom i Gang Nu
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default InfoPage; 