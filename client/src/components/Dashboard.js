import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useTheme,
  alpha,
  Skeleton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  ImportExport as ImportIcon,
  Output as ExportIcon,
  People as EmployeesIcon,
  Notes as NotesIcon,
  AttachMoney,
  CalendarToday,
  History,
  Business,
  Visibility,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axiosConfig';

const StatsCard = ({ title, value, icon, color, growth, loading }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <Card sx={{ height: 160, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton animation="wave" height={30} width="60%" />
          <Skeleton animation="wave" height={40} width="40%" sx={{ my: 1 }} />
          <Skeleton animation="wave" height={20} width="80%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: 160,
        borderRadius: 3,
        background: '#ffffff',
        border: `2px solid ${alpha(color, 0.1)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.6)} 100%)`,
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 40px ${alpha(color, 0.15)}`,
          borderColor: alpha(color, 0.2),
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
          </Box>
          <Avatar 
            sx={{ 
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 56,
              height: 56,
              boxShadow: `0 8px 16px ${alpha(color, 0.2)}`
            }}
          >
            {icon}
          </Avatar>
        </Box>
        {growth !== undefined && (
          <Box display="flex" alignItems="center">
            {growth >= 0 ? (
              <ArrowUpward sx={{ fontSize: 18, color: 'success.main', mr: 0.5 }} />
            ) : (
              <ArrowDownward sx={{ fontSize: 18, color: 'error.main', mr: 0.5 }} />
            )}
            <Typography 
              variant="body2" 
              color={growth >= 0 ? 'success.main' : 'error.main'}
              fontWeight="600"
              sx={{ fontSize: '0.875rem' }}
            >
              {Math.abs(growth)}% {t('dashboard.fromLastMonth')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalImports: 0,
    totalExports: 0,
    totalEmployees: 0,
    totalNotes: 0,
    importAmount: 0,
    exportAmount: 0,
    totalSalary: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  const { t } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all statistics in parallel
      const [
        importsRes,
        exportsRes,
        employeesRes,
        notesRes
      ] = await Promise.all([
        axios.get('/api/imports?limit=5'),
        axios.get('/api/exports?limit=5'),
        axios.get('/api/employees?limit=5'),
        axios.get('/api/notes?limit=5')
      ]);

      setStats({
        totalImports: importsRes.data.pagination?.total || 0,
        totalExports: exportsRes.data.pagination?.total || 0,
        totalEmployees: employeesRes.data.pagination?.total || 0,
        totalNotes: notesRes.data.pagination?.total || 0,
        importAmount: importsRes.data.totalAmount || 0,
        exportAmount: exportsRes.data.totalAmount || 0,
        totalSalary: employeesRes.data.totalSalary || 0
      });

      // Combine recent activities
      const activities = [
        ...(importsRes.data.imports || []).map(item => ({
          id: item._id,
          type: 'import',
          title: t('dashboard.activities.import', { product: item.productName }),
          amount: item.price,
          date: item.createdAt,
          user: item.createdBy?.username || t('dashboard.unknownUser')
        })),
        ...(exportsRes.data.exports || []).map(item => ({
          id: item._id,
          type: 'export',
          title: t('dashboard.activities.export', { product: item.productName }),
          amount: item.price,
          date: item.createdAt,
          user: item.createdBy?.username || t('dashboard.unknownUser')
        })),
        ...(employeesRes.data.employees || []).map(item => ({
          id: item._id,
          type: 'employee',
          title: t('dashboard.activities.employee', { name: item.name }),
          amount: item.salary,
          date: item.createdAt,
          user: item.createdBy?.username || t('dashboard.unknownUser')
        })),
        ...(notesRes.data.notes || []).map(item => ({
          id: item._id,
          type: 'note',
          title: t('dashboard.activities.note', { title: item.title }),
          date: item.createdAt,
          user: item.createdBy?.username || t('dashboard.unknownUser')
        }))
      ];

      // Sort by date and take the most recent 10
      activities.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentActivity(activities.slice(0, 10));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setActivityLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'import': return <ImportIcon fontSize="small" />;
      case 'export': return <ExportIcon fontSize="small" />;
      case 'employee': return <EmployeesIcon fontSize="small" />;
      case 'note': return <NotesIcon fontSize="small" />;
      default: return <DashboardIcon fontSize="small" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'import': return theme.palette.success.main;
      case 'export': return theme.palette.warning.main;
      case 'employee': return theme.palette.info.main;
      case 'note': return theme.palette.secondary.main;
      default: return theme.palette.primary.main;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box 
        sx={{ 
          mb: 4,
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'translate(100px, -100px)',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight="700" gutterBottom>
            {t('dashboard.welcome')}, {user?.username}! 👋
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
            {t('dashboard.quickStats')}
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('dashboard.totalImports')}
            value={stats.totalImports}
            icon={<ImportIcon />}
            color={theme.palette.success.main}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('dashboard.totalExports')}
            value={stats.totalExports}
            icon={<ExportIcon />}
            color={theme.palette.warning.main}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('dashboard.totalEmployees')}
            value={stats.totalEmployees}
            icon={<EmployeesIcon />}
            color={theme.palette.info.main}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('dashboard.totalNotes')}
            value={stats.totalNotes}
            icon={<NotesIcon />}
            color={theme.palette.secondary.main}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Financial Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                p: 3,
                color: 'white'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                    {t('dashboard.importAmount')}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    ${stats.importAmount.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <AttachMoney fontSize="large" />
                </Avatar>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                p: 3,
                color: 'white'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                    {t('dashboard.exportAmount')}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    ${stats.exportAmount.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <AttachMoney fontSize="large" />
                </Avatar>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)',
                p: 3,
                color: 'white'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                    {t('dashboard.totalSalary')}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    ${stats.totalSalary.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <AttachMoney fontSize="large" />
                </Avatar>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            color: 'white'
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" fontWeight="bold" display="flex" alignItems="center">
              <History sx={{ mr: 2 }} />
              {t('dashboard.recentActivity')}
            </Typography>
            <Chip 
              label={`${recentActivity.length} ${t('dashboard.items')}`}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
          </Box>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {activityLoading ? (
            <Box sx={{ p: 3 }}>
              {[...Array(5)].map((_, index) => (
                <Box key={index} display="flex" alignItems="center" py={2} 
                     sx={{ borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none' }}>
                  <Skeleton variant="circular" width={48} height={48} sx={{ mr: 3 }} />
                  <Box flexGrow={1}>
                    <Skeleton animation="wave" height={24} width="70%" sx={{ mb: 1 }} />
                    <Skeleton animation="wave" height={16} width="40%" />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Skeleton animation="wave" height={20} width={80} sx={{ mb: 1 }} />
                    <Skeleton animation="wave" height={16} width={60} />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {recentActivity.map((activity, index) => (
                <ListItem 
                  key={`${activity.type}-${activity.id}`}
                  sx={{ 
                    borderBottom: index < recentActivity.length - 1 ? '1px solid #f0f0f0' : 'none',
                    transition: 'all 0.3s ease',
                    py: 2,
                    px: 3,
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                      transform: 'translateX(-5px)'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: getTypeColor(activity.type),
                        width: 48,
                        height: 48,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    >
                      {getTypeIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5 }}>
                        {activity.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {formatDate(activity.date)}
                        </Typography>
                        <Chip
                          label={activity.user || t('dashboard.unknownUser')}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                    }
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    {activity.amount ? (
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ 
                          color: activity.type === 'import' ? '#48bb78' : 
                                 activity.type === 'export' ? '#ed8936' : '#667eea',
                          mb: 1
                        }}
                      >
                        ${activity.amount.toLocaleString()}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        -
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;