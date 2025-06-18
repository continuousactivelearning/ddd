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
  Divider
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Analytics as AnalyticsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import axios from '../utils/axios';

const QuizCard = ({ quiz, onStatusUpdate, onDelete }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
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
      const response = await axios.get(`/api/admin/quiz/${quiz._id}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      setError('Failed to fetch analytics');
      console.error('Error fetching analytics:', error);
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

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
              {quiz.topic}
            </Typography>
            <Chip 
              label={quiz.status} 
              color={getStatusColor(quiz.status)}
              size="small"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Chip 
              label={quiz.difficulty} 
              color={getDifficultyColor(quiz.difficulty)}
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {quiz.questions.length} questions
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Created: {new Date(quiz.createdAt).toLocaleDateString()}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Quiz Code: <strong>{quiz.quizCode}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Student URL: <strong>http://localhost:5173/quiz/{quiz.quizCode}</strong>
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <PeopleIcon color="primary" />
                <Typography variant="body2" color="text.secondary">
                  {quiz.participants.length} participants
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircleIcon color="success" />
                <Typography variant="body2" color="text.secondary">
                  {quiz.participants.filter(p => p.completedAt).length} completed
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Box>
            <Button
              size="small"
              startIcon={<AnalyticsIcon />}
              onClick={() => {
                fetchAnalytics();
                setAnalyticsDialogOpen(true);
              }}
              disabled={loading}
            >
              Analytics
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setStatusDialogOpen(true)}
              disabled={loading}
            >
              Status
            </Button>
          </Box>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </Button>
        </CardActions>
      </Card>

      {/* Analytics Dialog */}
      <Dialog 
        open={analyticsDialogOpen} 
        onClose={() => setAnalyticsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AnalyticsIcon />
            Quiz Analytics - {quiz.topic}
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          ) : analytics ? (
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="h4" color="white">{analytics.totalParticipants}</Typography>
                  <Typography variant="body2" color="white">Total Participants</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="h4" color="white">{analytics.completedParticipants}</Typography>
                  <Typography variant="body2" color="white">Completed</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="h4" color="white">{analytics.averageScore}%</Typography>
                  <Typography variant="body2" color="white">Avg Score</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="h4" color="white">{analytics.completionRate}%</Typography>
                  <Typography variant="body2" color="white">Completion Rate</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Score Range</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip label={`Highest: ${analytics.highestScore}%`} color="success" />
                  <Chip label={`Lowest: ${analytics.lowestScore}%`} color="error" />
                </Box>
              </Grid>

              {analytics.recentParticipants.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Recent Participants</Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {analytics.recentParticipants.map((participant, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="body2">
                          {participant.user?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {participant.score}% - {participant.completedAt ? new Date(participant.completedAt).toLocaleDateString() : 'In Progress'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalyticsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Quiz Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained"
            disabled={loading}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuizCard; 