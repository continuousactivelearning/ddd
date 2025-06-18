import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircularProgress, Typography, TextField, Button, Box } from '@mui/material';

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
  
  const [userStats, setUserStats] = useState({
    totalMeets: 0,
    averageScore: 0,
    timeSpent: 0,
    badgesEarned: 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({
    totalScore: 850,
    totalMeets: 12,
    accuracy: 85.5,
    currentStreak: 5,
    totalQuestions: 120,
    correctAnswers: 102,
    weeklyProgress: [
      { day: 'Mon', score: 75 },
      { day: 'Tue', score: 85 },
      { day: 'Wed', score: 65 },
      { day: 'Thu', score: 90 },
      { day: 'Fri', score: 80 },
      { day: 'Sat', score: 95 },
      { day: 'Sun', score: 70 }
    ],
    categoryBreakdown: [
      { category: 'React', correct: 35, total: 40 },
      { category: 'JavaScript', correct: 25, total: 30 },
      { category: 'Node.js', correct: 18, total: 20 },
      { category: 'CSS', correct: 8, total: 10 }
    ],
    recentActivity: [
      { date: '2 hours ago', activity: 'Completed React Quiz' },
      { date: '1 day ago', activity: 'Completed JavaScript Quiz' },
      { date: '2 days ago', activity: 'Completed Node.js Quiz' }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [quizCode, setQuizCode] = useState('');
  const [quizCodeError, setQuizCodeError] = useState('');
  const [showQuizCodeEntry, setShowQuizCodeEntry] = useState(false);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (isInitialRender) {
      setIsInitialRender(false);
      initializeDashboard();
    }
  }, [isInitialRender]);

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
      stats: `${stats.accuracy?.toFixed(1) || 0}%`,
      colorClass: "green",
    },
    {
      id: 3,
      title: "Time Spent",
      description: "Total time spent in learning sessions",
      icon: Clock,
      stats: formatTime(stats.totalQuestions * 2 || 0),
      colorClass: "purple",
    },
    {
      id: 4,
      title: "Achievements",
      description: "Badges and rewards earned",
      icon: Trophy,
      stats: `${Math.floor(stats.totalScore / 100) || 0} Badges`,
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
        value: `${stats.accuracy?.toFixed(1) || 0}%`,
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
        value: `${formatTime(stats.totalQuestions * 2 || 0)}`,
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
        value: `${Math.floor(stats.totalScore / 100) || 0} Badges`,
      },
    ];
  }, [activeQuizzes, stats, formatTime]);

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
      const response = await fetch('http://localhost:5000/api/quiz/active');
      if (!response.ok) throw new Error('Failed to fetch active quizzes');
      const data = await response.json();
      setActiveQuizzes(data);
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

  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          <div className="quick-actions">
            <h1 className="dashboard-title">Student Dashboard</h1>
          </div>

          {/* Quiz Code Entry - Hidden by default */}
          {showQuizCodeEntry && (
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <form onSubmit={handleQuizCodeSubmit} style={{ display: 'flex', gap: 8 }}>
                <TextField
                  label="Enter Quiz Code"
                  value={quizCode}
                  onChange={e => setQuizCode(e.target.value)}
                  error={!!quizCodeError}
                  helperText={quizCodeError}
                  size="small"
                  sx={{ minWidth: 200 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Join Quiz
                </Button>
              </form>
              <Button 
                variant="outlined" 
                onClick={() => setShowQuizCodeEntry(false)}
                size="small"
              >
                Cancel
              </Button>
            </Box>
          )}

          {/* Show Quiz Code Entry Button */}
          {!showQuizCodeEntry && (
            <Box sx={{ mb: 4 }}>
              <Button 
                variant="outlined" 
                onClick={() => setShowQuizCodeEntry(true)}
                startIcon={<Plus />}
              >
                Enter Quiz Code
              </Button>
            </Box>
          )}

          {/* Active Quizzes List */}
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
                    className="meet-card"
                    style={{ cursor: 'pointer', padding: '1.5rem', border: '1px solid #eee', borderRadius: '16px', marginBottom: '1rem', background: '#fff' }}
                    whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                    onClick={() => handleQuizCardClick(quiz)}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{quiz.topic}</Typography>
                    <Typography variant="body2" color="text.secondary">Difficulty: {quiz.difficulty}</Typography>
                    <Typography variant="body2" color="text.secondary">Quiz Code: <strong>{quiz.quizCode}</strong></Typography>
                    <Typography variant="body2" color="text.secondary">Created by: {quiz.createdBy?.name || 'Unknown'}</Typography>
                    <Typography variant="body2" color="text.secondary">Created at: {new Date(quiz.createdAt).toLocaleString()}</Typography>
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

          {/* Cards Grid */}
          <div className="cards-grid">
            {cards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div key={card.id} className={`card card-${card.colorClass}`}>
                  {/* Background Pattern */}
                  <div className="card-pattern">
                    {/* Note: The inner pattern circle is handled by CSS nth-child, not a separate element here */}
                  </div>

                  {/* Icon */}
                  <div className={`card-icon icon-${card.colorClass}`}>
                    <IconComponent className="icon" />
                  </div>

                  {/* Content */}
                  <div className="card-content">
                    <h3 className={`card-title title-${card.colorClass}`}>{card.title}</h3>
                    <p className="card-description">{card.description}</p>

                    {/* Stats */}
                    <div className="card-footer">
                      <span className={`card-stats stats-${card.colorClass}`}>{card.stats}</span>
                      {/* Arrow removed as per user request */}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className={`card-hover-effect hover-${card.colorClass}`}></div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="charts-container">
            <div className="chart-card">
              <h3>Weekly Progress</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={stats?.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <h3>Category Breakdown</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={stats?.categoryBreakdown}
                      dataKey="correct"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stats?.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          

          {/* Recent Activity */}
          <div className="recent-activity">
            
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {stats?.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <CheckCircle size={20} className="success" />
                  <span>{activity.activity}</span>
                  <span className="time">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
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