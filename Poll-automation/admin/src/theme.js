import { createTheme } from '@mui/material/styles';

const createAppTheme = (isDarkMode) => createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: '#6366F1',
      light: isDarkMode ? '#A5B4FC' : '#A5B4FC',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#8B5CF6',
      light: isDarkMode ? '#C4B5FD' : '#C4B5FD',
      dark: '#7C3AED',
    },
    background: {
      default: isDarkMode ? '#0F172A' : '#F8FAFC',
      paper: isDarkMode ? '#1E293B' : '#FFFFFF',
    },
    text: {
      primary: isDarkMode ? '#F1F5F9' : '#1A1C2E',
      secondary: isDarkMode ? '#94A3B8' : '#64748B',
    },
    card: {
      background: isDarkMode ? '#1E293B' : '#FFFFFF',
      hover: isDarkMode ? '#334155' : '#F8FAFC',
    },
    divider: isDarkMode ? '#334155' : '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: isDarkMode ? '#F1F5F9' : '#1A1C2E',
    },
    h2: {
      fontWeight: 700,
      color: isDarkMode ? '#F1F5F9' : '#1A1C2E',
    },
    h3: {
      fontWeight: 600,
      color: isDarkMode ? '#F1F5F9' : '#1A1C2E',
    },
    h4: {
      fontWeight: 600,
      color: isDarkMode ? '#F1F5F9' : '#1A1C2E',
    },
    h5: {
      fontWeight: 600,
      color: isDarkMode ? '#F1F5F9' : '#1A1C2E',
    },
    h6: {
      fontWeight: 600,
      color: isDarkMode ? '#F1F5F9' : '#1A1C2E',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: isDarkMode 
              ? '0 8px 25px rgba(99, 102, 241, 0.4)' 
              : '0 8px 25px rgba(99, 102, 241, 0.3)',
          },
        },
        contained: {
          boxShadow: 'none',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' 
            : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          '&:hover': {
            background: isDarkMode 
              ? 'linear-gradient(135deg, #5B5BD6 0%, #7C3AED 100%)' 
              : 'linear-gradient(135deg, #5B5BD6 0%, #7C3AED 100%)',
          },
        },
        outlined: {
          borderColor: isDarkMode ? '#6366F1' : '#6366F1',
          color: isDarkMode ? '#6366F1' : '#6366F1',
          '&:hover': {
            borderColor: isDarkMode ? '#8B5CF6' : '#8B5CF6',
            backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: isDarkMode ? '#1E293B' : '#FFFFFF',
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: isDarkMode ? '#1E293B' : '#FFFFFF',
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: isDarkMode 
              ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
              : '0 20px 40px rgba(0, 0, 0, 0.15)',
            borderColor: isDarkMode ? '#6366F1' : '#6366F1',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          background: isDarkMode 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          borderBottom: isDarkMode 
            ? '1px solid #334155' 
            : '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDarkMode ? '#6366F1' : '#6366F1',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isDarkMode ? '#8B5CF6' : '#8B5CF6',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default createAppTheme; 