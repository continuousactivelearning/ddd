import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Card, CardContent } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  People as PeopleIcon,
  Poll as PollIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Feedback as FeedbackIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatCard = ({ title, value, icon, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    style={{ width: '100%', height: '100%' }}
  >
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        {icon}
      </Box>
      <Typography variant="h4" component="div" sx={{ mt: 2, position: 'relative', zIndex: 2, fontWeight: 'bold' }}>
        {value}
      </Typography>
      {trend && (
        <Typography variant="body2" sx={{ mt: 1, position: 'relative', zIndex: 2, opacity: 0.9 }}>
          {trend}
        </Typography>
      )}
    </Paper>
  </motion.div>
);

const ChartContainer = ({ children, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    style={{ width: '100%', height: '100%' }}
  >
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        background: 'white',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 400 }}>
        {children}
      </Box>
    </Paper>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activePolls: 0,
    totalResponses: 0,
    averageParticipation: 0,
    departments: 0,
    upcomingEvents: 0,
    feedbackCount: 0,
    averageResponseTime: 0,
  });

  // Mock data for charts
  const participationData = [
    { name: 'Week 1', participation: 65, responses: 450 },
    { name: 'Week 2', participation: 75, responses: 520 },
    { name: 'Week 3', participation: 85, responses: 580 },
    { name: 'Week 4', participation: 90, responses: 620 },
  ];

  const pollDistribution = [
    { name: 'Academic', value: 40 },
    { name: 'Events', value: 30 },
    { name: 'Feedback', value: 20 },
    { name: 'Other', value: 10 },
  ];

  const responseData = [
    { name: 'Mon', responses: 120, active: 80 },
    { name: 'Tue', responses: 150, active: 100 },
    { name: 'Wed', responses: 180, active: 120 },
    { name: 'Thu', responses: 140, active: 90 },
    { name: 'Fri', responses: 160, active: 110 },
  ];

  const departmentStats = [
    { name: 'Computer Science', students: 450, participation: 85 },
    { name: 'Engineering', students: 380, participation: 78 },
    { name: 'Business', students: 320, participation: 82 },
    { name: 'Arts', students: 280, participation: 75 },
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalStudents: 1500,
        activePolls: 8,
        totalResponses: 4500,
        averageParticipation: 75,
        departments: 4,
        upcomingEvents: 3,
        feedbackCount: 1250,
        averageResponseTime: 2.5,
      });
    }, 1000);
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <AnimatePresence>
        <Grid container spacing={3}>
          {/* Main Stats Cards */}
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={<PeopleIcon />}
              trend="↑ 12% from last month"
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Active Polls"
              value={stats.activePolls}
              icon={<PollIcon />}
              trend="3 polls ending soon"
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Responses"
              value={stats.totalResponses}
              icon={<AssessmentIcon />}
              trend="↑ 8% from last week"
              delay={0.3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Avg. Participation"
              value={`${stats.averageParticipation}%`}
              icon={<TrendingUpIcon />}
              trend="↑ 5% from last month"
              delay={0.4}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Feedback Count"
              value={stats.feedbackCount}
              icon={<FeedbackIcon />}
              trend="↑ 15% from last month"
              delay={0.5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Avg. Response Time"
              value={`${stats.averageResponseTime}h`}
              icon={<TimerIcon />}
              trend="↓ 0.5h from last week"
              delay={0.6}
            />
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12} md={6}>
            <ChartContainer 
              title="Weekly Participation & Response Trends"
              subtitle="Track participation rates and response counts over time"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={participationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: 8,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="participation"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    name="Participation %"
                  />
                  <Area
                    type="monotone"
                    dataKey="responses"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                    name="Total Responses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartContainer 
              title="Daily Response Activity"
              subtitle="Monitor daily response patterns and active users"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: 8,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="responses" fill="#8884d8" name="Total Responses" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" fill="#82ca9d" name="Active Users" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartContainer 
              title="Department-wise Statistics"
              subtitle="Compare student counts and participation rates across departments"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: 8,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="students" fill="#8884d8" name="Total Students" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="participation" fill="#82ca9d" name="Participation %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>
        </Grid>
      </AnimatePresence>
    </Box>
  );
};

export default Dashboard; 