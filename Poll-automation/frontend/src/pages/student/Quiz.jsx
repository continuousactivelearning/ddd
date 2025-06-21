// Quiz.jsx
// Handles the quiz-taking experience for students, including question navigation, answer submission, and leaderboard updates.

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';  // Use the configured axios instance
import { useAuth } from '../../contexts/AuthContext';
import './Quiz.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material';
import { CircularProgress, Typography, Button, Box, Paper, Grid, List, ListItem, ListItemText, TextField, Avatar, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { BarChart2 } from 'lucide-react';

// Dummy users for the leaderboard
const DUMMY_USERS = [
  { name: 'Alex Johnson', score: 85 },
  { name: 'Sarah Smith', score: 82 },
  { name: 'Mike Brown', score: 78 },
  { name: 'Emma Wilson', score: 75 },
  { name: 'John Davis', score: 70 }
];

function getUserInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
}

const Quiz = () => {
  const { quizCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState({});
  const lastAnswerRef = useRef(null);
  const [dynamicLeaderboard, setDynamicLeaderboard] = useState([]);
  const [liveLeaderboard, setLiveLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const leaderboardIntervalRef = useRef(null);

  // currentQuestion must be derived inside the component to react to state changes
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/quiz/${quizCode}`);
        const quizData = response.data;
        setQuiz(quizData);
        setQuestions(quizData.questions);
        setTimeLeft(600);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        if (err.response?.status === 401) {
          setError('Authentication required. Please login to take this quiz.');
        } else {
          setError('Failed to load quiz. Please check the quiz code and try again.');
        }
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizCode, user]);

  useEffect(() => {
    if (quizStarted && !quizEnded && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && quizStarted && !quizEnded) {
      handleQuizEnd();
    }
  }, [quizStarted, quizEnded, timeLeft, quiz]);

  // Update leaderboard dynamically as user answers
  useEffect(() => {
    // Simulate fetching previous leaderboard (replace with real API if available)
    let leaderboard = [...DUMMY_USERS];
    // Add current user if not present
    if (user && user.name) {
      const existing = leaderboard.find(u => u.name === user.name);
      if (!existing) {
        leaderboard.push({ name: user.name, score: 0 });
      }
    }
    // Update current user's score based on correct answers so far
    let userScore = 0;
    Object.keys(selectedAnswers).forEach(idx => {
      if (answerFeedback[idx]?.isCorrect) userScore += 10;
    });
    leaderboard = leaderboard.map(u =>
      u.name === user.name ? { ...u, score: userScore } : u
    );
    // Sort leaderboard by score descending
    leaderboard.sort((a, b) => b.score - a.score);
    setDynamicLeaderboard(leaderboard);
  }, [selectedAnswers, answerFeedback, user]);

  // Fetch leaderboard from backend
  const fetchLiveLeaderboard = async (quizId) => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    try {
      const response = await axios.get(`/api/student-stats/leaderboard/${quizId}`);
      setLiveLeaderboard(response.data.leaderboard || []);
    } catch (err) {
      setLeaderboardError('Failed to load leaderboard');
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Poll leaderboard during quiz (not just after)
  useEffect(() => {
    if (quizStarted && quiz && quiz._id && !quizEnded) {
      fetchLiveLeaderboard(quiz._id);
      leaderboardIntervalRef.current = setInterval(() => {
        fetchLiveLeaderboard(quiz._id);
      }, 5000);
      return () => clearInterval(leaderboardIntervalRef.current);
    } else {
      if (leaderboardIntervalRef.current) clearInterval(leaderboardIntervalRef.current);
    }
  }, [quizStarted, quiz, quizEnded]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleStartQuiz = () => {
    if (!user.name || !user.email) {
      setError('Please log in to take the quiz');
      return;
    }
    setQuizStarted(true);
    setError(null);
  };

  const handleAnswer = async (selectedOptionIndex) => {
    if (selectedOption !== null) return; // Prevent multiple selections

    setSelectedOption(selectedOptionIndex);
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: selectedOptionIndex
    }));
    lastAnswerRef.current = { questionIndex: currentQuestionIndex, selectedOption: selectedOptionIndex };
    const isCorrect = await checkAnswer(currentQuestionIndex, selectedOptionIndex);
    setShowFeedback(true);
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    // Move to next question after 1s delay
      if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      }, 1000);
      } else {
      setTimeout(() => {
        handleQuizEnd();
      }, 1000);
      }
  };

  const handleQuizEnd = async () => {
    setQuizEnded(true);
    try {
      // Use a callback to get the latest selectedAnswers state
      setSelectedAnswers(prevSelectedAnswers => {
        // Prepare answers array using the stored selected answers
        const answers = questions.map((question, index) => ({
          questionIndex: index,
          selectedOption: prevSelectedAnswers[index] !== undefined ? prevSelectedAnswers[index] : null
        }));

        console.log('Submitting answers:', answers);
        console.log('Selected answers state:', prevSelectedAnswers);
        console.log('Questions count:', questions.length);

        // Submit the answers
        submitAnswers(answers);
        
        return prevSelectedAnswers; // Return the same state
      });
    } catch (error) {
      console.error('Error in handleQuizEnd:', error);
      setError('Failed to submit quiz results. Please try again.');
    }
  };

  const submitAnswers = async (answers) => {
    try {
      // Ensure we have all answers, including the last one
      let finalAnswers = [...answers];
      
      // Check if the last answer is missing and add it from the ref
      if (lastAnswerRef.current && lastAnswerRef.current.questionIndex === questions.length - 1) {
        const lastAnswerExists = finalAnswers.some(a => a.questionIndex === lastAnswerRef.current.questionIndex);
        if (!lastAnswerExists) {
          finalAnswers.push({
            questionIndex: lastAnswerRef.current.questionIndex,
            selectedOption: lastAnswerRef.current.selectedOption
          });
          console.log('Added missing last answer from ref:', lastAnswerRef.current);
        }
      }
      
      console.log('Final answers to submit:', finalAnswers);

      const response = await axios.post(`/api/quiz/${quizCode}/submit`, {
        answers: finalAnswers
      });

      if (response.status === 200) {
        const result = response.data;
        console.log('Quiz submitted successfully:', result);
        console.log('Backend returned correctAnswers:', result.correctAnswers);
        console.log('Backend returned totalQuestions:', result.totalQuestions);
        // Call the new endpoint to update student stats
        try {
          await axios.post('/api/student-stats/track-quiz', {
            quizId: result.quizId || quiz._id,
            score: result.score,
            correctAnswers: result.correctAnswers,
            totalQuestions: result.totalQuestions,
            timeTaken: 600 - timeLeft // assuming 10 min timer, adjust if needed
          });
        } catch (statErr) {
          console.error('Error updating student stats:', statErr);
        }
        setQuizResults(result);
        // Immediately refresh leaderboard after quiz submission
        if (quiz && quiz._id) {
          fetchLiveLeaderboard(quiz._id);
        }
      } else {
        console.error('Failed to submit quiz');
        setError('Failed to submit quiz results. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting quiz results:', error);
      setError('Failed to submit quiz results. Please try again.');
    }
  };

  // Function to check if an answer is correct
  const checkAnswer = async (questionIndex, selectedOption) => {
    try {
      const response = await axios.post(`/api/quiz/${quizCode}/check-answer`, {
        questionIndex,
        selectedOption
      });
      
      if (response.status === 200) {
        const result = response.data;
        setAnswerFeedback(prev => ({
          ...prev,
          [questionIndex]: {
            isCorrect: result.isCorrect,
            correctOption: result.correctOption
          }
        }));
        return result.isCorrect;
      }
    } catch (error) {
      console.error('Error checking answer:', error);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="quiz-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh'
      }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <Paper elevation={3} sx={{
          p: 4,
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <Typography variant="h5" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/student')}>
            Back to Dashboard
          </Button>
        </Paper>
      </div>
    );
  }

  // Quiz start screen
  if (quiz && !quizStarted && !loading) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: '2rem',
        background: theme.palette.mode === 'dark'
          ? '#18192a'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <div className="quiz-start-modal" style={{
          padding: '2.5rem 1.5rem',
          borderRadius: '32px',
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark'
            ? 'rgba(35, 36, 58, 0.85)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e0eafc 100%)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 40px 0 #23234a, 0 1.5px 8px 0 #353857'
            : '0 8px 32px 0 rgba(162, 210, 255, 0.18), 0 1.5px 8px 0 #c2e9fb',
          border: theme.palette.mode === 'dark'
            ? '2.5px solid'
            : '2.5px solid',
          borderImage: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%) 1'
            : 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%) 1',
          color: theme.palette.mode === 'dark' ? '#e0e7ff' : '#23243a',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 60% 40%, #6366F1 0%, transparent 70%)'
              : 'radial-gradient(circle at 60% 40%, #6366F1 0%, transparent 80%)',
            opacity: 0.18,
            pointerEvents: 'none',
          }} />
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: 'var(--primary, #6366F1)', letterSpacing: '-1px', zIndex: 1 }}>
            {quiz.topic}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3, color: 'var(--text-secondary, #a3aed6)', zIndex: 1 }}>
            {quiz.description || 'Get ready to test your knowledge!'}
          </Typography>
          <Box sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? 'rgba(44,54,80,0.55)'
              : 'rgba(99,102,241,0.07)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 2px 12px rgba(44,54,80,0.18)'
              : '0 2px 12px rgba(99,102,241,0.08)',
            border: theme.palette.mode === 'dark' ? '1px solid #353857' : '1px solid #e2e8f0',
            color: theme.palette.text.primary,
            textAlign: 'left',
            maxWidth: 400,
            margin: '0 auto',
            zIndex: 1,
          }}>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Difficulty:</strong> {quiz.difficulty}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Questions:</strong> {quiz.totalQuestions}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Time Limit:</strong> 10 minutes</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Student:</strong> {user.name}</Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={() => setQuizStarted(true)}
            className="start-quiz-button"
            sx={{
              minWidth: 220,
              mt: 4,
              fontWeight: 800,
              fontSize: '1.25rem',
              borderRadius: '16px',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 6px 24px #6366F1' : '0 4px 16px rgba(99,102,241,0.13)',
              background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
              color: '#fff',
              letterSpacing: 0.5,
              transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
              zIndex: 1,
              '&:hover': {
                background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                boxShadow: '0 12px 32px #6366F1',
                transform: 'scale(1.06)'
              }
            }}
          >
            Start Quiz
          </Button>
        </div>
      </div>
    );
  }

  if (quizEnded) {
    const totalQuestions = questions.length;
    const correctAnswers = quizResults ? quizResults.correctAnswers : 0;
    const accuracy = quizResults ? quizResults.score : 0;
    const timeTaken = 600 - timeLeft;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const wrongAnswers = totalQuestions - correctAnswers;
    const userRank = liveLeaderboard.findIndex(entry => entry.email === user.email) + 1;

    return (
      <Box sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' ? '#18192a' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center', 
        justifyContent: 'center',
        gap: { xs: 3, md: 6 },
        p: { xs: 2, md: 6 },
      }}>
        {/* User Stats Card */}
        <Paper elevation={6} sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 4,
          minWidth: 320,
          maxWidth: { xs: 520, md: 600 },
          width: { xs: '100%', md: '100%' },
          mb: { xs: 3, md: 0 },
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(35,36,58,0.97)' : '#f8fafc',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px 0 #23234a, 0 1.5px 8px 0 #353857'
            : '0 8px 32px 0 rgba(162, 210, 255, 0.18), 0 1.5px 8px 0 #c2e9fb',
          border: theme.palette.mode === 'dark' ? '2px solid #353857' : '2px solid #e0e7ef',
          color: theme.palette.mode === 'dark' ? '#e0e7ff' : '#23243a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-1px', color: theme.palette.mode === 'dark' ? '#fff' : '#23243a' }}>
            Your Performance
          </Typography>
          {/* User Avatar */}
          <Avatar sx={{
            width: 90,
            height: 90,
            fontSize: 38,
            fontWeight: 900,
            mb: 2,
            mt: 1,
            bgcolor: theme.palette.mode === 'dark' ? '#6366F1' : '#a5b4fc',
            color: '#fff',
            boxShadow: '0 4px 24px #6366F1aa',
            border: theme.palette.mode === 'dark' ? '4px solid #23243a' : '4px solid #fff',
          }}>
            {getUserInitials(user.name)}
          </Avatar>
          {/* Stats Grid */}
          <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 2,
            mt: 1,
            justifyItems: 'center',
            alignItems: 'center',
          }}>
            {/* Correct */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mb: 1, width: '100%' }}>
              <CheckCircleIcon sx={{ color: '#10b981', fontSize: 22 }} />
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>Correct</Typography>
              <Typography variant="body1" sx={{ fontWeight: 900 }}>{correctAnswers}</Typography>
            </Box>
            {/* Wrong */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mb: 1, width: '100%' }}>
              <ErrorIcon sx={{ color: '#ef4444', fontSize: 22 }} />
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700 }}>Wrong</Typography>
              <Typography variant="body1" sx={{ fontWeight: 900 }}>{wrongAnswers}</Typography>
            </Box>
            {/* Accuracy */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mb: 1, width: '100%' }}>
              <BarChart2 sx={{ color: '#6366F1', fontSize: 22 }} />
              <Typography variant="caption" sx={{ color: '#6366F1', fontWeight: 700 }}>Accuracy</Typography>
              <Typography variant="body1" sx={{ fontWeight: 900 }}>{accuracy}%</Typography>
            </Box>
            {/* Time */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mb: 1, width: '100%' }}>
              <AccessTimeIcon sx={{ color: '#6366F1', fontSize: 22 }} />
              <Typography variant="caption" sx={{ color: '#6366F1', fontWeight: 700 }}>Time</Typography>
              <Typography variant="body1" sx={{ fontWeight: 900 }}>{minutes}:{seconds < 10 ? '0' : ''}{seconds}</Typography>
            </Box>
            {/* Score */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mb: 1, width: '100%' }}>
              <BarChart2 sx={{ color: '#6366F1', fontSize: 22 }} />
              <Typography variant="caption" sx={{ color: '#6366F1', fontWeight: 700 }}>Score</Typography>
              <Typography variant="body1" sx={{ fontWeight: 900 }}>{quizResults?.score ?? '-'}</Typography>
            </Box>
            {/* Rank */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mb: 1, width: '100%' }}>
              <EmojiEventsIcon sx={{ color: '#f59e42', fontSize: 22 }} />
              <Typography variant="caption" sx={{ color: '#f59e42', fontWeight: 700 }}>Rank</Typography>
              <Typography variant="body1" sx={{ fontWeight: 900 }}>{userRank > 0 ? `#${userRank}` : '-'}</Typography>
            </Box>
          </Box>
          <Divider sx={{ width: '100%', mb: 2, mt: 1, borderColor: theme.palette.mode === 'dark' ? '#353857' : '#e0e7ef' }} />
          <Button
            variant="outlined"
            onClick={() => navigate('/student/dashboard')}
            sx={{ minWidth: 160, mt: 1, fontWeight: 700, borderRadius: 2 }}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ minWidth: 160, mt: 2, fontWeight: 700, borderRadius: 2 }}
          >
            Take Again
          </Button>
        </Paper>
        {/* Leaderboard Card */}
        <Paper elevation={4} sx={{
          p: 4,
          borderRadius: 4,
          minWidth: 320,
          maxWidth: { xs: 420, md: 520 },
          width: { xs: '100%', md: '100%' },
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(35,36,58,0.95)' : '#fff',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px 0 #23234a, 0 1.5px 8px 0 #353857'
            : '0 8px 32px 0 rgba(162, 210, 255, 0.18), 0 1.5px 8px 0 #c2e9fb',
          border: theme.palette.mode === 'dark' ? '2px solid #353857' : '2px solid #e0e7ef',
          color: theme.palette.mode === 'dark' ? '#e0e7ff' : '#23243a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: theme.palette.mode === 'dark' ? '#fff' : '#23243a' }}>Live Leaderboard</Typography>
          {/* Podium for Top 3 */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', mb: 0, width: '100%', gap: 2 }}>
            {[1,0,2].map((podiumIdx, i) => {
              const entry = liveLeaderboard[podiumIdx];
              if (!entry) return <Box key={i} sx={{ flex: 1 }} />;
              const isFirst = podiumIdx === 0;
              const podiumColors = [
                'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)',
                'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                'linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)',
              ];
              const heights = [80, 60, 60];
              return (
                <Box key={podiumIdx} sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                  <Box sx={{
                    width: heights[i],
                    height: heights[i],
                    borderRadius: '50%',
                    background: podiumColors[i],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 28,
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    border: isFirst ? '3px solid #fff' : '2px solid #fff',
                    position: 'relative',
                  }}>
                    {getUserInitials(entry.name)}
                    {isFirst && (
                      <Box sx={{
                        position: 'absolute',
                        top: -28,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 32,
                        color: '#f1c40f',
                        filter: 'drop-shadow(0 2px 8px #f1c40f88)',
                      }}>👑</Box>
                    )}
              </Box>
                  <Typography sx={{ mt: 1, fontWeight: 700, color: theme.palette.mode === 'dark' ? '#fff' : '#23243a', fontSize: 16, textAlign: 'center', maxWidth: 100, textShadow: '0 1px 6px rgba(0,0,0,0.10)' }} noWrap>{entry.name}</Typography>
                  <Typography sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#fff' : '#23243a', fontSize: 15, textAlign: 'center', textShadow: '0 1px 6px rgba(0,0,0,0.10)' }}>{entry.score} <span style={{fontWeight:400, fontSize:13, color: theme.palette.mode === 'dark' ? '#e0e7ff' : '#6366F1'}}>{typeof entry.timeTaken === 'number' ? `(${Math.floor(entry.timeTaken/60)}:${(entry.timeTaken%60).toString().padStart(2,'0')})` : ''}</span></Typography>
              </Box>
              );
            })}
              </Box>
          {/* Scrollable for all after top 3, 5 visible at a time, scroll bar inside */}
          {liveLeaderboard.length > 3 && (
            <Box sx={{ width: '100%', flex: 1, overflowY: 'auto', pr: 1, maxHeight: 5 * 64, mt: 2 }}>
            {leaderboardLoading ? (
              <CircularProgress />
            ) : leaderboardError ? (
              <Typography color="error">{leaderboardError}</Typography>
            ) : (
                <List sx={{ width: '100%' }}>
                  {liveLeaderboard.slice(3).map((entry, idx) => (
                    <ListItem key={entry.email || idx} sx={{
                      mb: 1.5,
                      borderRadius: 3,
                      bgcolor: theme.palette.mode === 'dark' ? '#23243a' : '#fff',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 2px 8px rgba(44,54,80,0.10)'
                        : '0 2px 8px 0 #e0e7ef',
                      border: theme.palette.mode === 'dark' ? '1px solid #353857' : '1px solid #e0e7ef',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      px: 2,
                      py: 1.5,
                    }}>
                      <Avatar sx={{ bgcolor: theme.palette.mode === 'dark' ? '#6366F1' : '#a5b4fc', color: '#fff', fontWeight: 700, mr: 2 }}>
                        {getUserInitials(entry.name)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography noWrap sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#fff' : '#23243a', fontSize: 15, letterSpacing: '-0.5px' }}>{entry.name}</Typography>
              </Box>
                      <Typography sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#fff' : '#6366F1', minWidth: 50, textAlign: 'right' }}>
                        {entry.score}
              </Typography>
                      <Typography sx={{ fontWeight: 500, color: theme.palette.mode === 'dark' ? '#e0e7ff' : '#6366F1', minWidth: 60, textAlign: 'right', fontSize: 13 }}>
                        {typeof entry.timeTaken === 'number' ? `${Math.floor(entry.timeTaken/60)}:${(entry.timeTaken%60).toString().padStart(2,'0')}` : '-'}
                  </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
          </Box>
          )}
        </Paper>
      </Box>
    );
  }

  if (!quiz || questions.length === 0 || !currentQuestion) {
    return <div className="quiz-loading"><CircularProgress /> <Typography>Preparing Quiz...</Typography></div>;
  }

  // Modern two-column layout for quiz in progress
  if (quiz && quizStarted && !quizEnded) {
    return (
      <Box className="quiz-modern-container" sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: theme.palette.mode === 'dark'
          ? 'background.default'
          : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        color: theme.palette.mode === 'dark' ? 'text.primary' : '#1e293b',
        p: { xs: 1, md: 4 },
        gap: { xs: 2, md: 4 }
      }}>
        {/* Left: Quiz Content */}
        <Paper elevation={4} sx={{
          flex: 2,
          borderRadius: 4,
          p: { xs: 2, md: 4 },
          mb: { xs: 2, md: 0 },
          bgcolor: theme.palette.mode === 'dark'
            ? 'background.paper'
            : 'rgba(255,255,255,0.98)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(44,54,80,0.18)'
            : '0 8px 32px 0 #a5b4fc',
          border: theme.palette.mode === 'dark' ? '1.5px solid #353857' : '2px solid #6366F1',
        }}>
          {/* Timer and Progress */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon sx={{ color: timeLeft < 60 ? 'error.main' : (theme.palette.mode === 'dark' ? 'primary.main' : '#6366F1') }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: timeLeft < 60 ? 'error.main' : (theme.palette.mode === 'dark' ? 'primary.main' : '#6366F1') }}>
                {formatTime(timeLeft)}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, mx: 2 }}>
              <Box sx={{ width: '100%', height: 8, bgcolor: theme.palette.mode === 'dark' ? 'divider' : '#c7d2fe', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  height: '100%',
                  bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : '#8B5CF6',
                  transition: 'width 0.3s ease'
                }} />
              </Box>
              <Typography variant="caption" color={theme.palette.mode === 'dark' ? 'text.secondary' : '#6366F1'}>
                Question {currentQuestionIndex + 1} / {questions.length}
              </Typography>
            </Box>
          </Box>

          {/* Question */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: { xs: 4, md: 6 }, color: theme.palette.mode === 'dark' ? 'text.primary' : '#6366F1', textAlign: 'center', letterSpacing: '-0.5px' }}>
              {currentQuestion.question}
            </Typography>
            <Grid container spacing={3} sx={{ maxWidth: { xs: '100%', md: 900 }, margin: { xs: 0, md: '0 auto' }, mb: 3, px: { xs: 1, sm: 2, md: 0 }, justifyContent: 'center' }}>
              {currentQuestion.options.map((option, index) => {
                // Only show feedback if answerFeedback for this question is available
                const feedback = answerFeedback[currentQuestionIndex];
                let optionState = '';
                let showFeedbackLabel = false;
                let showCorrectLabel = false;
                if (selectedOption !== null && feedback) {
                  if (index === selectedOption) {
                    if (feedback.isCorrect) {
                      optionState = 'correct';
                      showFeedbackLabel = true;
                    } else {
                      optionState = 'incorrect';
                      showFeedbackLabel = true;
                    }
                  } else if (
                    !feedback.isCorrect &&
                    index === feedback.correctOption
                  ) {
                    optionState = 'correct';
                    showCorrectLabel = true;
                  }
                }
                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                  <Button
                      variant="outlined"
                    fullWidth
                    onClick={() => handleAnswer(index)}
                    disabled={selectedOption !== null}
                    sx={{
                        height: { xs: 70, sm: 100, md: 160 },
                        borderRadius: { xs: 2, md: 5 },
                        fontWeight: 700,
                        fontSize: { xs: '0.98rem', sm: '1.1rem', md: '1.35rem' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: optionState === 'correct' ? (theme.palette.mode === 'dark' ? '0 0 0 3px #10b981' : '0 0 0 3px #6366F1') : optionState === 'incorrect' ? '0 0 0 3px #ef4444' : 2,
                        bgcolor: optionState === 'correct'
                          ? (theme.palette.mode === 'dark' ? '#d1fae5' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)')
                          : optionState === 'incorrect'
                            ? (theme.palette.mode === 'dark' ? '#fee2e2' : '#fef2f2')
                            : (theme.palette.mode === 'dark' ? 'background.paper' : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'),
                        color: optionState === 'correct'
                          ? (theme.palette.mode === 'dark' ? '#065f46' : '#111827')
                          : optionState === 'incorrect'
                            ? (theme.palette.mode === 'dark' ? '#991b1b' : '#b91c1c')
                            : (theme.palette.mode === 'dark' ? 'text.primary' : '#3730a3'),
                        border: '2.5px solid',
                        borderColor: optionState === 'correct'
                          ? (theme.palette.mode === 'dark' ? '#10b981' : '#fff')
                          : optionState === 'incorrect'
                            ? '#ef4444'
                            : (theme.palette.mode === 'dark' ? 'divider' : '#8B5CF6'),
                        position: 'relative',
                        transition: 'all 0.2s',
                      '&:hover': {
                          bgcolor: optionState === 'correct'
                            ? (theme.palette.mode === 'dark' ? '#bbf7d0' : '#8B5CF6')
                            : optionState === 'incorrect'
                              ? (theme.palette.mode === 'dark' ? '#fecaca' : '#fee2e2')
                              : (theme.palette.mode === 'dark' ? 'action.hover' : 'linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 100%)'),
                          borderColor: optionState === 'correct'
                            ? (theme.palette.mode === 'dark' ? '#10b981' : '#fff')
                            : optionState === 'incorrect'
                              ? '#ef4444'
                              : (theme.palette.mode === 'dark' ? 'primary.main' : '#6366F1'),
                      },
                      '&:disabled': {
                          bgcolor: optionState === 'correct'
                            ? (theme.palette.mode === 'dark' ? '#d1fae5' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)')
                            : optionState === 'incorrect'
                              ? (theme.palette.mode === 'dark' ? '#fee2e2' : '#fef2f2')
                              : (theme.palette.mode === 'dark' ? 'background.paper' : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'),
                          color: optionState === 'correct'
                            ? (theme.palette.mode === 'dark' ? '#065f46' : '#fff')
                            : optionState === 'incorrect'
                              ? (theme.palette.mode === 'dark' ? '#991b1b' : '#b91c1c')
                              : (theme.palette.mode === 'dark' ? 'text.disabled' : '#6366F1'),
                        }
                      }}
                    >
                      <Box sx={{
                        width: '100%',
                        textAlign: 'center',
                        fontSize: { xs: '0.98rem', sm: '1.1rem', md: '1.35rem' },
                        fontWeight: 700,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color:
                          optionState === 'correct'
                            ? (theme.palette.mode === 'dark' ? '#065f46' : '#111827')
                            : optionState === 'incorrect'
                              ? (theme.palette.mode === 'dark' ? '#991b1b' : '#b91c1c')
                              : (theme.palette.mode === 'dark' ? 'text.primary' : '#3730a3'),
                        textShadow:
                          optionState === 'correct' && theme.palette.mode !== 'dark'
                            ? '0 1px 6px rgba(0,0,0,0.10)'
                            : 'none',
                      }}>
                        {option}
                        {showFeedbackLabel && (
                          <Typography variant="subtitle1" sx={{ display: 'block', mt: { xs: 1, md: 2 }, fontWeight: 800, fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.15rem' }, color: optionState === 'correct' ? (theme.palette.mode === 'dark' ? '#10b981' : '#111827') : '#ef4444', textShadow: optionState === 'correct' && theme.palette.mode !== 'dark' ? '0 1px 6px rgba(0,0,0,0.10)' : 'none' }}>
                            {optionState === 'correct' ? '✔ Correct!' : '✗ Incorrect'}
                    </Typography>
                        )}
                        {showCorrectLabel && (
                          <Typography variant="subtitle2" sx={{ display: 'block', mt: { xs: 1, md: 2 }, fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.08rem' }, color: theme.palette.mode === 'dark' ? '#10b981' : '#111827', textShadow: theme.palette.mode !== 'dark' ? '0 1px 6px rgba(0,0,0,0.10)' : 'none' }}>
                            Correct Answer
                          </Typography>
                        )}
                      </Box>
                  </Button>
                </Grid>
                );
              })}
            </Grid>
          </motion.div>

          {/* Feedback */}
          {showFeedback && (
            <Box className={`feedback ${feedbackType}`} sx={{
              mt: 2,
            }}>
              {feedbackType === 'correct' ? '✅ Correct!' : '❌ Incorrect!'}
            </Box>
          )}
        </Paper>

        {/* Right: Leaderboard */}
        <Box sx={{
          flex: 1,
          minWidth: { xs: '100%', md: 340 },
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', md: 'flex-start' },
          mt: { xs: 2, md: 0 },
          // Align top with question card
          alignSelf: { md: 'flex-start' },
        }}>
          <Paper elevation={3} sx={{
            width: '100%',
          borderRadius: 4,
            p: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#f8fafc',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 24px rgba(44,54,80,0.18)'
              : '0 4px 24px 0 #c7d2fe',
            border: theme.palette.mode === 'dark' ? '1.5px solid #353857' : '1.5px solid #e0e7ef',
            maxHeight: 480,
            minHeight: 320,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: theme.palette.mode === 'dark' ? '#fff' : '#23243a', letterSpacing: '-0.5px' }}>
            Live Leaderboard
          </Typography>
            {/* Podium for Top 3 */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', mb: 0, width: '100%', gap: 2 }}>
              {[1,0,2].map((podiumIdx, i) => {
                const entry = liveLeaderboard[podiumIdx];
                if (!entry) return <Box key={i} sx={{ flex: 1 }} />;
                const isFirst = podiumIdx === 0;
                const podiumColors = [
                  'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)',
                  'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                  'linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)',
                ];
                const heights = [80, 60, 60];
                return (
                  <Box key={podiumIdx} sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                    <Box sx={{
                      width: heights[i],
                      height: heights[i],
                      borderRadius: '50%',
                      background: podiumColors[i],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 28,
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      border: isFirst ? '3px solid #fff' : '2px solid #fff',
                      position: 'relative',
                    }}>
                      {getUserInitials(entry.name)}
                      {isFirst && (
                        <Box sx={{
                          position: 'absolute',
                          top: -28,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: 32,
                          color: '#f1c40f',
                          filter: 'drop-shadow(0 2px 8px #f1c40f88)',
                        }}>👑</Box>
                      )}
                    </Box>
                    <Typography sx={{ mt: 1, fontWeight: 700, color: theme.palette.mode === 'dark' ? '#fff' : '#23243a', fontSize: 16, textAlign: 'center', maxWidth: 100, textShadow: '0 1px 6px rgba(0,0,0,0.10)' }} noWrap>{entry.name}</Typography>
                    <Typography sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#fff' : '#23243a', fontSize: 15, textAlign: 'center', textShadow: '0 1px 6px rgba(0,0,0,0.10)' }}>{entry.score} <span style={{fontWeight:400, fontSize:13, color: theme.palette.mode === 'dark' ? '#e0e7ff' : '#6366F1'}}>{typeof entry.timeTaken === 'number' ? `(${Math.floor(entry.timeTaken/60)}:${(entry.timeTaken%60).toString().padStart(2,'0')})` : ''}</span></Typography>
                  </Box>
                );
              })}
            </Box>
            {/* Scrollable for all after top 3, 5 visible at a time, scroll bar inside */}
            {liveLeaderboard.length > 3 && (
              <Box sx={{ width: '100%', flex: 1, overflowY: 'auto', pr: 1, maxHeight: 5 * 64, mt: 2 }}>
          {leaderboardLoading ? (
            <CircularProgress />
          ) : leaderboardError ? (
            <Typography color="error">{leaderboardError}</Typography>
          ) : (
                  <List sx={{ width: '100%' }}>
                    {liveLeaderboard.slice(3).map((entry, idx) => (
                      <ListItem key={entry.email || idx} sx={{
                        mb: 1.5,
                        borderRadius: 3,
                        bgcolor: theme.palette.mode === 'dark' ? '#23243a' : '#fff',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 2px 8px rgba(44,54,80,0.10)'
                          : '0 2px 8px 0 #e0e7ef',
                        border: theme.palette.mode === 'dark' ? '1px solid #353857' : '1px solid #e0e7ef',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                        px: 2,
                        py: 1.5,
                      }}>
                        <Avatar sx={{ bgcolor: theme.palette.mode === 'dark' ? '#6366F1' : '#a5b4fc', color: '#fff', fontWeight: 700, mr: 2 }}>
                          {getUserInitials(entry.name)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography noWrap sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#fff' : '#23243a', fontSize: 15, letterSpacing: '-0.5px' }}>{entry.name}</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#fff' : '#6366F1', minWidth: 50, textAlign: 'right' }}>
                          {entry.score}
                        </Typography>
                        <Typography sx={{ fontWeight: 500, color: theme.palette.mode === 'dark' ? '#e0e7ff' : '#6366F1', minWidth: 60, textAlign: 'right', fontSize: 13 }}>
                          {typeof entry.timeTaken === 'number' ? `${Math.floor(entry.timeTaken/60)}:${(entry.timeTaken%60).toString().padStart(2,'0')}` : '-'}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
            </Box>
          )}
        </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <div className="quiz-container">
      {/* Dynamic Leaderboard Panel removed */}
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-info">
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50' }}>
            {quiz.topic}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
        </div>
        
        <div className="quiz-timer">
          <AccessTimeIcon sx={{ mr: 1, color: timeLeft < 60 ? '#ef4444' : '#6366f1' }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: timeLeft < 60 ? '#ef4444' : '#6366f1'
            }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </div>
      </div>

      {/* Question */}
      <div className="question-container">
        <Paper elevation={2} sx={{
          p: 4,
          borderRadius: '16px',
          mb: 3,
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#e0f2fe',
          border: theme.palette.mode === 'dark' ? '1.5px solid #353857' : '2px solid #60a5fa',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(44,54,80,0.18)'
            : '0 8px 32px 0 #bae6fd',
        }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
            {currentQuestion.question}
          </Typography>

          <Grid container spacing={2}>
            {currentQuestion.options.map((option, index) => (
              <Grid item xs={12} key={index}>
                <Button
                  variant={selectedOption === index ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => handleAnswer(index)}
                  disabled={selectedOption !== null}
                  sx={{
                    py: 2,
                    px: 3,
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: selectedOption === index ? '#6366f1' : '#e5e7eb',
                    bgcolor: selectedOption === index ? '#6366f1' : 'transparent',
                    color: selectedOption === index ? 'white' : '#374151',
                    '&:hover': {
                      bgcolor: selectedOption === index ? '#6366f1' : '#f3f4f6',
                      borderColor: '#6366f1'
                    },
                    '&:disabled': {
                      bgcolor: selectedOption === index ? '#6366f1' : 'transparent',
                      color: selectedOption === index ? 'white' : '#9ca3af'
                    }
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {String.fromCharCode(65 + index)}. {option}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: '16px',
                  bgcolor: feedbackType === 'correct' ? '#f0fdf4' : '#fef2f2',
                  border: '2px solid',
                  borderColor: feedbackType === 'correct' ? '#10b981' : '#ef4444'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {feedbackType === 'correct' ? (
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 32 }} />
                  ) : (
                    <ErrorIcon sx={{ color: '#ef4444', fontSize: 32 }} />
                  )}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: feedbackType === 'correct' ? '#10b981' : '#ef4444'
                    }}
                  >
                    {feedbackType === 'correct' ? 'Correct!' : 'Incorrect'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1, color: '#6b7280' }}>
                  {feedbackType === 'correct' 
                    ? 'Great job! You got this question right.' 
                    : `The correct answer was: ${currentQuestion.options[answerFeedback[currentQuestionIndex]?.correctOption || 0]}`
                  }
                </Typography>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress">
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Progress: {currentQuestionIndex + 1} / {questions.length}
          </Typography>
          <Box sx={{ 
            width: '100%', 
            height: 8, 
            bgcolor: '#e5e7eb', 
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              height: '100%',
              bgcolor: '#6366f1',
              transition: 'width 0.3s ease'
            }} />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Quiz; 