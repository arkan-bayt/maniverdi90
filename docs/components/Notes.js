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
  InputLabel,
  CardActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notes as NotesIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  PriorityHigh as HighIcon,
  Remove as MediumIcon,
  KeyboardArrowDown as LowIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosConfig';

const Notes = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    createdDate: '',
    createdTime: ''
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'general', label: t('notes.categories.general') },
    { value: 'important', label: t('notes.categories.important') },
    { value: 'reminder', label: t('notes.categories.reminder') },
    { value: 'task', label: t('notes.categories.task') }
  ];

  const priorities = [
    { value: 'low', label: t('notes.priorities.low'), color: 'success', icon: <LowIcon /> },
    { value: 'medium', label: t('notes.priorities.medium'), color: 'warning', icon: <MediumIcon /> },
    { value: 'high', label: t('notes.priorities.high'), color: 'error', icon: <HighIcon /> }
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = api.getNotes ? await api.getNotes() : await api.get('/notes');
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    setEditingNote(null);
    const now = new Date();
    setFormData({ 
      title: '', 
      content: '', 
      category: 'general', 
      priority: 'medium',
      createdDate: now.toISOString().split('T')[0],
      createdTime: now.toTimeString().slice(0,5)
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title || '',
      content: note.content || '',
      category: note.category || 'general',
      priority: note.priority || 'medium',
      createdDate: note.createdDate ? note.createdDate.split('T')[0] : '',
      createdTime: note.createdTime || ''
    });
    setErrors({});
    setDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleDeleteNote = (note) => {
    setSelectedNote(note);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleSubmit = async () => {
    const validationErrors = {};
    
    if (!formData.title.trim()) {
      validationErrors.title = t('validation.required');
    }
    
    if (!formData.content.trim()) {
      validationErrors.content = t('validation.required');
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        priority: formData.priority,
        createdDate: formData.createdDate,
        createdTime: formData.createdTime
      };

      if (editingNote) {
        await (api.updateNote ? api.updateNote(editingNote._id, noteData) : api.put(`/notes/${editingNote._id}`, noteData));
      } else {
        await (api.createNote ? api.createNote(noteData) : api.post('/notes', noteData));
      }

      setDialogOpen(false);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      await (api.deleteNote ? api.deleteNote(selectedNote._id) : api.delete(`/notes/${selectedNote._id}`));
      setDeleteDialogOpen(false);
      setSelectedNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
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

  const handleMenuClick = (event, note) => {
    setMenuAnchor(event.currentTarget);
    setSelectedNote(note);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedNote(null);
  };

  const getPriorityConfig = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1];
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'default',
      important: 'error',
      reminder: 'warning',
      task: 'info'
    };
    return colors[category] || 'default';
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || note.category === filterCategory;
    const matchesPriority = !filterPriority || note.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

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
            {t('notes.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('notes.notesList')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('common.refresh')}>
            <IconButton onClick={fetchNotes} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNote}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: 'secondary.main',
              '&:hover': {
                bgcolor: 'secondary.dark'
              }
            }}
          >
            {t('notes.addNote')}
          </Button>
        </Box>
      </Box>

      {/* Summary and Filters */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'secondary.main',
                    width: 56,
                    height: 56
                  }}
                >
                  <NotesIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {notes.length} {t('notes.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('notes.notesList')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>{t('notes.category')}</InputLabel>
            <Select
              value={filterCategory}
              label={t('notes.category')}
              onChange={(e) => setFilterCategory(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>{t('notes.priority')}</InputLabel>
            <Select
              value={filterPriority}
              label={t('notes.priority')}
              onChange={(e) => setFilterPriority(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {priorities.map((priority) => (
                <MenuItem key={priority.value} value={priority.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {priority.icon}
                    <Typography sx={{ ml: 1 }}>{priority.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

      {/* Notes Grid */}
      <Grid container spacing={3}>
        {loading ? (
          [...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: 2, height: 200 }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : filteredNotes.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <NotesIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {t('notes.noNotes')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note._id}>
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                      {note.title}
                    </Typography>
                    <IconButton
                      onClick={(e) => handleMenuClick(e, note)}
                      size="small"
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={categories.find(c => c.value === note.category)?.label || note.category}
                      color={getCategoryColor(note.category)}
                      size="small"
                    />
                    <Chip
                      label={getPriorityConfig(note.priority).label}
                      color={getPriorityConfig(note.priority).color}
                      size="small"
                      icon={getPriorityConfig(note.priority).icon}
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(note.createdAt)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditNote(selectedNote)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          {t('common.edit')}
        </MenuItem>
        <MenuItem onClick={() => handleDeleteNote(selectedNote)}>
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingNote ? t('notes.editNote') : t('notes.addNote')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('notes.noteTitle')}
                value={formData.title}
                onChange={handleInputChange('title')}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('notes.category')}</InputLabel>
                <Select
                  value={formData.category}
                  label={t('notes.category')}
                  onChange={handleInputChange('category')}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('notes.priority')}</InputLabel>
                <Select
                  value={formData.priority}
                  label={t('notes.priority')}
                  onChange={handleInputChange('priority')}
                >
                  {priorities.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {priority.icon}
                        <Typography sx={{ ml: 1 }}>{priority.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('notes.createdDate')}
                type="date"
                value={formData.createdDate}
                onChange={handleInputChange('createdDate')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('notes.createdTime')}
                type="time"
                value={formData.createdTime}
                onChange={handleInputChange('createdTime')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('notes.noteContent')}
                multiline
                rows={6}
                value={formData.content}
                onChange={handleInputChange('content')}
                error={!!errors.content}
                helperText={errors.content}
                required
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
            color="secondary"
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
            {t('notes.deleteConfirm')}
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

export default Notes;