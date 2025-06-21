import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import { Award, Calendar, CheckCircle, Clock, Users, BarChart2, Play, Trophy, Target, Plus, TrendingUp, Bookmark, Video } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Brush,
  Area,
  AreaChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircularProgress, Typography, TextField, Button, Box } from '@mui/material';
import axiosInstance from '../../utils/axios';
import Chatbot from '../../components/ui/Chatbot';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BarChartComponent = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  return (
    <div className="chart-container bar-chart-container">
      {data.map((item, index) => (
        <div key={index} className="bar-item">
          <div className="bar" style={{ height: `${(item.value / maxValue) * 100}%` }}></div>
          <span className="bar-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const PieChartComponent = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;
  return (
    <div className="chart-container pie-chart-container">
      {data.map((item, index) => {
        const angle = (item.value / total) * 360;
        const style = {
          background: `conic-gradient(
            #6366F1 ${startAngle}deg,
            #8B5CF6 ${startAngle + angle}deg,
            transparent ${startAngle + angle}deg
          )`,
        };
        startAngle += angle;
        return <div key={index} className="pie-slice" style={style}></div>;
      })}
      <div className="pie-center">
        {total > 0 ? `${Math.round((data[0].value / total) * 100)}%` : 'N/A'}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [studentStats, setStudentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const [isChartHovered, setIsChartHovered] = useState(false);

  // Helper: extract score from activity message
  const extractScore = (msg) => {
    const match = msg && msg.match(/scored (\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Prepare data for the multi-line chart (quiz attempts)
  const activityChartData = (studentStats?.activity || [])
    .filter(act => act.type === 'quiz_attempted')
    .map((act, idx) => ({
      quiz: `Quiz ${idx + 1}`,
      score: extractScore(act.message),
      accuracy: typeof studentStats?.accuracy === 'number' ? studentStats.accuracy : parseFloat(studentStats?.accuracy) || 0,
      totalQuestions: typeof studentStats?.totalQuestions === 'number' ? studentStats.totalQuestions : parseInt(studentStats?.totalQuestions) || 0,
      correctAnswers: typeof studentStats?.correctAnswers === 'number' ? studentStats.correctAnswers : parseInt(studentStats?.correctAnswers) || 0,
    }));

  const [zoomRange, setZoomRange] = useState([0, Math.max(4, activityChartData.length - 1)]);
  const [selectedDay, setSelectedDay] = useState(0); // 0: Today, 1: Day 2, ...
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [quizCode, setQuizCode] = useState('');
  const [quizCodeError, setQuizCodeError] = useState('');
  const [showQuizCodeEntry, setShowQuizCodeEntry] = useState(false);

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        const response = await axiosInstance.get('/api/student-stats/me');
        setStudentStats(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No stats yet for this user, set all stats to 0/defaults
          setStudentStats({
            totalQuizzesAttempted: 0,
            totalScore: 0,
            averageScore: 0,
            accuracy: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            totalTimeTaken: 0,
            averageTimePerQuiz: 0,
            activity: []
          });
          setLoading(false);
        } else {
          setError('Failed to load stats');
          setLoading(false);
        }
      }
    };
    fetchStudentStats();
  }, []);

  // Stat card definitions based on real backend fields
  const statCardDefs = [
    {
      key: 'totalQuizzesAttempted',
      title: 'Total Quizzes',
      description: 'Number of quizzes you have attempted',
      icon: Users,
      format: v => v
    },
    {
      key: 'totalScore',
      title: 'Total Score',
      description: 'Sum of all your quiz scores',
      icon: BarChart2,
      format: v => v
    },
    {
      key: 'averageScore',
      title: 'Average Score',
      description: 'Average score per quiz',
      icon: TrendingUp,
      format: v => v?.toFixed(1)
    },
    {
      key: 'accuracy',
      title: 'Accuracy',
      description: 'Correct answers percentage',
      icon: CheckCircle,
      format: v => v?.toFixed(1) + '%'
    },
    {
      key: 'totalQuestions',
      title: 'Total Questions',
      description: 'Total questions attempted',
      icon: Target,
      format: v => v
    },
    {
      key: 'correctAnswers',
      title: 'Correct Answers',
      description: 'Total correct answers',
      icon: Award,
      format: v => v
    },
    {
      key: 'totalTimeTaken',
      title: 'Total Time Spent',
      description: 'Total time spent on quizzes',
      icon: Clock,
      format: v => v ? `${Math.floor(v/60)}m ${v%60}s` : '0m 0s'
    },
    {
      key: 'averageTimePerQuiz',
      title: 'Avg Time/Quiz',
      description: 'Average time per quiz',
      icon: Clock,
      format: v => (typeof v === 'number' && !isNaN(v)) ? `${(v/60).toFixed(2)}m` : '0.00m'
    },
  ];

  // Function to format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    return `${minutes} min${minutes > 1 ? 's' : ''}`;
  };

  const cards = [
    {
      id: 1,
      title: "Total Quizzes",
      description: "Number of quizzes you've participated in",
      icon: Users,
      stats: `${activeQuizzes.length} Quizzes`,
      colorClass: "blue",
    },
    {
      id: 2,
      title: "Average Score",
      description: "Your overall performance across all quizzes",
      icon: BarChart2,
      stats: `${studentStats?.accuracy?.toFixed(1) || 0}%`,
      colorClass: "green",
    },
    {
      id: 3,
      title: "Time Spent",
      description: "Total time spent in learning sessions",
      icon: Clock,
      stats: formatTime(studentStats?.totalQuestions * 2 || 0),
      colorClass: "purple",
    },
    {
      id: 4,
      title: "Achievements",
      description: "Badges and rewards earned",
      icon: Trophy,
      stats: `${Math.floor(studentStats?.totalScore / 100) || 0} Badges`,
      colorClass: "orange",
    },
  ];

  const performanceData = useMemo(() => [
    { label: 'Week 1', value: 75 },
    { label: 'Week 2', value: 80 },
    { label: 'Week 3', value: 70 },
    { label: 'Week 4', value: 90 },
  ], []);

  const questionCategoryData = useMemo(() => [
    { label: 'React', value: 40 },
    { label: 'JavaScript', value: 30 },
    { label: 'Node.js', value: 20 },
    { label: 'CSS', value: 10 },
  ], []);

  // Add useEffect for debugging
  useEffect(() => {
    console.log('Current active quizzes:', activeQuizzes);
  }, [activeQuizzes]);

  // Memoized data for stat cards
  const statCardsData = useMemo(() => {
    return [
      {
        id: 1,
        color: 'blue',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.25 10.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V11h-1.25a.75.75 0 010-1.5h2zm-1.5 8.25a.75.75 0 00-.75.75.75.75 0 00.75.75h3.5a.75.75 0 00.75-.75.75.75 0 00-.75-.75H16.5zm-5-3.5a.75.75 0 00-.75.75.75.75 0 00.75.75h3.5a.75.75 0 00.75-.75.75.75 0 00-.75-.75H11.75zm-3.5-5a.75.75 0 00-.75.75.75.75 0 00.75.75h3.5a.75.75 0 00.75-.75.75.75 0 00-.75-.75H8.25z" />
            <path fillRule="evenodd" d="M5.25 2.25A1.5 1.5 0 003.75 3.75v16.5c0 .828.672 1.5 1.5 1.5h13.5a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5H15V3.75A1.5 1.5 0 0013.5 2.25h-8.25zM12 6a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75A.75.75 0 0112 6zm-2.25 6a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        ),
        title: 'Total Quizzes',
        description: 'Number of quizzes you\'ve participated in',
        value: `${activeQuizzes.length} Quizzes`,
      },
      {
        id: 2,
        color: 'green',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0115.938-2.61a.75.75 0 00.75-.75V8.25a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75v.243L13.29 7.78a.75.75 0 00-1.06 0L9.47 10.59a.75.75 0 01-1.06 0L6.22 8.72a.75.75 0 00-1.06 0L2.25 12V13.5zm7.5-6a.75.75 0 01-.75-.75V4.5a.75.75 0 011.5 0V6.75a.75.75 0 01-.75.75zm5.25 3a.75.75 0 01-.75-.75V4.5a.75.75 0 011.5 0V9.75a.75.75 0 01-.75.75zm3.75-3.5a.75.75 0 00-.75.75V9a.75.75 0 001.5 0V7.5a.75.75 0 00-.75-.75z" clipRule="evenodd" />
          </svg>
        ),
        title: 'Average Score',
        description: 'Your overall performance across all quizzes',
        value: `${studentStats?.accuracy?.toFixed(1) || 0}%`,
      },
      {
        id: 3,
        color: 'purple',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2.25c-5.325 0-9.75 4.314-9.75 9.75s4.314 9.75 9.75 9.75 9.75-4.314 9.75-9.75S17.325 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h3.75a.75.75 0 00.75-.75V9z" clipRule="evenodd" />
          </svg>
        ),
        title: 'Time Spent',
        description: 'Total time spent in learning sessions',
        value: `${formatTime(studentStats?.totalQuestions * 2 || 0)}`,
      },
      {
        id: 4,
        color: 'orange',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M5.25 9.75a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        ),
        title: 'Achievements',
        description: 'Badges and rewards earned',
        value: `${Math.floor(studentStats?.totalScore / 100) || 0} Badges`,
      },
    ];
  }, [activeQuizzes, studentStats, formatTime]);

  // Helper: format date for chart x-axis
  const formatActivityDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  // Prepare data for the bar and line charts (score over time)
  const activityBarData = (studentStats?.activity || []).map(act => ({
    date: formatActivityDate(act.date),
    score: typeof act.score === 'number' ? act.score : parseFloat(act.score) || 0,
  }));

  // Helper to generate mock weekly progress data
  const getHeavyWeeklyProgress = (realData) => {
    if (!realData || realData.length === 0) {
      // No data: generate 7 plausible days
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map((day) => ({
        day,
        score: Math.round(40 + 60 * Math.random()),
      }));
    }
    if (realData.length === 1) {
      // One entry: use it as first, fill rest
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const base = realData[0]?.score || 50;
      return days.map((day, i) => ({
        day,
        score: i === 0 ? base : Math.round(base * (0.7 + 0.6 * Math.random())),
      }));
    }
    return realData;
  };

  // Helper to generate mock category breakdown data
  const getHeavyCategoryBreakdown = (realData) => {
    if (!realData || realData.length === 0) {
      // No data: generate 4 plausible categories
      const categories = ['Math', 'Science', 'English', 'History'];
      return categories.map((cat) => ({
        category: cat,
        correct: Math.round(5 + 15 * Math.random()),
      }));
    }
    if (realData.length === 1) {
      // One entry: use it as first, fill rest
      const categories = ['Math', 'Science', 'English', 'History'];
      const base = realData[0]?.correct || 10;
      return categories.map((cat, i) => ({
        category: i === 0 ? realData[0].category || cat : cat,
        correct: i === 0 ? base : Math.round(base * (0.7 + 0.6 * Math.random())),
      }));
    }
    return realData;
  };

  // Define a color cycle for the meet cards
  const colors = [
    { 
      bg: '#ffffff',
      text: '#1F2937',
      border: '#E5E7EB',
      accent: '#6366F1',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
    },
    { 
      bg: '#ffffff',
      text: '#1F2937',
      border: '#E5E7EB',
      accent: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
    },
    { 
      bg: '#ffffff',
      text: '#1F2937',
      border: '#E5E7EB',
      accent: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    },
    { 
      bg: '#ffffff',
      text: '#1F2937',
      border: '#E5E7EB',
      accent: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    }
  ];

  const handleJoinOnlineMeet = () => {
    navigate('/student/online-meet');
  };

  // Fetch active quizzes for students
  const fetchActiveQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/quiz/active');
      setActiveQuizzes(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setActiveQuizzes([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveQuizzes();
  }, [fetchActiveQuizzes]);

  // Handler for quiz code entry
  const handleQuizCodeSubmit = (e) => {
    e.preventDefault();
    if (!quizCode.trim()) {
      setQuizCodeError('Please enter a quiz code');
      return;
    }
    setQuizCodeError('');
    navigate(`/quiz/${quizCode.trim().toUpperCase()}`);
  };

  // Handler for clicking a quiz card
  const handleQuizCardClick = (quiz) => {
    navigate(`/quiz/${quiz.quizCode}`);
  };

  // Pinch-to-zoom handler
  const handleChartWheel = useCallback((e) => {
    if (isChartHovered && e.ctrlKey && activityChartData.length > 1) {
      e.preventDefault(); // Prevent browser zoom
      const [start, end] = zoomRange;
      const range = end - start;
      if (e.deltaY < 0 && range > 1) {
        // Zoom in
        setZoomRange([start + 1, end - 1]);
      } else if (e.deltaY > 0) {
        // Zoom out: always show all available quizzes
        setZoomRange([0, activityChartData.length - 1]);
      }
    }
  }, [isChartHovered, activityChartData.length, zoomRange]);

  useEffect(() => {
    const chartElem = chartRef.current;
    if (!chartElem) return;
    const wheelHandler = (e) => handleChartWheel(e);
    chartElem.addEventListener('wheel', wheelHandler, { passive: false });
    return () => chartElem.removeEventListener('wheel', wheelHandler);
  }, [handleChartWheel]);

  // For now, all data is for Today; future: split by day
  const days = ['Today', 'Day 2', 'Day 3'];
  const chartData = activityChartData.slice(zoomRange[0], zoomRange[1] + 1);

  // Add a theme-aware border color for charts
  const getChartBorderColor = () => {
    if (typeof document !== 'undefined' && document.body?.getAttribute('data-theme') === 'dark') {
      return '#444857'; // dark border for dark mode
    }
    return 'var(--border)'; // default (light mode)
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  // Custom tooltip for AreaChart
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    if (isMobile) {
      return (
        <div style={{ background: 'var(--background-paper)', color: 'var(--text-primary)', borderRadius: 8, boxShadow: '0 2px 8px var(--border)', padding: 8, fontWeight: 700 }}>
          {label}
        </div>
      );
    }
    // Default desktop tooltip
    return (
      <div style={{ background: 'var(--background-paper)', color: 'var(--text-primary)', borderRadius: 8, boxShadow: '0 2px 8px var(--border)', padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
        {payload.map((entry, idx) => (
          <div key={idx} style={{ color: entry.color, fontWeight: 600 }}>
            {entry.name}: {entry.value}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <DashboardHeader />
        <div className="dashboard-container">
          <div className="dashboard-wrapper">
            <div className="quick-actions">
              <h1 className="dashboard-title">Student Dashboard</h1>
            </div>
            <div className="loading-content">
              <CircularProgress />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !studentStats) {
    return (
      <div className="dashboard-page">
        <DashboardHeader />
        <div className="dashboard-container">
          <div className="dashboard-wrapper">
            <div className="quick-actions">
              <h1 className="dashboard-title">Student Dashboard</h1>
            </div>
            <div className="loading-content">
              <Typography color="error">{error ? error : ''}</Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          <div className="quick-actions">
            <h1 className="dashboard-title">Student Dashboard</h1>
          </div>

          {/* Stat Cards Grid - only real backend data */}
          <div className="cards-grid">
            {statCardDefs.filter(def => studentStats[def.key] !== undefined && studentStats[def.key] !== null)
              .map((def, idx) => {
                // Assign color classes in a cycle (blue, green, purple, orange)
                const colorClasses = ['blue', 'green', 'purple', 'orange'];
                const colorClass = colorClasses[idx % colorClasses.length];
                const IconComponent = def.icon;
              return (
                  <div key={def.key} className={`card card-${colorClass}`}>
                  <div className="card-pattern"></div>
                    <div className={`card-icon icon-${colorClass}`}>
                    <IconComponent className="icon" />
                  </div>
                  <div className="card-content">
                      <h3 className={`card-title title-${colorClass}`}>{def.title}</h3>
                      <p className="card-description">{def.description}</p>
                    <div className="card-footer">
                        <span className={`card-stats stats-${colorClass}`}>{def.format(studentStats[def.key])}</span>
                      </div>
                    </div>
                    <div className={`card-hover-effect hover-${colorClass}`}></div>
                </div>
              );
            })}
          </div>

          {/* Enter Quiz Code Card - styled like admin's Create New Quiz card */}
          <motion.div
            className="quiz-code-card"
            initial={{ scale: 1, boxShadow: '0 8px 32px rgba(99,102,241,0.10)' }}
            whileHover={{ scale: 1.02, boxShadow: '0 25px 50px rgba(102, 126, 234, 0.18)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              borderRadius: 20,
              marginBottom: 32,
              cursor: 'pointer',
              color: '#fff',
              boxShadow: '0 8px 32px rgba(99,102,241,0.10)',
              padding: 0,
              overflow: 'hidden',
              maxWidth: 700,
              marginLeft: 'auto',
              marginRight: 'auto',
              position: 'relative',
            }}
            onClick={() => !showQuizCodeEntry && setShowQuizCodeEntry(true)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', p: { xs: 2, sm: 4 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(10px)',
                  mr: 3,
                  border: '2px solid rgba(255,255,255,0.25)'
                }}
              >
                <Plus size={32} color="#fff" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: '#fff' }}>
                Enter Quiz Code
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.92, fontWeight: 500, color: '#fff' }}>
                  Join a quiz instantly using a code from your teacher
                </Typography>
          {showQuizCodeEntry && (
                  <form className="quiz-code-form" onClick={e => e.stopPropagation()} onSubmit={handleQuizCodeSubmit} style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
                <TextField
                      label="Quiz Code"
                  value={quizCode}
                  onChange={e => setQuizCode(e.target.value)}
                  error={!!quizCodeError}
                  helperText={quizCodeError}
                  size="small"
                      variant="filled"
                      sx={{
                        minWidth: 180,
                        background: 'rgba(255,255,255,0.18)',
                        borderRadius: '8px',
                        input: { color: '#fff', fontWeight: 700, background: 'transparent' },
                        label: { color: '#e0e7ff', fontWeight: 600 },
                        '.MuiFilledInput-root': {
                          background: 'transparent',
                          borderRadius: '8px',
                          boxShadow: 'none',
                          border: 'none',
                        },
                        '.MuiFilledInput-root:before, .MuiFilledInput-root:after': {
                          borderBottom: 'none',
                        },
                        '.Mui-focused': {
                          boxShadow: 'none',
                          border: 'none',
                        },
                      }}
                      InputLabelProps={{ style: { color: '#e0e7ff', fontWeight: 600 } }}
                    />
                    <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 700, borderRadius: '8px', px: 3, py: 1 }}>
                      Join
                </Button>
              </form>
                )}
              </Box>
            </Box>
          </motion.div>

          {/* Active Quizzes List - moved below stat cards */}
          <section className="meets-section">
            <h2 className="section-title">
              Available Quizzes
            </h2>
            {loading ? (
              <div className="loading-message">Loading quizzes...</div>
            ) : activeQuizzes.length > 0 ? (
              <div className="meets-grid">
                {activeQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.quizCode}
                    className="meet-card quiz-card-redesign"
                    style={{
                      cursor: 'pointer',
                      padding: '2rem',
                      border: 'none',
                      borderRadius: '20px',
                      marginBottom: '1.5rem',
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      color: '#fff',
                      boxShadow: '0 8px 32px rgba(99,102,241,0.10)',
                    }}
                    whileHover={{ scale: 1.04, boxShadow: '0 12px 32px rgba(99,102,241,0.18)' }}
                    onClick={() => handleQuizCardClick(quiz)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1rem' }}>
                      <Trophy size={32} style={{ color: '#fff', background: 'rgba(255,255,255,0.12)', borderRadius: '50%', padding: 6 }} />
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{quiz.topic}</Typography>
                    </div>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'rgba(255,255,255,0.92)' }}>Difficulty: <b>{quiz.difficulty}</b></Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>Quiz Code: <strong>{quiz.quizCode}</strong></Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>Created by: {quiz.createdBy?.name || 'Unknown'}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>Created at: {new Date(quiz.createdAt).toLocaleString()}</Typography>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-meets-message">
                <p>No active quizzes available at the moment.</p>
                {error && <p className="error-message">{error}</p>}
                <Button variant="outlined" onClick={fetchActiveQuizzes}>
                  Retry
                </Button>
              </div>
            )}
          </section>

          {/* Charts Section */}
          <div className="charts-container" style={{ display: 'flex', flexDirection: 'row', gap: 32, justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap' }}>
            <div className="chart-card" style={{ background: 'var(--background-paper)', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: 32, width: '100%', maxWidth: 600, flex: '1 1 0', minWidth: 320, margin: 0 }}>
              <h2 style={{
                fontWeight: 800,
                fontSize: 28,
                marginBottom: 18,
                color: 'var(--text-primary)',
                letterSpacing: 0.5,
                textAlign: 'left',
              }}>Student Performance Analysis</h2>
              <div
                ref={chartRef}
                onMouseEnter={() => setIsChartHovered(true)}
                onMouseLeave={() => setIsChartHovered(false)}
                style={{ width: '100%', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', borderRadius: 12 }}
              >
                {chartData.length > 0 ? (
                <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 24, right: 32, left: 8, bottom: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={getChartBorderColor()} />
                      <XAxis dataKey="quiz" tick={{ fontWeight: 600, fill: 'var(--text-secondary)' }} />
                      <YAxis tick={{ fontWeight: 600, fill: 'var(--text-secondary)' }} />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Area type="monotone" dataKey="score" stroke="#2563eb" fill="url(#scoreFill)" strokeWidth={3} dot={{ r: 1, fill: '#2563eb' }} name="Score" />
                      <Area type="monotone" dataKey="accuracy" stroke="#10B981" fill="url(#accuracyFill)" strokeWidth={3} dot={{ r: 1, fill: '#10B981' }} name="Accuracy (%)" />
                      <Area type="monotone" dataKey="correctAnswers" stroke="#f59e42" fill="url(#correctFill)" strokeWidth={3} dot={{ r: 1, fill: '#f59e42' }} name="Correct Answers" />
                      <defs>
                        <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.03} />
                        </linearGradient>
                        <linearGradient id="accuracyFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0.03} />
                        </linearGradient>
                        <linearGradient id="correctFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e42" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#f59e42" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                </ResponsiveContainer>
                ) : (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.07)', borderRadius: 3 }}>
                    <BarChart2 size={64} color="#6366F1" style={{ marginBottom: 16 }} />
                    <Typography variant="h5" sx={{ color: '#6366F1', fontWeight: 800, mb: 1 }}>No Quiz Activity</Typography>
                    <Typography variant="body1" sx={{ color: '#6366F1', opacity: 0.7, fontWeight: 500 }}>Your quiz scores will appear here as you participate more!</Typography>
                  </Box>
                )}
              </div>
              {/* Custom Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 16 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#2563eb', display: 'inline-block' }}></span> <span style={{ color: '#2563eb', fontWeight: 700 }}>Score</span></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span> <span style={{ color: '#10B981', fontWeight: 700 }}>Accuracy</span></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#f59e42', display: 'inline-block' }}></span> <span style={{ color: '#f59e42', fontWeight: 700 }}>Correct Answers</span></span>
              </div>
            </div>
            {/* Radar Chart Section */}
            <div className="chart-card" style={{ background: 'var(--background-paper)', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: 32, width: '100%', maxWidth: 600, flex: '1 1 0', minWidth: 320, margin: 0 }}>
              <h2 style={{
                fontWeight: 800,
                fontSize: 24,
                marginBottom: 18,
                color: 'var(--text-primary)',
                letterSpacing: 0.5,
                textAlign: 'left',
              }}>Quiz Attempt Breakdown</h2>
              <div style={{ width: '100%', height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activityChartData.length > 0 ? (
                <ResponsiveContainer>
                    <RadarChart cx="50%" cy="50%" outerRadius={120} data={[
                      { metric: 'Score', first: activityChartData[activityChartData.length-1].score, second: activityChartData.length > 1 ? activityChartData[activityChartData.length-2].score : null },
                      { metric: 'Accuracy', first: activityChartData[activityChartData.length-1].accuracy, second: activityChartData.length > 1 ? activityChartData[activityChartData.length-2].accuracy : null },
                      { metric: 'Total Questions', first: activityChartData[activityChartData.length-1].totalQuestions, second: activityChartData.length > 1 ? activityChartData[activityChartData.length-2].totalQuestions : null },
                      { metric: 'Correct Answers', first: activityChartData[activityChartData.length-1].correctAnswers, second: activityChartData.length > 1 ? activityChartData[activityChartData.length-2].correctAnswers : null },
                    ]}>
                      <PolarGrid stroke={getChartBorderColor()} />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-secondary)', fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fill: 'var(--text-secondary)' }} />
                      <Radar name="Latest Attempt" dataKey="first" stroke="#f87171" fill="#f87171" fillOpacity={0.25} dot={{ r: 3, fill: '#f87171' }} />
                      {activityChartData.length > 1 && (
                        <Radar name="Previous Attempt" dataKey="second" stroke="#2563eb" fill="#2563eb" fillOpacity={0.18} dot={{ r: 3, fill: '#2563eb' }} />
                      )}
                      <Legend iconType="plainline" layout="horizontal" align="center" verticalAlign="top" wrapperStyle={{ top: -24 }} />
                    </RadarChart>
                </ResponsiveContainer>
                ) : (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.07)', borderRadius: 3 }}>
                    <BarChart2 size={64} color="#6366F1" style={{ marginBottom: 16 }} />
                    <Typography variant="h5" sx={{ color: '#6366F1', fontWeight: 800, mb: 1 }}>No Quiz Activity</Typography>
                    <Typography variant="body1" sx={{ color: '#6366F1', opacity: 0.7, fontWeight: 500 }}>Your quiz breakdown will appear here as you participate more!</Typography>
                  </Box>
                )}
              </div>
            </div>
          </div>
          

          {/* Recent Activity */}
          <div className="recent-activity" style={{ marginTop: 40 }}>
            <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 16, color: 'var(--text-primary)' }}>Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(studentStats?.activity || [])
                .filter(act => act.type === 'quiz_attempted')
                .slice(-3)
                .reverse()
                .map((act, idx) => {
                  const scoreMatch = act.message && act.message.match(/scored (\d+)/);
                  const score = scoreMatch ? scoreMatch[1] : '?';
                  const quizTitle = act.quizTitle || act.quizName || 'Quiz';
                  const date = act.createdAt?.$date?.$numberLong
                    ? new Date(Number(act.createdAt.$date.$numberLong))
                    : act.createdAt
                      ? new Date(act.createdAt)
                      : null;
                  const formattedDate = date ? date.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                  return (
                    <div
                      key={act._id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 20px',
                        borderRadius: 12,
                        background: 'linear-gradient(90deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 100%)',
                        borderLeft: '5px solid var(--primary)',
                        boxShadow: '0 2px 12px rgba(99,102,241,0.06)',
                        transition: 'background 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'linear-gradient(90deg, rgba(99,102,241,0.16) 0%, rgba(139,92,246,0.12) 100%)';
                        e.currentTarget.style.boxShadow = '0 4px 18px rgba(99,102,241,0.13)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'linear-gradient(90deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 100%)';
                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.06)';
                      }}
                    >
                      <Trophy size={22} style={{ color: 'var(--primary)', flexShrink: 0, filter: 'drop-shadow(0 2px 6px rgba(99,102,241,0.12))' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>
                          You scored <span style={{ color: '#f59e42', fontWeight: 700 }}>{score}</span> in <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{quizTitle}</span>
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{formattedDate}</span>
                      </div>
                </div>
                  );
                })}
            </div>
          </div>

        </div>
      </div>
      <Chatbot />
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);

export default Dashboard; 