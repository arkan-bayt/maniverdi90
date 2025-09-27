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
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  AttachMoney,
  MoreVert as MoreIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosConfig';

const Employees = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [totalSalary, setTotalSalary] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    monthlySalary: '',
    startDate: '',
    startTime: '',
    active: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = api.getEmployees ? await api.getEmployees() : await api.get('/employees');
      setEmployees(response.data.employees || []);
      setTotalSalary(response.data.totalSalary || 0);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    const now = new Date();
    setFormData({ 
      name: '', 
      jobTitle: '', 
      monthlySalary: '', 
      startDate: now.toISOString().split('T')[0],
      startTime: now.toTimeString().slice(0,5),
      active: true 
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name || '',
      jobTitle: employee.jobTitle || '',
      monthlySalary: employee.monthlySalary || '',
      startDate: employee.startDate ? employee.startDate.split('T')[0] : '',
      startTime: employee.startTime || '',
      active: employee.active !== undefined ? employee.active : true
    });
    setErrors({});
    setDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleDeleteEmployee = (employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleSubmit = async () => {
    const validationErrors = {};
    
    if (!formData.name.trim()) {
      validationErrors.name = t('validation.required');
    }
    
    if (!formData.jobTitle.trim()) {
      validationErrors.jobTitle = t('validation.required');
    }
    
    if (!formData.monthlySalary || isNaN(formData.monthlySalary) || Number(formData.monthlySalary) <= 0) {
      validationErrors.monthlySalary = t('validation.positiveNumber');
    }

    if (!formData.startDate) {
      validationErrors.startDate = t('validation.required');
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const employeeData = {
        name: formData.name.trim(),
        jobTitle: formData.jobTitle.trim(),
        monthlySalary: Number(formData.monthlySalary),
        startDate: formData.startDate,
        active: formData.active
      };

      if (editingEmployee) {
        await (api.updateEmployee ? api.updateEmployee(editingEmployee._id, employeeData) : api.put(`/employees/${editingEmployee._id}`, employeeData));
      } else {
        await (api.createEmployee ? api.createEmployee(employeeData) : api.post('/employees', employeeData));
      }

      setDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      await (api.deleteEmployee ? api.deleteEmployee(selectedEmployee._id) : api.delete(`/employees/${selectedEmployee._id}`));
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleInputChange = (field) => (event) => {
    const value = field === 'active' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleMenuClick = (event, employee) => {
    setMenuAnchor(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
            {t('employees.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('employees.employeesList')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('common.refresh')}>
            <IconButton onClick={fetchEmployees} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEmployee}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: 'info.main',
              '&:hover': {
                bgcolor: 'info.dark'
              }
            }}
          >
            {t('employees.addEmployee')}
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'info.main',
                    width: 56,
                    height: 56
                  }}
                >
                  <PeopleIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {employees.length} {t('employees.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('employees.employeesList')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'success.main',
                    width: 56,
                    height: 56
                  }}
                >
                  <AttachMoney fontSize="large" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    ${totalSalary.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('employees.totalSalary')}
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

      {/* Employees Table */}
      <Card sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('employees.employeeName')}</TableCell>
                <TableCell>{t('employees.jobTitle')}</TableCell>
                <TableCell align="right">{t('employees.monthlySalary')}</TableCell>
                <TableCell align="right">{t('employees.startDate')}</TableCell>
                <TableCell align="right">{t('employees.startTime')}</TableCell>
                <TableCell align="center">{t('employees.status')}</TableCell>
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
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {t('employees.noEmployees')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'info.light', mr: 2, width: 40, height: 40 }}>
                          <PersonIcon />
                        </Avatar>
                        <Typography fontWeight="medium">
                          {employee.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2">
                          {employee.jobTitle}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`$${employee.monthlySalary.toLocaleString()}`}
                        color="success"
                        variant="outlined"
                        icon={<AttachMoney />}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatDate(employee.startDate)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary">
                        {employee.startTime || '--:--'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={employee.active ? t('employees.active') : t('employees.inactive')}
                        color={employee.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, employee)}
                        size="small"
                      >
                        <MoreIcon />
                      </IconButton>
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
        <MenuItem onClick={() => handleEditEmployee(selectedEmployee)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          {t('common.edit')}
        </MenuItem>
        <MenuItem onClick={() => handleDeleteEmployee(selectedEmployee)}>
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
          {editingEmployee ? t('employees.editEmployee') : t('employees.addEmployee')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('employees.employeeName')}
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('employees.jobTitle')}
                value={formData.jobTitle}
                onChange={handleInputChange('jobTitle')}
                error={!!errors.jobTitle}
                helperText={errors.jobTitle}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('employees.monthlySalary')}
                type="number"
                value={formData.monthlySalary}
                onChange={handleInputChange('monthlySalary')}
                error={!!errors.monthlySalary}
                helperText={errors.monthlySalary}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('employees.startDate')}
                type="date"
                value={formData.startDate}
                onChange={handleInputChange('startDate')}
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('employees.startTime')}
                type="time"
                value={formData.startTime}
                onChange={handleInputChange('startTime')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleInputChange('active')}
                    color="primary"
                  />
                }
                label={t('employees.active')}
              />
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
            color="info"
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
            {t('employees.deleteConfirm')}
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

export default Employees;