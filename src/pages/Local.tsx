import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Local = () => {
  const navigate = useNavigate();

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
        <Typography variant="h2" component="h1" gutterBottom>
          DartScore
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom>
          Vælg spilletype
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => navigate('/x01setup')}
          sx={{ py: 2, fontSize: '1.2rem' }}
        >
          X01 Kamp
        </Button>

        {/* Placeholder for fremtidige spiltyper */}
        <Button
          variant="outlined"
          size="large"
          fullWidth
          disabled
          sx={{ py: 2, fontSize: '1.2rem' }}
        >
          Cricket (Kommer snart)
        </Button>
      </Box>
    </Container>
  );
};

export default Local; 