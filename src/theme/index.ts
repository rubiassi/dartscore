import { createTheme, Components, Theme } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';

// Type declarations
declare module '@mui/material/styles' {
  interface TypeBackground {
    dark: string;
  }

  interface PaletteColor {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  interface TypographyVariants {
    score: React.CSSProperties;
    shortcutScore: React.CSSProperties;
    actionButton: React.CSSProperties;
    playerName: React.CSSProperties;
    stats: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    score?: React.CSSProperties;
    shortcutScore?: React.CSSProperties;
    actionButton?: React.CSSProperties;
    playerName?: React.CSSProperties;
    stats?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    score: true;
    shortcutScore: true;
    actionButton: true;
    playerName: true;
    stats: true;
  }
}

// Farvepalette
const colors = {
  primary: {
    main: '#34495e',      // Header baggrund
    dark: '#2c3e50',      // Hovedbaggrund
    light: '#364c64',     // Hover farve
    contrastText: '#ffffff',
    100: '#f0fdf9',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  secondary: {
    main: '#2e4058',      // Fast score baggrund
    dark: '#1f2d3d',      // Border farve
    light: '#3d4d63',     // Lysere variant
    contrastText: '#ffffff',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    main: '#4caf50',      // Success/OK farve
    dark: '#388e3c',
    light: '#66bb6a',
    contrastText: '#ffffff',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  error: {
    main: '#ff5722',      // Error/BUST farve
    dark: '#d84315',
    light: '#ff7043',
    contrastText: '#ffffff',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  text: {
    primary: '#ffffff',           // Hvid tekst
    secondary: 'rgba(255, 255, 255, 0.8)',  // Let nedtonet hvid
    disabled: 'rgba(255, 255, 255, 0.5)',   // Mere nedtonet hvid
  },
  background: {
    default: '#2c3e50',    // Hovedbaggrund
    paper: '#34495e',      // Komponent baggrund
    dark: '#1a1a20',       // Mørkere baggrund
  },
  divider: '#1f2d3d',
};

// Breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

// Transitions
const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// Typography
const typography: TypographyOptions = {
  fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  button: {
    textTransform: 'none',
  },
  score: {
    fontSize: '1.5rem',
    fontWeight: 400,
    [`@media (min-width:${breakpoints.values.sm}px)`]: {
      fontSize: '1.75rem',
    },
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '2rem',
    },
  },
  shortcutScore: {
    fontSize: '1.25rem',
    fontWeight: 700,
    [`@media (min-width:${breakpoints.values.sm}px)`]: {
      fontSize: '1.75rem',
    },
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '2rem',
    },
  },
  actionButton: {
    fontSize: '1rem',
    [`@media (min-width:${breakpoints.values.sm}px)`]: {
      fontSize: '1.2rem',
    },
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '1.4rem',
    },
  },
  playerName: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  stats: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  h1: {
    fontSize: '1.75rem',
    fontWeight: 700,
    lineHeight: 1.2,
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '2.25rem',
    },
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '1.875rem',
    },
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '1.5rem',
    },
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '1.25rem',
    },
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '1.125rem',
    },
  },
  h6: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '1rem',
    },
  },
  body1: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '1rem',
    },
  },
  body2: {
    fontSize: '0.75rem',
    lineHeight: 1.5,
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      fontSize: '0.875rem',
    },
  },
};

// Component overrides
const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: colors.background.default,
        color: colors.text.primary,
        lineHeight: 1.5,
        margin: 0,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '0.5rem',
        padding: '0.75rem 2rem',
        transition: 'all 0.2s ease-in-out',
        [`@media (min-width:${breakpoints.values.md}px)`]: {
          padding: '1rem 3rem',
        },
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
        '&.button--small': {
          padding: '0.375rem 1.5rem',
          [`@media (min-width:${breakpoints.values.md}px)`]: {
            padding: '0.5rem 2rem',
          },
        },
      },
      contained: {
        backgroundColor: colors.primary[500],
        color: colors.text.primary,
        '&:hover': {
          backgroundColor: colors.primary[600],
        },
      },
      outlined: {
        borderColor: colors.divider,
        color: colors.text.primary,
        '&:hover': {
          borderColor: colors.primary[500],
          backgroundColor: 'rgba(20, 184, 166, 0.1)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: colors.background.paper,
        borderRadius: '0.5rem',
        padding: '1rem',
        [`@media (min-width:${breakpoints.values.md}px)`]: {
          padding: '2rem',
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        backgroundColor: colors.background.paper,
        color: colors.text.primary,
        borderRadius: '0.5rem',
        margin: '1rem',
        width: 'calc(100% - 2rem)',
        maxWidth: '600px',
        [`@media (min-width:${breakpoints.values.md}px)`]: {
          margin: '2rem',
          width: 'auto',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          color: colors.text.primary,
          fontSize: '0.875rem',
          [`@media (min-width:${breakpoints.values.md}px)`]: {
            fontSize: '1rem',
          },
          '& fieldset': {
            borderColor: colors.divider,
          },
          '&:hover fieldset': {
            borderColor: colors.primary[500],
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primary[500],
          },
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: colors.background.paper,
        color: colors.text.primary,
      },
    },
  },
};

// Opretter og eksporterer det samlede theme
export const theme = createTheme({
  palette: colors,
  typography,
  components,
  breakpoints: {
    values: breakpoints.values,
  },
  transitions,
  spacing: 4, // Base spacing unit i pixels
});

export type { Theme }; 