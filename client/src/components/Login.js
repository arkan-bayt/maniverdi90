import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Grow
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Login as LoginIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState(null);
  
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const { languages, currentLanguage, changeLanguage } = useLanguage();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError(t('validation.required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || t('auth.invalidCredentials'));
      }
    } catch (error) {
      setError(t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    handleLanguageClose();
  };

  return (
    <Box
      sx={{ 
        minHeight: '100vh',
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1,
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Grow in timeout={800}>
          <Card 
            elevation={24}
            sx={{ 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ padding: 4 }}>
              {/* Language Selector */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleLanguageClick}
                  startIcon={<LanguageIcon />}
                  sx={{
                    borderRadius: 20,
                    textTransform: 'none',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    }
                  }}
                >
                  {languages.find(l => l.code === currentLanguage)?.flag}
                </Button>
                <Menu
                  anchorEl={languageAnchor}
                  open={Boolean(languageAnchor)}
                  onClose={handleLanguageClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                    }
                  }}
                >
                  {languages.map((lang) => (
                    <MenuItem
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      selected={lang.code === currentLanguage}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography variant="h6">{lang.flag}</Typography>
                      </ListItemIcon>
                      <ListItemText primary={lang.name} />
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

            {/* Logo and Title */}
            <Box textAlign="center" mb={4}>
              <Box 
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                }}
              >
                <Typography variant="h4" color="white" fontWeight="bold">
                  MV
                </Typography>
              </Box>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                color="primary.main"
                gutterBottom
              >
                {t('auth.loginTitle')}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ opacity: 0.8 }}
              >
                {t('auth.loginSubtitle')}
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="username"
                label={t('auth.username')}
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <TextField
                fullWidth
                name="password"
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #553c9a 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  },
                  '&:disabled': {
                    background: 'rgba(102, 126, 234, 0.6)',
                  }
                }}
              >
                {loading ? t('common.loading') : t('auth.loginButton')}
              </Button>
            </Box>

            {/* Demo Credentials */}
            <Box mt={4} p={2} bgcolor="grey.50" borderRadius={2}>
              <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                Demo Credentials:
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                Admin: admin/admin • Superuser: iraq/iraq • User: mani/mani
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grow>
    </Container>
    </Box>
  );
};

export default Login;