import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';

interface CheckoutDialogProps {
  open: boolean;
  score: number;
  onClose: (response: { 
    isCheckout?: boolean;
    dartsUsed?: number;
    doubleAttempts?: number;
  }) => void;
  showCheckoutOptions: boolean;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  score,
  onClose,
  showCheckoutOptions
}) => {
  const handleCheckout = (dartsUsed: number) => {
    onClose({
      isCheckout: true,
      dartsUsed,
      doubleAttempts: 1
    });
  };

  const handleBust = () => {
    onClose({
      isCheckout: false
    });
  };

  return (
    <Dialog 
      open={open}
      onClose={() => onClose({})}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Checkout Options
      </DialogTitle>
      <DialogContent>
        {showCheckoutOptions ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Score: {score}
            </Typography>
            <Typography variant="body1" gutterBottom>
              How many darts did you use?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {[1, 2, 3].map(darts => (
                <Button
                  key={darts}
                  variant="outlined"
                  onClick={() => handleCheckout(darts)}
                >
                  {darts}
                </Button>
              ))}
            </Box>
          </Box>
        ) : (
          <Typography>
            Confirm your checkout
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBust} color="warning">
          Bust
        </Button>
        <Button onClick={() => onClose({})} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutDialog; 