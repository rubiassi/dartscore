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
import { styled } from '@mui/material/styles';
import { useState } from 'react';

interface CheckoutDialogProps {
  open: boolean;
  onClose: (response: { 
    hadDoubleAttempt?: boolean; 
    isCheckout?: boolean; 
    dartsUsed?: number;
    doubleAttempts?: number;
  }) => void;
  checkoutInfo: {
    route?: string;
    remainingScore?: number;
    isCheckoutAttempt: boolean;
  } | null;
  showCheckoutOptions?: boolean;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[10],
    transition: theme.transitions.create(['background-color', 'box-shadow'], {
      duration: theme.transitions.duration.standard,
    })
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  '& .MuiTypography-root': {
    fontWeight: 600
  }
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper
}));

const StyledDialogText = styled(DialogContentText)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2)
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3, 3),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`
}));

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 120,
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'scale(1.02)'
  }
}));

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  '& .MuiButton-root': {
    minWidth: 80,
    transition: theme.transitions.create(['background-color', 'transform'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      transform: 'scale(1.02)'
    }
  }
}));

const InfoText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginBottom: theme.spacing(1)
}));

const RouteText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center'
}));

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onClose,
  checkoutInfo,
  showCheckoutOptions = true
}) => {
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

  if (checkoutInfo && checkoutInfo.isCheckoutAttempt && checkoutInfo.route) {
    return (
      <StyledDialog
        open={open}
        onClose={() => onClose({ hadDoubleAttempt: false })}
        aria-labelledby="checkout-dialog-title"
      >
        <StyledDialogTitle id="checkout-dialog-title">
          Mulig Checkout Route
        </StyledDialogTitle>
        <StyledDialogContent>
          <StyledDialogText>
            Du har {checkoutInfo.remainingScore} tilbage.
            <RouteText>
              Mulig checkout: {checkoutInfo.route}
            </RouteText>
            <InfoText sx={{ mt: 2 }}>
              Havde du forsøg på en double?
            </InfoText>
          </StyledDialogText>
        </StyledDialogContent>
        <StyledDialogActions>
          <ActionButton 
            onClick={() => onClose({ hadDoubleAttempt: false })} 
            color="primary"
          >
            Nej
          </ActionButton>
          <ActionButton 
            onClick={() => onClose({ hadDoubleAttempt: true })} 
            color="primary" 
            variant="contained"
          >
            Ja
          </ActionButton>
        </StyledDialogActions>
      </StyledDialog>
    );
  }

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="checkout-dialog-title"
    >
      <StyledDialogTitle id="checkout-dialog-title">
        Bekræft Checkout
      </StyledDialogTitle>
      <StyledDialogContent>
        <StyledDialogText>
          {step === 1 && (
            <InfoText>
              Er det en korrekt checkout med double?
            </InfoText>
          )}
          {step === 2 && (
            <InfoText>
              Hvor mange pile blev brugt på double-forsøg?
            </InfoText>
          )}
        </StyledDialogText>
      </StyledDialogContent>
      <StyledDialogActions>
        {step === 1 && (
          <>
            <ActionButton 
              onClick={handleClose}
              color="error" 
              variant="contained"
              fullWidth
            >
              Nej - Bust
            </ActionButton>
            <InfoText>
              Hvis ja, hvor mange pile blev brugt i alt?
            </InfoText>
            <StyledButtonGroup variant="contained" color="primary">
              <ActionButton onClick={() => handleDartsUsed(1)}>1 pil</ActionButton>
              <ActionButton onClick={() => handleDartsUsed(2)}>2 pile</ActionButton>
              <ActionButton onClick={() => handleDartsUsed(3)}>3 pile</ActionButton>
            </StyledButtonGroup>
          </>
        )}
        {step === 2 && (
          <>
            <InfoText>
              Antal pile brugt på double:
            </InfoText>
            <StyledButtonGroup variant="contained" color="primary">
              <ActionButton onClick={() => handleDoubleAttempts(1)}>1 pil</ActionButton>
              <ActionButton onClick={() => handleDoubleAttempts(2)}>2 pile</ActionButton>
              <ActionButton onClick={() => handleDoubleAttempts(3)}>3 pile</ActionButton>
            </StyledButtonGroup>
          </>
        )}
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default CheckoutDialog; 