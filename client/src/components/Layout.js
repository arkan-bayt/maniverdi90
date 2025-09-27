import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ImportExport as ImportIcon,
  Output as ExportIcon,
  People as EmployeesIcon,
  Notes as NotesIcon,
  SupervisorAccount as UsersIcon,
  AccountCircle,
  Logout,
  Settings,
  Language as LanguageIcon,
  Notifications,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout, canManageUsers } = useAuth();
  const { languages, currentLanguage, changeLanguage } = useLanguage();

  const navigationItems = [
    { 
      title: t('nav.dashboard'), 
      icon: <DashboardIcon />, 
      path: '/',
      color: '#667eea'
    },
    { 
      title: t('nav.imports'), 
      icon: <ImportIcon />, 
      path: '/imports',
      color: '#48bb78'
    },
    { 
      title: t('nav.exports'), 
      icon: <ExportIcon />, 
      path: '/exports',
      color: '#ed8936'
    },
    { 
      title: t('nav.employees'), 
      icon: <EmployeesIcon />, 
      path: '/employees',
      color: '#9f7aea'
    },
    { 
      title: t('nav.notes'), 
      icon: <NotesIcon />, 
      path: '/notes',
      color: '#38b2ac'
    },
    ...(canManageUsers ? [{
      title: t('nav.users'),
      icon: <UsersIcon />,
      path: '/users',
      color: '#e53e3e'
    }] : [])
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    handleLanguageClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileClose();
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box 
        sx={{ 
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
        }}
      >
        <Box 
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            MV
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
          Mani Verdi
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
          {t('auth.loginSubtitle')}
        </Typography>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, px: 2, py: 2, overflowY: 'auto' }}>
        <List>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 2.5,
                    backgroundColor: isActive ? `${item.color}15` : 'transparent',
                    color: isActive ? item.color : 'text.primary',
                    border: `2px solid ${isActive ? `${item.color}30` : 'transparent'}`,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: `${item.color}08`,
                      transform: 'translateX(4px)',
                      boxShadow: `0 4px 12px ${item.color}20`,
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive ? item.color : 'text.secondary',
                      minWidth: 40,
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.95rem'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}
        >
          <Avatar 
            sx={{ 
              mr: 2,
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight="600" color="text.primary">
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {t(`users.roles.${user?.role}`)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          color: 'text.primary',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.08)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {navigationItems.find(item => item.path === location.pathname)?.title || t('nav.dashboard')}
            </Typography>
          </Box>

          {/* Header Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton 
                onClick={handleNotificationClick}
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.08)' },
                  color: 'text.secondary'
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Language Selector */}
            <Tooltip title="Language">
              <IconButton 
                onClick={handleLanguageClick}
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.08)' },
                  color: 'text.secondary'
                }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title="Profile">
              <IconButton 
                onClick={handleProfileClick}
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.08)' }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Language Menu */}
      <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={handleLanguageClose}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            selected={lang.code === currentLanguage}
          >
            <Typography sx={{ mr: 2 }}>{lang.flag}</Typography>
            {lang.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          {t('nav.profile')}
        </MenuItem>
        <MenuItem onClick={handleProfileClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t('nav.settings')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('auth.logout')}
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: theme.shadows[8]
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: theme.shadows[2]
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Box
          sx={{
            pt: '80px', // Account for AppBar height + padding
            px: { xs: 2, sm: 3, md: 4 },
            pb: 3,
            maxWidth: '1400px',
            mx: 'auto'
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            minWidth: 320,
            maxWidth: 400
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('common.notifications')}
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            <MenuItem onClick={handleNotificationClose}>
              <ListItemIcon>
                <Badge color="primary" variant="dot">
                  <Notifications fontSize="small" />
                </Badge>
              </ListItemIcon>
              <Box>
                <Typography variant="body2">
                  {t('notifications.newUser')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('notifications.timeAgo', { time: '5 min' })}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose}>
              <ListItemIcon>
                <Badge color="success" variant="dot">
                  <CheckCircle fontSize="small" />
                </Badge>
              </ListItemIcon>
              <Box>
                <Typography variant="body2">
                  {t('notifications.systemUpdate')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('notifications.timeAgo', { time: '1 hour' })}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose}>
              <ListItemIcon>
                <Badge color="warning" variant="dot">
                  <Warning fontSize="small" />
                </Badge>
              </ListItemIcon>
              <Box>
                <Typography variant="body2">
                  {t('notifications.reminder')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('notifications.timeAgo', { time: '2 hours' })}
                </Typography>
              </Box>
            </MenuItem>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

export default Layout;