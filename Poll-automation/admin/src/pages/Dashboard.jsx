import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from '../components/AdminHeader';
import QuizCard from '../components/QuizCard';
import axios from '../utils/axios';

// Create motion components
const MotionCard = motion(Card);

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  console.log('Dashboard:', { user, authLoading });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    if (user && !authLoading) {
      fetchQuizzes();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/quiz');
      setQuizzes(response.data);
    } catch (error) {
      setError('Failed to fetch quizzes');
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (quizId, newStatus) => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz =>
        quiz._id === quizId ? { ...quiz, status: newStatus } : quiz
      )
    );
  };

  const handleDelete = (quizId) => {
    setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quiz.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const getStats = () => {
    const total = quizzes.length;
    const active = quizzes.filter(q => q.status === 'active').length;
    const inactive = quizzes.filter(q => q.status === 'inactive').length;
    const archived = quizzes.filter(q => q.status === 'archived').length;
    const totalParticipants = quizzes.reduce((sum, quiz) => sum + quiz.participants.length, 0);
    
    return { total, active, inactive, archived, totalParticipants };
  };

  const stats = getStats();

  // Show loading while authentication is in progress
  if (authLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Please log in to access the admin dashboard
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminHeader />
      
      <Box sx={{ pt: '80px', px: 3 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">
              Admin Dashboard
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create-quiz')}
              sx={{ px: 3, py: 1.5 }}
            >
              Create New Quiz
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={2}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: 'primary.light',
                  color: 'white'
                }}
              >
                <Typography variant="h4">{stats.total}</Typography>
                <Typography variant="body2">Total Quizzes</Typography>
              </MotionCard>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: 'success.light',
                  color: 'white'
                }}
              >
                <Typography variant="h4">{stats.active}</Typography>
                <Typography variant="body2">Active</Typography>
              </MotionCard>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: 'warning.light',
                  color: 'white'
                }}
              >
                <Typography variant="h4">{stats.inactive}</Typography>
                <Typography variant="body2">Inactive</Typography>
              </MotionCard>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: 'grey.500',
                  color: 'white'
                }}
              >
                <Typography variant="h4">{stats.archived}</Typography>
                <Typography variant="body2">Archived</Typography>
              </MotionCard>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: 'info.light',
                  color: 'white'
                }}
              >
                <Typography variant="h4">{stats.totalParticipants}</Typography>
                <Typography variant="body2">Total Participants</Typography>
              </MotionCard>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: 'secondary.light',
                  color: 'white'
                }}
              >
                <Typography variant="h4">{quizzes.length > 0 ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0) / quizzes.length) : 0}</Typography>
                <Typography variant="body2">Avg Questions</Typography>
              </MotionCard>
            </Grid>
          </Grid>

          {/* Search and Filter */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={difficultyFilter}
                    label="Difficulty"
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Difficulties</MenuItem>
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDifficultyFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Results Count */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredQuizzes.length} of {quizzes.length} quizzes
                </Typography>
              </Box>

              {/* Quizzes Grid */}
              {filteredQuizzes.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredQuizzes.map((quiz, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={quiz._id}>
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                      >
                        <QuizCard
                          quiz={quiz}
                          onStatusUpdate={handleStatusUpdate}
                          onDelete={handleDelete}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No quizzes found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {quizzes.length === 0 
                      ? "You haven't created any quizzes yet. Click 'Create New Quiz' to get started!"
                      : "Try adjusting your search or filter criteria."
                    }
                  </Typography>
                  {quizzes.length === 0 && (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/create-quiz')}
                    >
                      Create Your First Quiz
                    </Button>
                  )}
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 