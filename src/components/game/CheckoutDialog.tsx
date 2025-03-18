import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  ButtonGroup
} from '@mui/material';
import { useState } from 'react';

interface CheckoutDialogProps {
  open: boolean;
  onClose: (response: { 
    hadDoubleAttempt?: boolean; 
    isCheckout?: boolean; 
    dartsUsed?: number;
    doubleAttempts?: number;
  }) => void;
  checkoutRoute?: string;
  remainingScore?: number;
  isCheckoutAttempt: boolean;
}

const CheckoutDialog = ({ open, onClose, checkoutRoute, remainingScore, isCheckoutAttempt }: CheckoutDialogProps) => {
  const [step, setStep] = useState(1);
  const [totalDarts, setTotalDarts] = useState<number | null>(null);

  const handleDartsUsed = (darts: number) => {
    setTotalDarts(darts);
    setStep(2);
  };

  const handleDoubleAttempts = (attempts: number) => {
    onClose({ 
      isCheckout: true, 
      dartsUsed: totalDarts!, 
      doubleAttempts: attempts 
    });
    setStep(1);
    setTotalDarts(null);
  };

  const handleClose = () => {
    setStep(1);
    setTotalDarts(null);
    onClose({ isCheckout: false });
  };

  if (isCheckoutAttempt && checkoutRoute) {
    return (
      <Dialog
        open={open}
        onClose={() => onClose({ hadDoubleAttempt: false })}
        aria-labelledby="checkout-dialog-title"
      >
        <DialogTitle id="checkout-dialog-title">
          Mulig Checkout Route
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Du har {remainingScore} tilbage.
            <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
              Mulig checkout: {checkoutRoute}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Havde du forsøg på en double?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose({ hadDoubleAttempt: false })} color="primary">
            Nej
          </Button>
          <Button onClick={() => onClose({ hadDoubleAttempt: true })} color="primary" variant="contained">
            Ja
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="checkout-dialog-title"
    >
      <DialogTitle id="checkout-dialog-title">
        Bekræft Checkout
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {step === 1 && (
            <Typography sx={{ mb: 2 }}>
              Er det en korrekt checkout med double?
            </Typography>
          )}
          {step === 2 && (
            <Typography sx={{ mb: 2 }}>
              Hvor mange pile blev brugt på double-forsøg?
            </Typography>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', gap: 2, pb: 3 }}>
        {step === 1 && (
          <>
            <Button 
              onClick={handleClose}
              color="error" 
              variant="contained"
              fullWidth
            >
              Nej - Bust
            </Button>
            <Typography>
              Hvis ja, hvor mange pile blev brugt i alt?
            </Typography>
            <ButtonGroup variant="contained" color="primary">
              <Button onClick={() => handleDartsUsed(1)}>1 pil</Button>
              <Button onClick={() => handleDartsUsed(2)}>2 pile</Button>
              <Button onClick={() => handleDartsUsed(3)}>3 pile</Button>
            </ButtonGroup>
          </>
        )}
        {step === 2 && (
          <>
            <Typography>
              Antal pile brugt på double:
            </Typography>
            <ButtonGroup variant="contained" color="primary">
              <Button onClick={() => handleDoubleAttempts(1)}>1 pil</Button>
              <Button onClick={() => handleDoubleAttempts(2)}>2 pile</Button>
              <Button onClick={() => handleDoubleAttempts(3)}>3 pile</Button>
            </ButtonGroup>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutDialog; 