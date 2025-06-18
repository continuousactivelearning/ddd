import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Analytics as AnalyticsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Leaderboard as LeaderboardIcon,
  MilitaryTech as TrophyIcon,
  Star as StarIcon,
  Timer as TimerIcon,
  Code as CodeIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from '../utils/axios';

const QuizCard = ({ quiz, onStatusUpdate, onDelete }) => {
  const theme = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [leaderboardDialogOpen, setLeaderboardDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(quiz.status);
  const [error, setError] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/api/admin/quiz/${quiz._id}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      if (error.response?.status === 404) {
        setError('Quiz not found');
      } else if (error.response?.status === 401) {
        setError('Authentication required');
      } else {
        setError('Failed to fetch analytics. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/api/admin/quiz/${quiz._id}/leaderboard`);
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      if (error.response?.status === 404) {
        setError('Quiz not found');
      } else if (error.response?.status === 401) {
        setError('Authentication required');
      } else {
        setError('Failed to fetch leaderboard. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/admin/quiz/${quiz._id}/status`, { status: newStatus });
      onStatusUpdate(quiz._id, newStatus);
      setStatusDialogOpen(false);
    } catch (error) {
      setError('Failed to update status');
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/admin/quiz/${quiz._id}`);
        onDelete(quiz._id);
      } catch (error) {
        setError('Failed to delete quiz');
        console.error('Error deleting quiz:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleAnalyticsClose = () => {
    setAnalyticsDialogOpen(false);
    setAnalytics(null);
    setError('');
  };

  const handleLeaderboardClose = () => {
    setLeaderboardDialogOpen(false);
    setLeaderboard([]);
    setError('');
  };

  const completedParticipants = quiz.participants.filter(p => p.completedAt).length;
  const averageScore = completedParticipants > 0 
    ? Math.round(quiz.participants.reduce((sum, p) => sum + (p.score || 0), 0) / completedParticipants)
    : 0;

  return (
    <>
      <Card
        sx={{
          width: '100%',
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: '24px',
          p: 3,
          boxShadow: '0 8px 32px rgba(99,102,241,0.10)',
          border: theme => `1.5px solid ${theme.palette.mode === 'dark' ? 'rgba(99,102,241,0.18)' : 'rgba(186, 201, 255, 0.18)'}`,
          background: theme => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #232946 0%, #393e46 100%)'
            : 'linear-gradient(135deg, #e3eafe 0%, #f5f7fa 100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
        '&:hover': {
            transform: 'translateY(-6px) scale(1.015)',
            boxShadow: '0 16px 40px rgba(99, 102, 241, 0.18)',
          },
        }}>
        <CardContent sx={{ flexGrow: 1, p: 4, pb: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              component="h2" 
              sx={{ 
                fontWeight: 800,
                color: theme.palette.text.primary,
                lineHeight: 1.3,
                fontSize: '1.25rem',
                letterSpacing: '-0.5px',
                flex: 1,
                pr: 2
              }}
            >
              {quiz.topic}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip 
                label={quiz.difficulty} 
                color={getDifficultyColor(quiz.difficulty)}
                size="small"
                sx={{ fontWeight: 600, fontSize: '0.95rem', px: 1.2 }}
              />
            <Chip 
              label={quiz.status} 
              color={getStatusColor(quiz.status)}
              size="small"
                sx={{ fontWeight: 600, fontSize: '0.95rem', px: 1.2 }}
            />
            </Box>
          </Box>

          {/* Questions Count */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {quiz.questions.length} questions
            </Typography>
          </Box>

          {/* Quiz Info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              Created: {new Date(quiz.createdAt).toLocaleDateString()}
            </Typography>
            {/* Quiz Code */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1,
              p: 1,
              borderRadius: '8px',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(99, 102, 241, 0.10)' 
                : 'rgba(99, 102, 241, 0.06)',
              border: `1px solid ${theme.palette.mode === 'dark' 
                ? 'rgba(99, 102, 241, 0.18)' 
                : 'rgba(99, 102, 241, 0.12)'}`
            }}>
              <CodeIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                {quiz.quizCode}
              </Typography>
              <Tooltip title="Copy Quiz Code">
                <IconButton 
                  size="small" 
                  onClick={() => copyToClipboard(quiz.quizCode)}
                  sx={{ p: 0.5 }}
                >
                  <LinkIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Stats Grid */}
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <PeopleIcon sx={{ color: theme.palette.primary.main, fontSize: 24, mb: 0.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.1rem' }}>
                  {quiz.participants.length}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Participants
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 24, mb: 0.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.1rem' }}>
                  {completedParticipants}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <TrendingUpIcon sx={{ color: theme.palette.warning.main, fontSize: 24, mb: 0.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.1rem' }}>
                  {averageScore}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Avg Score
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <TimerIcon sx={{ color: theme.palette.info.main, fontSize: 24, mb: 0.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.1rem' }}>
                  {quiz.questions.length * 2}m
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Duration
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: 1,
            justifyContent: 'space-between',
            p: 0,
            mt: 2,
          }}
        >
            <Button
              size="small"
              startIcon={<AnalyticsIcon />}
              onClick={() => {
                fetchAnalytics();
                setAnalyticsDialogOpen(true);
              }}
              disabled={loading}
              sx={{ 
                borderRadius: '12px',
                fontWeight: 600,
              px: 1.5,
              minWidth: 90,
              background: theme => theme.palette.mode === 'dark' ? theme.palette.primary.main : 'white',
              color: theme => theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
              boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
              whiteSpace: 'nowrap',
                '&:hover': {
                background: theme => theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
                color: 'white',
                  transform: 'translateY(-2px)',
              },
              }}
            >
              Analytics
            </Button>
            <Button
              size="small"
              startIcon={<LeaderboardIcon />}
              onClick={() => {
                fetchLeaderboard();
                setLeaderboardDialogOpen(true);
              }}
              disabled={loading}
              sx={{ 
                borderRadius: '12px',
                fontWeight: 600,
              px: 1.5,
              minWidth: 90,
              background: theme => theme.palette.mode === 'dark' ? theme.palette.secondary.main : 'white',
              color: theme => theme.palette.mode === 'dark' ? 'white' : theme.palette.secondary.main,
              boxShadow: '0 2px 8px rgba(139,92,246,0.08)',
              whiteSpace: 'nowrap',
                '&:hover': {
                background: theme => theme.palette.mode === 'dark' ? theme.palette.secondary.dark : theme.palette.secondary.light,
                color: 'white',
                  transform: 'translateY(-2px)',
              },
              }}
            >
              Leaderboard
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setStatusDialogOpen(true)}
              disabled={loading}
              sx={{ 
                borderRadius: '12px',
                fontWeight: 600,
              px: 1.5,
              minWidth: 90,
              background: theme => theme.palette.mode === 'dark' ? theme.palette.warning.main : 'white',
              color: theme => theme.palette.mode === 'dark' ? 'white' : theme.palette.warning.main,
              boxShadow: '0 2px 8px rgba(245,158,11,0.08)',
              whiteSpace: 'nowrap',
                '&:hover': {
                background: theme => theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.warning.light,
                color: 'white',
                  transform: 'translateY(-2px)',
              },
              }}
            >
              Status
            </Button>
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={loading}
            sx={{ 
              borderRadius: '12px',
              fontWeight: 600,
              px: 1.5,
              minWidth: 90,
              background: theme => theme.palette.mode === 'dark' ? theme.palette.error.main : 'white',
              color: theme => theme.palette.mode === 'dark' ? 'white' : theme.palette.error.main,
              boxShadow: '0 2px 8px rgba(239,68,68,0.08)',
              whiteSpace: 'nowrap',
              '&:hover': {
                background: theme => theme.palette.mode === 'dark' ? theme.palette.error.dark : theme.palette.error.light,
                color: 'white',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>

      {/* Analytics Dialog */}
      <Dialog 
        open={analyticsDialogOpen} 
        onClose={handleAnalyticsClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 3,
          pt: 4,
          px: 4,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
          }}>
            <AnalyticsIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
              Quiz Analytics
          </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {quiz.topic}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 4, px: 4, pb: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: '16px', fontSize: '1.1rem' }}>
              {error}
            </Alert>
          ) : analytics ? (
            <Box>
              <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ display: 'flex', alignItems: 'center', p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(99,102,241,0.08)', borderLeft: '6px solid #6366F1', background: theme.palette.background.paper }}>
                    <PeopleIcon sx={{ fontSize: 36, color: '#6366F1', mr: 2 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#6366F1' }}>{analytics.totalParticipants || 0}</Typography>
                      <Typography variant="body2" color="text.secondary">Total Participants</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ display: 'flex', alignItems: 'center', p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(16,185,129,0.08)', borderLeft: '6px solid #10B981', background: theme.palette.background.paper }}>
                    <TrendingUpIcon sx={{ fontSize: 36, color: '#10B981', mr: 2 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>{analytics.averageScore || 0}%</Typography>
                      <Typography variant="body2" color="text.secondary">Average Score</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ display: 'flex', alignItems: 'center', p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(245,158,11,0.08)', borderLeft: '6px solid #F59E0B', background: theme.palette.background.paper }}>
                    <StarIcon sx={{ fontSize: 36, color: '#F59E0B', mr: 2 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>{analytics.highestScore || 0}%</Typography>
                      <Typography variant="body2" color="text.secondary">Highest Score</Typography>
                    </Box>
                  </Card>
              </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ display: 'flex', alignItems: 'center', p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(239,68,68,0.08)', borderLeft: '6px solid #EF4444', background: theme.palette.background.paper }}>
                    <TrendingDownIcon sx={{ fontSize: 36, color: '#EF4444', mr: 2 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#EF4444' }}>{analytics.lowestScore || 0}%</Typography>
                      <Typography variant="body2" color="text.secondary">Lowest Score</Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
              {analytics.recentParticipants && analytics.recentParticipants.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Recent Participants
                  </Typography>
                  <List>
                    {analytics.recentParticipants.map((participant, index) => (
                      <ListItem key={index} sx={{ 
                        borderRadius: '12px', 
                        mb: 1,
                        background: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(0, 0, 0, 0.05)'
                      }}>
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}>
                            {participant.name?.charAt(0)?.toUpperCase() || 'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={participant.name || 'Unknown User'}
                          secondary={`Score: ${participant.score || 0}% • ${new Date(participant.completedAt).toLocaleDateString()}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip 
                            label={`${participant.score || 0}%`} 
                            color={participant.score >= 80 ? 'success' : participant.score >= 60 ? 'warning' : 'error'}
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No analytics data available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start sharing your quiz to see analytics
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button 
            onClick={handleAnalyticsClose}
            sx={{ 
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(99,102,241,0.3)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leaderboard Dialog */}
      <Dialog 
        open={leaderboardDialogOpen} 
        onClose={handleLeaderboardClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 3,
          pt: 4,
          px: 4,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
          }}>
            <TrophyIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
              Leaderboard
          </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {quiz.topic}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 4, px: 4, pb: 2, maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: theme.palette.warning.main }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: '16px', fontSize: '1.1rem' }}>
              {error}
            </Alert>
          ) : leaderboard.length > 0 ? (
            <Box>
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'end', 
                    gap: 2, 
                    mb: 4,
                    height: 200
                  }}>
                    {/* 2nd Place */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 120,
                        height: 140,
                        background: 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)',
                        borderRadius: '16px 16px 0 0',
                        position: 'relative',
                        boxShadow: '0 8px 25px rgba(148, 163, 184, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: '0 12px 35px rgba(148, 163, 184, 0.5)'
                        }
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          top: -20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '4px solid white',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}>
                          <Typography sx={{ fontWeight: 900, color: 'white', fontSize: '1.2rem' }}>
                            2
                          </Typography>
                        </Box>
                        <Typography sx={{ 
                          mt: 4, 
                          fontWeight: 700, 
                          color: 'white', 
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          px: 1,
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>
                          {leaderboard[1]?.name || 'N/A'}
                        </Typography>
                        <Typography sx={{ 
                          fontWeight: 800, 
                          color: 'white', 
                          fontSize: '1.5rem',
                          mt: 1
                        }}>
                          {leaderboard[1]?.score || 0}%
                        </Typography>
                        <Typography sx={{ 
                          fontWeight: 600, 
                          color: 'rgba(255,255,255,0.8)', 
                          fontSize: '0.8rem',
                          mt: 0.5
                        }}>
                          Expert
                        </Typography>
                      </Box>
                    </motion.div>

                    {/* 1st Place */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 140,
                        height: 180,
                        background: 'linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)',
                        borderRadius: '16px 16px 0 0',
                        position: 'relative',
                        boxShadow: '0 12px 35px rgba(245, 158, 11, 0.4)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: '0 16px 40px rgba(245, 158, 11, 0.6)'
                        }
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          top: -25,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '4px solid white',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                        }}>
                          <Typography sx={{ fontWeight: 900, color: 'white', fontSize: '1.4rem' }}>
                            1
                          </Typography>
                        </Box>
                        <Typography sx={{ 
                          mt: 6, 
                          fontWeight: 700, 
                          color: 'white', 
                          fontSize: '1rem',
                          textAlign: 'center',
                          px: 1,
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>
                          {leaderboard[0]?.name || 'N/A'}
                        </Typography>
                        <Typography sx={{ 
                          fontWeight: 800, 
                          color: 'white', 
                          fontSize: '1.8rem',
                          mt: 1
                        }}>
                          {leaderboard[0]?.score || 0}%
                        </Typography>
                        <Typography sx={{ 
                          fontWeight: 600, 
                          color: 'rgba(255,255,255,0.8)', 
                          fontSize: '0.9rem',
                          mt: 0.5
                        }}>
                          Master
                        </Typography>
                      </Box>
                    </motion.div>

                    {/* 3rd Place */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 120,
                        height: 120,
                        background: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
                        borderRadius: '16px 16px 0 0',
                        position: 'relative',
                        boxShadow: '0 8px 25px rgba(205, 127, 50, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: '0 12px 35px rgba(205, 127, 50, 0.5)'
                        }
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          top: -20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '4px solid white',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}>
                          <Typography sx={{ fontWeight: 900, color: 'white', fontSize: '1.2rem' }}>
                            3
                          </Typography>
                        </Box>
                        <Typography sx={{ 
                          mt: 4, 
                          fontWeight: 700, 
                          color: 'white', 
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          px: 1,
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>
                          {leaderboard[2]?.name || 'N/A'}
                        </Typography>
                        <Typography sx={{ 
                          fontWeight: 800, 
                          color: 'white', 
                          fontSize: '1.5rem',
                          mt: 1
                        }}>
                          {leaderboard[2]?.score || 0}%
                        </Typography>
                        <Typography sx={{ 
                          fontWeight: 600, 
                          color: 'rgba(255,255,255,0.8)', 
                          fontSize: '0.8rem',
                          mt: 0.5
                        }}>
                          Pro
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                </motion.div>
              )}

              {/* Full Leaderboard List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card sx={{ 
                  borderRadius: '20px',
                  background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.96)' : 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}>
                  <Box sx={{ p: 3, borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary }}>
                      Complete Leaderboard
                    </Typography>
                  </Box>
              {leaderboard.map((participant, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 3,
                        borderBottom: index < leaderboard.length - 1 ? (theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.05)') : 'none',
                        transition: 'all 0.3s ease',
                      background: index < 3 
                          ? (index === 0 
                              ? (theme.palette.mode === 'dark' ? 'linear-gradient(90deg, rgba(245,158,11,0.12) 0%, rgba(255,215,0,0.10) 100%)' : 'linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(245,158,11,0.1) 100%)')
                          : index === 1 
                                ? (theme.palette.mode === 'dark' ? 'linear-gradient(90deg, rgba(100,116,139,0.13) 0%, rgba(148,163,184,0.10) 100%)' : 'linear-gradient(90deg, rgba(148,163,184,0.1) 0%, rgba(100,116,139,0.1) 100%)')
                                : (theme.palette.mode === 'dark' ? 'linear-gradient(90deg, rgba(184,134,11,0.13) 0%, rgba(205,127,50,0.10) 100%)' : 'linear-gradient(90deg, rgba(205,127,50,0.1) 0%, rgba(184,134,11,0.1) 100%)'))
                          : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.01)' : 'transparent'),
                        '&:hover': {
                          background: theme.palette.mode === 'dark' ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.05)',
                          transform: 'translateX(4px)'
                        }
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: index < 3 
                            ? (index === 0 ? 'linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)'
                              : index === 1 ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)'
                              : 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)')
                            : (theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #6366F1 0%, #6366F1 100%)' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'),
                          mr: 2,
                          boxShadow: index < 3 ? '0 4px 15px rgba(0,0,0,0.2)' : '0 2px 8px rgba(99,102,241,0.2)'
                        }}>
                          <Typography sx={{ 
                            fontWeight: 900, 
                            color: 'white', 
                            fontSize: index < 3 ? '1.2rem' : '1rem',
                            textShadow: theme.palette.mode === 'dark' ? '0 1px 4px #000' : '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      {index + 1}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ 
                              fontWeight: 700, 
                              fontSize: '1.1rem',
                              color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
                              textShadow: theme.palette.mode === 'dark' ? '0 1px 4px #000' : undefined
                            }}>
                          {participant.name}
                        </Typography>
                        {index < 3 && (
                          <StarIcon sx={{ 
                                color: index === 0 ? '#FFD700' : index === 1 ? '#94A3B8' : '#CD7F32',
                                fontSize: 18
                          }} />
                        )}
                      </Box>
                          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                            Completed: {new Date(participant.completedAt).toLocaleString()}
                          </Typography>
                          {index < 3 && (
                            <Typography variant="caption" sx={{ 
                              fontWeight: 600,
                              color: index === 0 ? '#F59E0B' : index === 1 ? '#64748B' : '#B8860B',
                              textShadow: theme.palette.mode === 'dark' ? '0 1px 4px #000' : undefined
                            }}>
                              {index === 0 ? '🏆 Master' : index === 1 ? '🥈 Expert' : '🥉 Pro'}
                            </Typography>
                          )}
                        </Box>
                    <Chip 
                      label={`${participant.score}%`} 
                      color={participant.score >= 80 ? 'success' : participant.score >= 60 ? 'warning' : 'error'}
                          sx={{ 
                            fontWeight: 700, 
                            fontSize: '1rem', 
                            px: 2,
                            py: 1,
                            borderRadius: '12px',
                            background: index < 3 
                              ? (index === 0 
                                  ? (theme.palette.mode === 'dark' ? 'rgba(245,158,11,0.18)' : 'rgba(255,215,0,0.1)')
                                  : index === 1 
                                    ? (theme.palette.mode === 'dark' ? 'rgba(100,116,139,0.18)' : 'rgba(148,163,184,0.1)')
                                    : (theme.palette.mode === 'dark' ? 'rgba(184,134,11,0.18)' : 'rgba(205,127,50,0.1)'))
                              : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : undefined),
                            color: theme.palette.mode === 'dark' ? '#fff' : undefined,
                            boxShadow: theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.18)' : undefined
                          }}
                        />
                      </Box>
                    </motion.div>
                  ))}
                </Card>
              </motion.div>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <TrophyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No participants yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share the quiz code with students to see the leaderboard
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button 
            onClick={handleLeaderboardClose}
            sx={{ 
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(245,158,11,0.3)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={() => setStatusDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: theme.palette.background.paper,
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2,
          pt: 3
        }}>
          Update Quiz Status
        </DialogTitle>
        <DialogContent sx={{ pt: 5 }}>
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setStatusDialogOpen(false)}
            sx={{ borderRadius: '12px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: '12px' }}
          >
            {loading ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuizCard; 