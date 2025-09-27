import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Avatar,
  Alert,
  Skeleton,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SupervisorAccount as UsersIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as SuperuserIcon,
  AccountCircle as UserIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosConfig';

const Users = () => {
  const { t } = useTranslation();
  const { user, canManageUsers } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });

  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'admin', label: t('users.roles.admin'), color: 'error', icon: <AdminIcon /> },
    { value: 'superuser', label: t('users.roles.superuser'), color: 'warning', icon: <SuperuserIcon /> },
    { value: 'user', label: t('users.roles.user'), color: 'info', icon: <UserIcon /> }
  ];

  useEffect(() => {
    if (!canManageUsers) {
      return;
    }
    fetchUsers();
  }, [canManageUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = api.getUsers ? await api.getUsers() : await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ 
      username: '', 
      password: '',
      role: 'user' 
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleEditUser = (userItem) => {
    setEditingUser(userItem);
    setFormData({
      username: userItem.username || '',
      password: '', // Don't show existing password
      role: userItem.role || 'user'
    });
    setErrors({});
    setDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleDeleteUser = (userItem) => {
    setSelectedUser(userItem);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleSubmit = async () => {
    const validationErrors = {};
    
    if (!formData.username.trim()) {
      validationErrors.username = t('validation.required');
    }
    
    if (!editingUser && !formData.password) {
      validationErrors.password = t('validation.required');
    }
    
    if (formData.password && formData.password.length < 4) {
      validationErrors.password = t('validation.minLength', { min: 4 });
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const userData = {
        username: formData.username.trim(),
        role: formData.role
      };

      if (formData.password) {
        userData.password = formData.password;
      }

      if (editingUser) {
        await (api.updateUser ? api.updateUser(editingUser._id, userData) : api.put(`/users/${editingUser._id}`, userData));
      } else {
        await (api.createUser ? api.createUser(userData) : api.post('/users', userData));
      }

      setDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      if (error.response?.status === 409) {
        setErrors({ username: 'Username already exists' });
      }
    }
  };

  const confirmDelete = async () => {
    try {
      await (api.deleteUser ? api.deleteUser(selectedUser._id) : api.delete(`/users/${selectedUser._id}`));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleMenuClick = (event, userItem) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUser(userItem);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  const getRoleConfig = (role) => {
    return roles.find(r => r.value === role) || roles[2];
  };

  const filteredUsers = users.filter(userItem =>
    userItem.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!canManageUsers) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <UsersIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {t('users.accessDenied')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('users.accessDenied')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t('users.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('users.usersList')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('common.refresh')}>
            <IconButton onClick={fetchUsers} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: 'error.main',
              '&:hover': {
                bgcolor: 'error.dark'
              }
            }}
          >
            {t('users.addUser')}
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'error.main',
                    width: 56,
                    height: 56
                  }}
                >
                  <UsersIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {users.length} {t('users.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.usersList')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'error.main',
                    width: 56,
                    height: 56
                  }}
                >
                  <AdminIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {users.filter(u => u.role === 'admin').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.roles.admin')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'warning.main',
                    width: 56,
                    height: 56
                  }}
                >
                  <SuperuserIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {users.filter(u => u.role === 'superuser').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.roles.superuser')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('users.username')}</TableCell>
                <TableCell align="center">{t('users.role')}</TableCell>
                <TableCell align="right">{t('common.date')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {t('users.noUsers')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((userItem) => (
                  <TableRow key={userItem.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: getRoleConfig(userItem.role).color + '.light', mr: 2, width: 40, height: 40 }}>
                          {getRoleConfig(userItem.role).icon}
                        </Avatar>
                        <Typography fontWeight="medium">
                          {userItem.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getRoleConfig(userItem.role).label}
                        color={getRoleConfig(userItem.role).color}
                        icon={getRoleConfig(userItem.role).icon}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {userItem.createdAt ? formatDate(userItem.createdAt) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {userItem.id !== user?.id && (
                        <IconButton
                          onClick={(e) => handleMenuClick(e, userItem)}
                          size="small"
                        >
                          <MoreIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditUser(selectedUser)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          {t('common.edit')}
        </MenuItem>
        <MenuItem onClick={() => handleDeleteUser(selectedUser)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          {t('common.delete')}
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? t('users.editUser') : t('users.addUser')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('users.username')}
                value={formData.username}
                onChange={handleInputChange('username')}
                error={!!errors.username}
                helperText={errors.username}
                required
                disabled={editingUser && editingUser.id === user?.id}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('auth.password')}
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password || (editingUser ? 'Leave empty to keep current password' : '')}
                required={!editingUser}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>{t('users.role')}</InputLabel>
                <Select
                  value={formData.role}
                  label={t('users.role')}
                  onChange={handleInputChange('role')}
                  disabled={editingUser && editingUser.id === user?.id}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {role.icon}
                        <Typography sx={{ ml: 1 }}>{role.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            color="error"
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('users.deleteConfirm')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error"
            variant="contained"
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;