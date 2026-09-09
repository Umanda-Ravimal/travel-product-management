import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#087F7B',
      dark: '#056461',
      light: '#DDF4F1',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#F59E0B',
    },

    success: {
      main: '#10B981',
      light: '#DDF7EC',
    },

    warning: {
      main: '#F59E0B',
      light: '#FFF3D6',
    },

    error: {
      main: '#EF4444',
      light: '#FDE2E2',
    },

    background: {
      default: '#F7F9F9',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#142433',
      secondary: '#607080',
    },

    divider: '#E5E9EC',
  },

  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),

    h1: {
      fontSize: '1.75rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
    },

    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.25,
    },

    h3: {
      fontSize: '1.125rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },

    h4: {
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },

    h5: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },

    h6: {
      fontSize: '0.9375rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },

    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 700,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
    },

    subtitle2: {
      fontSize: '0.8125rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },

    body1: {
      fontSize: '0.9375rem',
      fontWeight: 400,
    },

    body2: {
      fontSize: '0.8125rem',
      fontWeight: 400,
    },

    button: {
      fontWeight: 600,
      textTransform: 'none',
    },

    caption: {
      fontSize: '0.75rem',
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 9,
          boxShadow: 'none',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E5E9EC',
          boxShadow: '0 2px 12px rgba(20, 36, 51, 0.04)',
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 9,
        },
      },
    },
  },
});