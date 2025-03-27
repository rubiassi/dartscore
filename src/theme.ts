import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0B1121',
      paper: '#1E293B',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    divider: 'rgba(241, 245, 249, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      letterSpacing: '0.01em',
    },
    subtitle2: {
      letterSpacing: '0.01em',
      fontWeight: 500,
    },
    body1: {
      letterSpacing: '0.01em',
    },
    body2: {
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0EA5E9',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#0284C7',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
          },
        },
        containedSecondary: {
          backgroundColor: '#10B981',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#059669',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#1E293B', 0.9),
          borderRadius: 12,
          border: '1px solid rgba(241, 245, 249, 0.06)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            border: '1px solid rgba(241, 245, 249, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#1E293B', 0.9),
          backgroundImage: 'none',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          '&.MuiChip-filled': {
            backgroundColor: alpha('#1E293B', 0.9),
            border: '1px solid rgba(241, 245, 249, 0.08)',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              backgroundColor: alpha('#1E293B', 0.95),
              border: '1px solid rgba(241, 245, 249, 0.12)',
            },
          },
        },
        icon: {
          color: 'inherit',
        },
        deleteIcon: {
          color: 'inherit',
          '&:hover': {
            color: alpha('#fff', 0.8),
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0EA5E9', 0.08),
          borderRadius: 6,
          height: 6,
        },
        bar: {
          backgroundColor: '#0EA5E9',
          borderRadius: 6,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#1E293B', 0.9),
          border: '2px solid rgba(14, 165, 233, 0.3)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            border: '2px solid rgba(14, 165, 233, 0.5)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderWidth: '1.5px',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '1.5px',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(241, 245, 249, 0.08)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: alpha('#1E293B', 0.95),
        },
      },
    },
  },
});

export default theme; 