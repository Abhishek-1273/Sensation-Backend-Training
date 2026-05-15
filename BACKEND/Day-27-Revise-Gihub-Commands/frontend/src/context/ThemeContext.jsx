import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
  }, [mode]);

  const theme = useMemo(
    () => {
      let createdTheme = createTheme({
        palette: {
          mode,
          primary: {
            main: '#0d9488',       // Teal
            light: '#5eead4',      // Teal light
            dark: '#0f766e',       // Teal dark
          },
          secondary: {
            main: '#134e4a',       // Deep teal
          },
          background: {
            default: mode === 'light' ? '#eef2f7' : '#0f172a',
            paper: mode === 'light' ? '#f8fafc' : '#1e293b',
          },
          text: {
            primary: mode === 'light' ? '#1e293b' : '#f8fafc',
            secondary: mode === 'light' ? '#64748b' : '#94a3b8',
          },
          divider: mode === 'light' ? '#b0bdd0' : '#334155',
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", "Inter", "system-ui", sans-serif',
          h1: { fontWeight: 800 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 700 },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: mode === 'light' ? '#b0bdd0' : '#334155',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRight: `2px solid ${mode === 'light' ? '#b0bdd0' : '#334155'}`,
                backgroundColor: mode === 'light' ? '#f8fafc' : '#1e293b',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                padding: '10px 20px',
              },
              containedPrimary: {
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#0f766e',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0d9488',
                  boxShadow: '0 0 0 3px rgba(13, 148, 136, .12)',
                },
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: '#0d9488',
                '&.Mui-checked': {
                  color: '#0d9488',
                },
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                '&.Mui-checked': {
                  color: '#0d9488',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#0d9488',
                  },
                },
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              indicator: {
                backgroundColor: '#0d9488',
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                '&.Mui-selected': {
                  color: '#0d9488',
                },
              },
            },
          },
          MuiLink: {
            styleOverrides: {
              root: {
                color: '#0d9488',
                '&:hover': {
                  color: '#0f766e',
                },
              },
            },
          },
        },
      });
      return responsiveFontSizes(createdTheme);
    },
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};