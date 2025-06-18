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

  // Auto-start quiz when loaded (for authenticated users)
  useEffect(() => {
    if (quiz && !loading && !quizStarted && !quizEnded) {
      // Small delay to show quiz info before starting
      const timer = setTimeout(() => {
        setQuizStarted(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [quiz, loading, quizStarted, quizEnded]);

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
        setQuizResults(result);
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
        padding: '2rem'
      }}>
        <Paper elevation={3} sx={{
          p: 4,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 700, mb: 3 }}>
            Quiz: {quiz.topic}
          </Typography>
          
          <Box sx={{ mb: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quiz Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Difficulty:</strong> {quiz.difficulty}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Questions:</strong> {quiz.totalQuestions}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Time Limit:</strong> 10 minutes
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Student:</strong> {user.name}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The quiz will start automatically in a few seconds...
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => setQuizStarted(true)}
            sx={{ minWidth: 200 }}
          >
            Start Quiz Now
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

  return (
    <div className="quiz-container">
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