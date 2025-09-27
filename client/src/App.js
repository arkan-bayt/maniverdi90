import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTranslation } from 'react-i18next';

// Import components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Imports from './components/Imports';
import Exports from './components/Exports';
import Notes from './components/Notes';
import Employees from './components/Employees';
import Users from './components/Users';
import Layout from './components/Layout';

// Import utilities
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import axiosConfig from './utils/axiosConfig';
import './i18n';

// Create theme
const createAppTheme = (direction, mode) => createTheme({
  direction,
  palette: {
    mode,
    primary: {
      main: '#667eea',
      dark: '#5a67d8',
      light: '#7c3aed',
    },
    secondary: {
      main: '#764ba2',
      dark: '#553c9a',
      light: '#9f7aea',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#1a202c',
      paper: mode === 'light' ? '#ffffff' : '#2d3748',
    },
    text: {
      primary: mode === 'light' ? '#2d3748' : '#f7fafc',
      secondary: mode === 'light' ? '#4a5568' : '#e2e8f0',
    },
  },
  typography: {
    fontFamily: direction === 'rtl' 
      ? "'Cairo', 'Roboto', sans-serif" 
      : "'Roboto', 'Cairo', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin' && user.role !== 'superuser') {
    return <Navigate to="/" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

// Main App Component
function App() {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState(() => 
    createAppTheme(i18n.language === 'ar' ? 'rtl' : 'ltr', 'light')
  );

  useEffect(() => {
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
    
    setTheme(createAppTheme(direction, 'light'));
  }, [i18n.language]);

  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <AuthProvider>
            <Router basename={process.env.NODE_ENV === 'production' ? '/maniverdi90' : ''}>
              <div className="App">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/imports" 
                    element={
                      <ProtectedRoute>
                        <Imports />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/exports" 
                    element={
                      <ProtectedRoute>
                        <Exports />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/notes" 
                    element={
                      <ProtectedRoute>
                        <Notes />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/employees" 
                    element={
                      <ProtectedRoute>
                        <Employees />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/users" 
                    element={
                      <ProtectedRoute requiredRole="superuser">
                        <Users />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;