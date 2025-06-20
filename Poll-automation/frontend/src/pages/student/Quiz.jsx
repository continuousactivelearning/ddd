// Quiz.jsx
// Handles the quiz-taking experience for students, including question navigation, answer submission, and leaderboard updates.

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';  // Use the configured axios instance
import { useAuth } from '../../contexts/AuthContext';
import './Quiz.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material';
import { CircularProgress, Typography, Button, Box, Paper, Grid, List, ListItem, ListItemText, TextField } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { EmojiEvents, AccessTime } from '@mui/icons-material'; // Corrected import

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
    
    // Store the selected answer
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: selectedOptionIndex
    }));
    
    // Also store in ref for immediate access
    lastAnswerRef.current = { questionIndex: currentQuestionIndex, selectedOption: selectedOptionIndex };
    
    // Check if answer is correct
    const isCorrect = await checkAnswer(currentQuestionIndex, selectedOptionIndex);
    
    // Show feedback based on result
    setShowFeedback(true);
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');

    // Move to next question after brief delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        // For the last question, end the quiz
        handleQuizEnd();
      }
    }, 1500); // Show feedback for 1.5 seconds
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
      <div className="quiz-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: '2rem',
        background: 'none',
      }}>
        <Paper elevation={12} className="quiz-start-modal" sx={theme => ({
          p: { xs: 2.5, md: 6 },
          borderRadius: '32px',
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          background: theme.palette.mode === 'dark'
            ? '#23243a'
            : 'rgba(255,255,255,0.85)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 40px 0 #23234a, 0 1.5px 8px 0 #353857'
            : '0 8px 32px rgba(99,102,241,0.13)',
          border: theme.palette.mode === 'dark'
            ? '2px solid #6366F1' : '2px solid #e2e8f0',
          color: theme.palette.text.primary,
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          position: 'relative',
          overflow: 'hidden',
        })}>
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: (theme) => theme.palette.mode === 'dark'
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
            background: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(44,54,80,0.55)'
              : 'rgba(99,102,241,0.07)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 2px 12px rgba(44,54,80,0.18)'
              : '0 2px 12px rgba(99,102,241,0.08)',
            border: (theme) => theme.palette.mode === 'dark' ? '1px solid #353857' : '1px solid #e2e8f0',
            color: (theme) => theme.palette.text.primary,
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
              boxShadow: (theme) => theme.palette.mode === 'dark'
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
        </Paper>
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
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          {/* Completion Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: 'center',
              padding: '2rem'
            }}
          >
            <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 700, mb: 2 }}>
              Quiz Completed! 🎉
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Great job, {user.name}!
            </Typography>
          </motion.div>

          {/* Results Grid */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: '#6366F1', fontWeight: 700 }}>
                  {correctAnswers}/{totalQuestions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct Answers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                  {accuracy}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accuracy
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: '#EF4444', fontWeight: 700 }}>
                  {minutes}:{seconds < 10 ? '0' : ''}{seconds}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time Taken
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Live Leaderboard */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Live Leaderboard
            </Typography>
            {leaderboardLoading ? (
              <CircularProgress />
            ) : leaderboardError ? (
              <Typography color="error">{leaderboardError}</Typography>
            ) : (
              <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                <Grid container spacing={2}>
                  {liveLeaderboard.map((entry, idx) => (
                    <Grid item xs={12} key={entry.email || idx}>
                      <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <EmojiEventsIcon color={idx === 0 ? 'warning' : 'disabled'} sx={{ mr: 1 }} />
                        <Typography sx={{ minWidth: 120, fontWeight: 600 }}>{entry.name}</Typography>
                        <Typography sx={{ minWidth: 80 }}>Score: {entry.score}</Typography>
                        <Typography sx={{ minWidth: 100 }}>Time: {entry.timeTaken !== undefined ? `${Math.floor(entry.timeTaken / 60)}m ${entry.timeTaken % 60}s` : '-'}</Typography>
                        <Typography sx={{ minWidth: 60 }}>#{entry.rank}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>

          {/* Detailed Results */}
          {quizResults?.detailedResults && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Question Results:
              </Typography>
              {quizResults.detailedResults.map((result, index) => (
                <Box key={index} sx={{ 
                  mb: 2, 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: result.isCorrect ? '#f0fdf4' : '#fef2f2',
                  border: '1px solid',
                  borderColor: result.isCorrect ? '#10b981' : '#ef4444'
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    Question {index + 1}: {result.question}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Your answer: {result.options[result.selectedOption]}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: result.isCorrect ? '#10b981' : '#ef4444',
                    fontWeight: 600
                  }}>
                    {result.isCorrect 
                      ? '✅ Correct!' 
                      : `❌ Wrong. Correct answer: ${result.options[result.correctOption]}`
                    }
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/student')}
              sx={{ minWidth: 120 }}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ minWidth: 120 }}
            >
              Take Again
            </Button>
          </Box>
        </Paper>
      </div>
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
        bgcolor: 'background.default',
        color: 'text.primary',
        p: { xs: 1, md: 4 },
        gap: { xs: 2, md: 4 }
      }}>
        {/* Left: Quiz Content */}
        <Paper elevation={4} sx={{
          flex: 2,
          borderRadius: 4,
          p: { xs: 2, md: 4 },
          mb: { xs: 2, md: 0 },
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          minWidth: 0
        }}>
          {/* Timer and Progress */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon sx={{ color: timeLeft < 60 ? 'error.main' : 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: timeLeft < 60 ? 'error.main' : 'primary.main' }}>
                {formatTime(timeLeft)}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, mx: 2 }}>
              <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  height: '100%',
                  bgcolor: 'primary.main',
                  transition: 'width 0.3s ease'
                }} />
              </Box>
              <Typography variant="caption" color="text.secondary">
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
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
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
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: selectedOption === index ? 'primary.main' : 'divider',
                      bgcolor: selectedOption === index ? 'primary.main' : 'background.paper',
                      color: selectedOption === index ? 'common.white' : 'text.primary',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      boxShadow: selectedOption === index ? 4 : 0,
                      '&:hover': {
                        bgcolor: selectedOption === index ? 'primary.main' : 'action.hover',
                        borderColor: 'primary.main'
                      },
                      '&:disabled': {
                        bgcolor: selectedOption === index ? 'primary.main' : 'background.paper',
                        color: selectedOption === index ? 'common.white' : 'text.disabled'
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
          </motion.div>

          {/* Feedback */}
          {showFeedback && (
            <Box className={`feedback ${feedbackType}`} sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '1.2rem',
              bgcolor: feedbackType === 'correct' ? 'success.light' : 'error.light',
              color: feedbackType === 'correct' ? 'success.main' : 'error.main',
              border: '2px solid',
              borderColor: feedbackType === 'correct' ? 'success.main' : 'error.main',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {feedbackType === 'correct' ? '✅ Correct!' : '❌ Incorrect!'}
            </Box>
          )}
        </Paper>

        {/* Right: Live Leaderboard */}
        <Paper elevation={4} sx={{
          flex: 1,
          borderRadius: 4,
          p: { xs: 2, md: 4 },
          bgcolor: 'background.paper',
          minWidth: 0,
          maxHeight: { md: '80vh' },
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Live Leaderboard
          </Typography>
          {leaderboardLoading ? (
            <CircularProgress />
          ) : leaderboardError ? (
            <Typography color="error">{leaderboardError}</Typography>
          ) : (
            <Box>
              <Grid container spacing={2}>
                {liveLeaderboard.map((entry, idx) => (
                  <Grid item xs={12} key={entry.email || idx}>
                    <Paper elevation={1} sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      bgcolor: entry.email === user.email ? 'primary.light' : 'background.paper',
                      color: entry.email === user.email ? 'primary.contrastText' : 'text.primary',
                      border: entry.email === user.email ? '2px solid' : '1px solid',
                      borderColor: entry.email === user.email ? 'primary.main' : 'divider',
                      fontWeight: entry.email === user.email ? 700 : 500
                    }}>
                      <EmojiEventsIcon color={idx === 0 ? 'warning' : 'disabled'} sx={{ mr: 1 }} />
                      <Typography sx={{ minWidth: 120, fontWeight: 600 }}>{entry.name}</Typography>
                      <Typography sx={{ minWidth: 80 }}>Score: {entry.score}</Typography>
                      <Typography sx={{ minWidth: 100 }}>Time: {entry.timeTaken !== undefined ? `${Math.floor(entry.timeTaken / 60)}m ${entry.timeTaken % 60}s` : '-'}</Typography>
                      <Typography sx={{ minWidth: 60 }}>#{entry.rank}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
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
        <Paper elevation={2} sx={{ p: 4, borderRadius: '16px', mb: 3 }}>
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