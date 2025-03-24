import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  styled
} from '@mui/material';
import dartData from '../../data/Double-UD.json';

interface DartCheckoutModalProps {
  dartsOptions: {
    rest: number;
    points: number;
    darts: number;
    checkdarts: number[];
  };
  onSelectDarts: (rest: number, darts: number, doubles: number) => void;
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

const DartCheckoutModal: React.FC<DartCheckoutModalProps> = ({
  dartsOptions,
  onSelectDarts,
  onClose
}) => {
  const [step, setStep] = useState(1);
  const [selectedDarts, setSelectedDarts] = useState<number | null>(null);
  const [availableDartsOptions, setAvailableDartsOptions] = useState<number[]>([]);
  const [filteredCheckDarts, setFilteredCheckDarts] = useState<number[]>([]);

  useEffect(() => {
    if (dartsOptions) {
      const matchingOptions = findAllMatchingDartsOptions(dartsOptions.rest, 0);
      const validDartsOptions = Array.from(new Set(matchingOptions.map(option => option.darts)));
      setAvailableDartsOptions(validDartsOptions);
    }
  }, [dartsOptions]);

  const findAllMatchingDartsOptions = (rest: number, points: number) => {
    return dartData.filter(option => option.rest === rest && option.points === points);
  };

  const handleDartsUsedSelect = (value: number) => {
    setSelectedDarts(value);
    const matchingOption = findAllMatchingDartsOptions(dartsOptions.rest, 0)
      .find(option => option.darts === value);
    
    if (matchingOption) {
      setFilteredCheckDarts(matchingOption.checkdarts);
    }
    setStep(2);
  };

  const handleCheckDartsSelect = (value: number) => {
    onSelectDarts(dartsOptions.rest, selectedDarts!, value);
    onClose();
  };

  return (
    <StyledDialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography component="div" align="center">
          {step === 1 ? 'Hvor mange pile brugte du til at lukke?' : 'Hvor mange pile brugte du på doubler?'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {step === 1 ? (
          <ButtonGrid>
            {[1, 2, 3].map((darts) => (
              <StyledButton
                key={darts}
                onClick={() => handleDartsUsedSelect(darts)}
                disabled={!availableDartsOptions.includes(darts)}
              >
                {darts} {darts === 1 ? 'Pil' : 'Pile'}
              </StyledButton>
            ))}
          </ButtonGrid>
        ) : (
          <ButtonGrid>
            {[1, 2, 3].map((darts) => (
              <StyledButton
                key={darts}
                onClick={() => handleCheckDartsSelect(darts)}
                disabled={!filteredCheckDarts.includes(darts)}
              >
                {darts} {darts === 1 ? 'Double' : 'Doubler'}
              </StyledButton>
            ))}
          </ButtonGrid>
        )}
        
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

export default DartCheckoutModal; 