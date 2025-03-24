import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsScoreIcon from '@mui/icons-material/SportsScore';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
}));

const StyledGameButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
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

const StyledBackButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  color: theme.palette.text.primary,
  borderColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'border-color'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  }
}));

const GAME_TYPES = [
  { value: 301, description: 'Hurtig og intens' },
  { value: 501, description: 'Standard dartspil' },
  { value: 701, description: 'Længere spil' },
  { value: 1001, description: 'Maraton' }
];

const Match = () => {
  const navigate = useNavigate();

  const handleGameSelect = (gameType: number) => {
    navigate('/x01setup', { state: { gameType } });
  };

  return (
    <Box sx={{ 
      bgcolor: theme => theme.palette.background.default,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="sm">
        <StyledPaper>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <SportsScoreIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 500 }}>
                Vælg X01 Variant
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {GAME_TYPES.map((type) => (
                <Grid item xs={6} key={type.value}>
                  <StyledGameButton
                    fullWidth
                    onClick={() => handleGameSelect(type.value)}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 500 }}>
                        {type.value}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ color: 'text.secondary' }}
                      >
                        {type.description}
                      </Typography>
                    </Box>
                  </StyledGameButton>
                </Grid>
              ))}
            </Grid>
          </Box>

          <StyledBackButton
            variant="outlined"
            fullWidth
            onClick={() => navigate('/local')}
            startIcon={<ArrowBackIcon />}
          >
            Tilbage
          </StyledBackButton>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default Match; 