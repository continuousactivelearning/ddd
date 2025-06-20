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
  Stack,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  AutoAwesome as SparklesIcon,
  FlashOn as ZapIcon,
  TrackChanges as TargetIcon,
  NoteAlt as NoteAltIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from '../components/AdminHeader';
import QuizCard from '../components/QuizCard';
import axios from '../utils/axios';
import Chatbot from '../components/Chatbot';
import AllowedStudentsCard from '../components/AllowedStudentsCard';

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
    const completedQuizzes = quizzes.filter(q => q.participants.some(p => p.completedAt)).length;
    
    return { total, active, inactive, archived, totalParticipants, completedQuizzes };
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
      <Chatbot />
      <Box sx={{ pt: '100px', px: 0, width: '100vw', overflowX: 'hidden' }}>
        {/* Header Section with Better Spacing */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', md: 'center' }, 
          mb: 6,
          gap: 3,
          px: { xs: 2, md: 4 }
        }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                background: 'linear-gradient(270deg, #6366F1, #8B5CF6, #EC4899, #6366F1)',
                backgroundSize: '800% 800%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientMove 6s ease-in-out infinite',
                '@keyframes gradientMove': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
                textAlign: { xs: 'center', md: 'left' },
                letterSpacing: '-0.03em',
                lineHeight: 1.1
              }}
            >
            Admin Dashboard
          </Typography>
          </Box>
        </Box>

        {/* Enhanced Stats Cards - Full Width, 6 per row */}
        <Grid container spacing={3} sx={{ mb: 6, mt: 4, px: { xs: 0, md: 4 }, width: '100%' }} justifyContent="center">
          {[
            {
              icon: <QuizIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />, label: 'Total Quizzes', value: stats.total,
              bg: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(99, 102, 241, 0.25)' : '0 8px 32px rgba(99, 102, 241, 0.12)'
            },
            {
              icon: <CheckCircleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />, label: 'Active Quizzes', value: stats.active,
              bg: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(16, 185, 129, 0.25)' : '0 8px 32px rgba(16, 185, 129, 0.12)'
            },
            {
              icon: <ScheduleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />, label: 'Inactive Quizzes', value: stats.inactive,
              bg: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(245, 158, 11, 0.25)' : '0 8px 32px rgba(245, 158, 11, 0.12)'
            },
            {
              icon: <StarIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />, label: 'Archived Quizzes', value: stats.archived,
              bg: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(239, 68, 68, 0.25)' : '0 8px 32px rgba(239, 68, 68, 0.12)'
            },
            {
              icon: <PeopleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />, label: 'Total Participants', value: stats.totalParticipants,
              bg: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(139, 92, 246, 0.25)' : '0 8px 32px rgba(139, 92, 246, 0.12)'
            },
            {
              icon: <TrendingUpIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />, label: 'Completed Quizzes', value: stats.completedQuizzes,
              bg: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' : 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(6, 182, 212, 0.25)' : '0 8px 32px rgba(6, 182, 212, 0.12)'
            }
          ].map((card, idx) => (
            <Grid item xs={12} sm={6} md={2} key={card.label}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 + idx * 0.1 }}
                sx={{
                  minWidth: 220,
                  maxWidth: 220,
                  minHeight: 220,
                  maxHeight: 220,
                  py: 5,
                  px: 3,
                  textAlign: 'center',
                  background: card.bg,
                  color: 'white',
                  borderRadius: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: card.boxShadow,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s',
                  },
                  '&:hover::before': {
                    transform: 'translateX(100%)',
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: card.boxShadow,
                  }
                }}
              >
                {card.icon}
                <Typography variant="h2" sx={{ fontWeight: 900, mb: 0.5, fontSize: '2.5rem' }}>
                  {card.value}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, opacity: 0.95 }}>
                  {card.label}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Beautiful Create Quiz Card - Responsive, right-aligned on desktop */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 6, px: { xs: 2, md: 4 } }}>
          <MotionCard
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
            sx={{
              width: '100%',
              maxWidth: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.8s',
              },
              '&:hover::before': {
                transform: 'translateX(100%)',
              },
              '&:hover': {
                transform: 'translateY(-4px) scale(1.01)',
                boxShadow: '0 25px 50px rgba(102, 126, 234, 0.4)',
              }
            }}
            onClick={() => navigate('/create-quiz')}
          >
            <CardContent sx={{ p: { xs: 2, sm: 4 }, color: 'white' }}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        mr: 2,
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <SparklesIcon sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.3rem', sm: '1.7rem' } }}>
                Create New Quiz
              </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
                        Design engaging quizzes with multiple question types
              </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Chip 
                      icon={<TargetIcon />} 
                      label="Multiple Question Types" 
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)', 
                        color: 'white', 
                        fontWeight: 600,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: { xs: '0.8rem', sm: '1rem' }
                      }} 
                    />
                    <Chip 
                      icon={<ZapIcon />} 
                      label="Instant Analytics" 
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)', 
                        color: 'white', 
                        fontWeight: 600,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: { xs: '0.8rem', sm: '1rem' }
                      }} 
                    />
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label="Auto Grading" 
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)', 
                        color: 'white', 
                        fontWeight: 600,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: { xs: '0.8rem', sm: '1rem' }
                      }} 
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    sx={{ 
                      px: 4, 
                      py: 2,
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </MotionCard>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ mb: 4, px: { xs: 2, md: 4 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search quizzes..."
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
                    borderRadius: '16px',
                    background: theme.palette.background.paper,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                  sx={{ borderRadius: '16px' }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  label="Difficulty"
                  sx={{ borderRadius: '16px' }}
                >
                  <MenuItem value="all">All Difficulties</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', mx: { xs: 2, md: 4 } }}>
            {error}
          </Alert>
        )}

        {/* Quizzes Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredQuizzes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, px: { xs: 2, md: 4 } }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No quizzes found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || statusFilter !== 'all' || difficultyFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first quiz to get started'
              }
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3,
            }}>
              {filteredQuizzes.map((quiz, index) => (
                <MotionCard
                  key={quiz._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  sx={{ height: '100%' }}
                >
                  <QuizCard
                    quiz={quiz}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDelete}
                  />
                </MotionCard>
              ))}
            </Box>

            {/* Allowed Students Card and Admin Note side by side, margin-top from quiz cards */}
            <Box sx={{ width: '100%', mt: 6, px: { xs: 2, md: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                {/* Left: Allowed Students Card */}
                <Box sx={{ flex: 1, maxWidth: 600 }}>
                  <AllowedStudentsCard />
                </Box>
                {/* Right: Admin Note Card */}
                <Box sx={{ flex: 1, maxWidth: 700 }}>
                  <MotionCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.9 }}
                    sx={{
                      width: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '24px',
                      p: 0,
                      boxShadow: theme => theme.palette.mode === 'dark'
                        ? '0 8px 32px 0 rgba(30,41,59,0.25)'
                        : '0 8px 32px 0 rgba(99,102,241,0.08)',
                      border: theme => theme.palette.mode === 'dark'
                        ? '1.5px solid #334155'
                        : '1.5px solid #E0E7FF',
                      background: theme => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #232526 0%, #334155 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
                      backdropFilter: 'blur(10px)',
                      color: theme => theme.palette.mode === 'dark' ? '#F1F5F9' : '#232526',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 5 }, color: 'inherit', position: 'relative', zIndex: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            background: theme => theme.palette.mode === 'dark'
                              ? 'rgba(99,102,241,0.10)'
                              : 'rgba(99,102,241,0.08)',
                            boxShadow: theme => theme.palette.mode === 'dark'
                              ? '0 2px 8px 0 #23252633'
                              : '0 2px 8px 0 #a1c4fd33',
                            mr: 2,
                            border: '1.5px solid rgba(99,102,241,0.10)'
                          }}
                        >
                          <NoteAltIcon sx={{ fontSize: 28, color: theme => theme.palette.mode === 'dark' ? '#A5B4FC' : '#6366F1' }} />
                        </Box>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.2, fontSize: { xs: '1.1rem', sm: '1.3rem' }, letterSpacing: 0.2, fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif' }}>
                            Admin Note
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: { xs: '0.98rem', sm: '1.08rem' }, fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif', color: theme => theme.palette.mode === 'dark' ? '#E0E7FF' : '#3730A3', lineHeight: 1.5 }}>
                            Empower your team, inspire your students, and let innovation lead the way! <span role="img" aria-label="rocket">🚀</span>
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                        <Typography variant="caption" sx={{ color: theme => theme.palette.mode === 'dark' ? '#A5B4FC' : '#6366F1', fontWeight: 600, letterSpacing: 0.5 }}>
                          Only visible to admins
                        </Typography>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard; 