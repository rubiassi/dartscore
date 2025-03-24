import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  styled
} from '@mui/material';

interface DoubleAttemptModalProps {
  checkDartsOptions: number[];
  onSelectDarts: (attempts: number) => void;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
    minWidth: 300,
    maxWidth: 400
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&.close-button': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    }
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled
  }
}));

const ButtonGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  '& > button': {
    height: '48px'
  }
}));

const DoubleAttemptModal: React.FC<DoubleAttemptModalProps> = ({
  checkDartsOptions,
  onSelectDarts,
  onClose
}) => {
  const [availableCheckDarts, setAvailableCheckDarts] = useState<number[]>([]);

  useEffect(() => {
    if (checkDartsOptions && Array.isArray(checkDartsOptions)) {
      setAvailableCheckDarts(checkDartsOptions);
    }
  }, [checkDartsOptions]);

  return (
    <StyledDialog 
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" align="center">
          Hvor mange pile forsøgte du på doubler?
        </Typography>
      </DialogTitle>

      <DialogContent>
        <ButtonGrid>
          {[1, 2, 3].map((darts) => (
            <StyledButton
              key={darts}
              onClick={() => onSelectDarts(darts)}
              disabled={!availableCheckDarts.includes(darts)}
            >
              {darts} {darts === 1 ? 'Double' : 'Doubler'}
            </StyledButton>
          ))}
        </ButtonGrid>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <StyledButton 
            onClick={onClose}
            className="close-button"
          >
            Annuller
          </StyledButton>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default DoubleAttemptModal; 