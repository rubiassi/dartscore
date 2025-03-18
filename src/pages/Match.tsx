import { Box, Button, Container, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GAME_TYPES = [301, 501, 701, 1001];

const Match = () => {
  const navigate = useNavigate();

  const handleGameSelect = (gameType: number) => {
    // Her kunne vi gemme den valgte spilletype i en context eller state management
    navigate('/x01setup', { state: { gameType } });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Vælg X01 Variant
        </Typography>

        <Grid container spacing={2}>
          {GAME_TYPES.map((type) => (
            <Grid item xs={6} key={type}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => handleGameSelect(type)}
                sx={{ 
                  py: 3,
                  fontSize: '1.5rem',
                  height: '100%'
                }}
              >
                {type}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="outlined"
          onClick={() => navigate('/local')}
          sx={{ mt: 2 }}
        >
          Tilbage
        </Button>
      </Box>
    </Container>
  );
};

export default Match; 