import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Trophy, Users, BookOpen, TrendingUp, Star, Target, Calendar, Clock, Award, Zap, Heart, CheckCircle, AlertCircle, ChevronUp } from 'lucide-react';

const TeacherDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [achievements, setAchievements] = useState([]);
  const [streakCount, setStreakCount] = useState(12);
  const [totalStudents] = useState(156);
  const [activeClasses] = useState(6);
  const [completedLessons] = useState(28);
  const [weeklyGoalProgress] = useState(85);

  // Sample data
  const studentProgressData = [
    { name: 'Math A', progress: 92, students: 28, color: '#FF6B6B' },
    { name: 'Science B', progress: 87, students: 24, color: '#4ECDC4' },
    { name: 'English C', progress: 94, students: 26, color: '#45B7D1' },
    { name: 'History D', progress: 78, students: 22, color: '#96CEB4' },
    { name: 'Art E', progress: 88, students: 30, color: '#FFEAA7' },
    { name: 'Music F', progress: 91, students: 26, color: '#DDA0DD' }
  ];

  const weeklyEngagementData = [
    { day: 'Mon', engagement: 85, participation: 78 },
    { day: 'Tue', engagement: 92, participation: 88 },
    { day: 'Wed', engagement: 78, participation: 72 },
    { day: 'Thu', engagement: 96, participation: 94 },
    { day: 'Fri', engagement: 88, participation: 85 },
    { day: 'Sat', engagement: 94, participation: 90 },
    { day: 'Sun', engagement: 82, participation: 76 }
  ];

  const achievementData = [
    { type: 'High Engagement', count: 4, color: '#FF6B6B' },
    { type: 'Perfect Attendance', count: 12, color: '#4ECDC4' },
    { type: 'Lesson Completed', count: 8, color: '#45B7D1' },
    { type: 'Student Milestone', count: 15, color: '#96CEB4' }
  ];

  const recentActivities = [
    { id: 1, type: 'achievement', message: '5 students completed advanced math module!', time: '2 min ago', icon: Trophy, color: 'text-yellow-500' },
    { id: 2, type: 'engagement', message: 'Class 7B showed 98% participation today', time: '15 min ago', icon: TrendingUp, color: 'text-green-500' },
    { id: 3, type: 'milestone', message: 'You\'ve maintained 12-day teaching streak!', time: '1 hour ago', icon: Zap, color: 'text-purple-500' },
    { id: 4, type: 'feedback', message: 'Parent feedback: "Amazing progress in Science"', time: '2 hours ago', icon: Heart, color: 'text-pink-500' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Simulate achievement unlocks
    const achievementTimer = setInterval(() => {
      const newAchievements = [
        'Engagement Master - 90%+ class participation!',
        'Streak Champion - 10+ consecutive teaching days!',
        'Progress Pioneer - All classes above 80% completion!',
        'Feedback Hero - 5+ positive parent reviews this week!'
      ];
      
      if (Math.random() > 0.95) {
        setAchievements(prev => [...prev, newAchievements[Math.floor(Math.random() * newAchievements.length)]]);
      }
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(achievementTimer);
    };
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Icon className="w-5 h-5" style={{ color }} />
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-green-500">
            <ChevronUp className="w-4 h-4" />
            <span className="text-sm font-semibold">{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = '#4ECDC4' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{progress}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, Teacher! 🌟
            </h1>
            <p className="text-lg text-gray-600">You're making a difference - {totalStudents} students are learning because of you!</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">{currentTime.toLocaleTimeString()}</p>
            <p className="text-sm text-gray-500">{currentTime.toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Achievement Notifications */}
      {achievements.length > 0 && (
        <div className="mb-6">
          {achievements.slice(-3).map((achievement, index) => (
            <div key={index} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg mb-2 animate-pulse shadow-lg">
              <div className="flex items-center space-x-3">
                <Trophy className="w-6 h-6" />
                <span className="font-semibold">🎉 Achievement Unlocked: {achievement}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Students"
          value={totalStudents}
          subtitle="Across all classes"
          color="#4ECDC4"
          trend={8}
        />
        <StatCard
          icon={BookOpen}
          title="Active Classes"
          value={activeClasses}
          subtitle="This semester"
          color="#45B7D1"
          trend={12}
        />
        <StatCard
          icon={CheckCircle}
          title="Lessons Completed"
          value={completedLessons}
          subtitle="This month"
          color="#96CEB4"
          trend={25}
        />
        <StatCard
          icon={Zap}
          title="Teaching Streak"
          value={`${streakCount} days`}
          subtitle="Keep it up!"
          color="#FF6B6B"
        />
      </div>

      {/* Weekly Goal Progress */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Weekly Goal Progress</h3>
          <Target className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex items-center justify-center">
          <ProgressRing progress={weeklyGoalProgress} color="#8B5CF6" />
        </div>
        <p className="text-center mt-4 text-gray-600">
          You're <span className="font-bold text-purple-600">{weeklyGoalProgress}%</span> towards your weekly engagement goal!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Class Progress Overview */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
            Class Progress Overview
          </h3>
          <div className="space-y-4">
            {studentProgressData.map((classData, index) => (
              <div key={index} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: classData.color }}></div>
                    <span className="font-semibold text-gray-900">{classData.name}</span>
                    <span className="text-sm text-gray-500">({classData.students} students)</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: classData.color }}>{classData.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${classData.progress}%`,
                      backgroundColor: classData.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Engagement Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart className="w-6 h-6 mr-2 text-blue-500" />
            Weekly Engagement Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyEngagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="engagement" stackId="1" stroke="#4ECDC4" fill="#4ECDC4" />
              <Area type="monotone" dataKey="participation" stackId="1" stroke="#45B7D1" fill="#45B7D1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievement Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-500" />
            Recent Achievements
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={achievementData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {achievementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-indigo-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <activity.icon className={`w-5 h-5 mt-1 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Motivational Footer */}
      <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">You're Doing Amazing! 🚀</h3>
        <p className="text-lg opacity-90">
          Your dedication is shaping the future. Keep inspiring, keep growing, keep making a difference!
        </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;