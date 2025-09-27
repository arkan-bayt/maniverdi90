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
  Fab,
  Chip,
  Avatar,
  Alert,
  Skeleton,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ImportExport as ImportIcon,
  Search as SearchIcon,
  AttachMoney,
  MoreVert as MoreIcon,
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosConfig';

const Imports = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingImport, setEditingImport] = useState(null);
  const [selectedImport, setSelectedImport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5)
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchImports();
  }, []);

  const fetchImports = async () => {
    try {
      setLoading(true);
      const response = api.getImports ? await api.getImports() : await api.get('/imports');
      setImports(response.data.imports || []);
      setTotalAmount(response.data.totalAmount || 0);
    } catch (error) {
      console.error('Error fetching imports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImport = () => {
    setEditingImport(null);
    setFormData({ 
      productName: '', 
      price: '', 
      notes: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5)
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleEditImport = (importItem) => {
    setEditingImport(importItem);
    const itemDate = new Date(importItem.createdAt);
    setFormData({
      productName: importItem.productName || '',
      price: importItem.price || '',
      notes: importItem.notes || '',
      date: itemDate.toISOString().split('T')[0],
      time: itemDate.toTimeString().slice(0, 5)
    });
    setErrors({});
    setDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleDeleteImport = (importItem) => {
    setSelectedImport(importItem);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleSubmit = async () => {
    const validationErrors = {};
    
    if (!formData.productName.trim()) {
      validationErrors.productName = t('validation.required');
    }
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      validationErrors.price = t('validation.positiveNumber');
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const importData = {
        productName: formData.productName.trim(),
        price: Number(formData.price),
        notes: formData.notes.trim()
      };

      if (editingImport) {
        // Update existing import
        await (api.updateImport ? api.updateImport(editingImport._id, importData) : api.put(`/imports/${editingImport._id}`, importData));
      } else {
        // Create new import
        await (api.createImport ? api.createImport(importData) : api.post('/imports', importData));
      }

      setDialogOpen(false);
      fetchImports();
    } catch (error) {
      console.error('Error saving import:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      await (api.deleteImport ? api.deleteImport(selectedImport._id) : api.delete(`/imports/${selectedImport._id}`));
      setDeleteDialogOpen(false);
      setSelectedImport(null);
      fetchImports();
    } catch (error) {
      console.error('Error deleting import:', error);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleMenuClick = (event, importItem) => {
    setMenuAnchor(event.currentTarget);
    setSelectedImport(importItem);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedImport(null);
  };

  const filteredImports = imports.filter(item =>
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
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
            {t('imports.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('imports.importsList')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('common.refresh')}>
            <IconButton onClick={fetchImports} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddImport}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            {t('imports.addImport')}
          </Button>
        </Box>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'success.main',
                width: 56,
                height: 56
              }}
            >
              <ImportIcon fontSize="large" />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {imports.length} {t('imports.title')}
              </Typography>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                ${totalAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('imports.totalAmount')}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

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

      {/* Imports Table */}
      <Card sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('imports.productName')}</TableCell>
                <TableCell align="right">{t('common.price')}</TableCell>
                <TableCell>{t('common.notes')}</TableCell>
                <TableCell align="right">{t('common.date')}</TableCell>
                <TableCell align="right">{t('common.time')}</TableCell>
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
                  </TableRow>
                ))
              ) : filteredImports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {t('imports.noImports')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredImports.map((importItem) => (
                  <TableRow key={importItem._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'success.light', mr: 2, width: 40, height: 40 }}>
                          <ImportIcon />
                        </Avatar>
                        <Typography fontWeight="medium">
                          {importItem.productName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`$${importItem.price.toLocaleString()}`}
                        color="success"
                        variant="outlined"
                        icon={<AttachMoney />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {importItem.notes || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatDate(importItem.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary">
                        {new Date(importItem.createdAt).toLocaleTimeString('ar', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, importItem)}
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
        <MenuItem onClick={() => handleEditImport(selectedImport)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          {t('common.edit')}
        </MenuItem>
        <MenuItem onClick={() => handleDeleteImport(selectedImport)}>
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
          {editingImport ? t('imports.editImport') : t('imports.addImport')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('imports.productName')}
                value={formData.productName}
                onChange={handleInputChange('productName')}
                error={!!errors.productName}
                helperText={errors.productName}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('common.price')}
                type="number"
                value={formData.price}
                onChange={handleInputChange('price')}
                error={!!errors.price}
                helperText={errors.price}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('common.date')}
                type="date"
                value={formData.date}
                onChange={handleInputChange('date')}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('common.time')}
                type="time"
                value={formData.time}
                onChange={handleInputChange('time')}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('common.notes')}
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleInputChange('notes')}
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
            {t('imports.deleteConfirm')}
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

export default Imports;