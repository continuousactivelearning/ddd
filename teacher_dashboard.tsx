import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Clock, 
  Target,
  Star,
  Calendar,
  Bell,
  MessageSquare,
  ChevronRight,
  Activity,
  Brain,
  Trophy,
  Zap,
  Heart,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', grade: '', email: '' });
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: '', dueDate: '', description: '' });

  // Sample data with Indian student names
  const students = [
    { id: 1, name: 'Aarav Sharma', grade: 'A+', engagement: 95, streak: 12, avatar: '🧑‍🎓', dopamineLevel: 'High' },
    { id: 2, name: 'Priya Patel', grade: 'A', engagement: 88, streak: 8, avatar: '👩‍🎓', dopamineLevel: 'High' },
    { id: 3, name: 'Arjun Reddy', grade: 'B+', engagement: 82, streak: 5, avatar: '🧑‍🎓', dopamineLevel: 'Medium' },
    { id: 4, name: 'Kavya Iyer', grade: 'A', engagement: 90, streak: 10, avatar: '👩‍🎓', dopamineLevel: 'High' },
    { id: 5, name: 'Rohan Gupta', grade: 'B', engagement: 75, streak: 3, avatar: '🧑‍🎓', dopamineLevel: 'Medium' },
    { id: 6, name: 'Ananya Singh', grade: 'A+', engagement: 93, streak: 15, avatar: '👩‍🎓', dopamineLevel: 'High' },
    { id: 7, name: 'Karthik Nair', grade: 'B+', engagement: 78, streak: 6, avatar: '🧑‍🎓', dopamineLevel: 'Medium' },
    { id: 8, name: 'Ishita Joshi', grade: 'A', engagement: 85, streak: 7, avatar: '👩‍🎓', dopamineLevel: 'High' },
    { id: 9, name: 'Vikram Chandra', grade: 'B', engagement: 72, streak: 2, avatar: '🧑‍🎓', dopamineLevel: 'Low' },
    { id: 10, name: 'Meera Krishnan', grade: 'A+', engagement: 96, streak: 18, avatar: '👩‍🎓', dopamineLevel: 'High' }
  ];

  const weeklyData = [
    { day: 'Mon', engagement: 82, completion: 75, dopamine: 85 },
    { day: 'Tue', engagement: 85, completion: 78, dopamine: 88 },
    { day: 'Wed', engagement: 88, completion: 82, dopamine: 90 },
    { day: 'Thu', engagement: 92, completion: 85, dopamine: 95 },
    { day: 'Fri', engagement: 90, completion: 88, dopamine: 92 },
    { day: 'Sat', engagement: 78, completion: 70, dopamine: 80 },
    { day: 'Sun', engagement: 75, completion: 68, dopamine: 78 }
  ];

  const subjectData = [
    { subject: 'Mathematics', score: 85, color: '#3B82F6' },
    { subject: 'Science', score: 78, color: '#10B981' },
    { subject: 'English', score: 92, color: '#F59E0B' },
    { subject: 'Social Studies', score: 88, color: '#EF4444' },
    { subject: 'Arts', score: 95, color: '#8B5CF6' }
  ];

  const notifications = [
    { id: 1, message: 'Aarav Sharma submitted Math Quiz', time: '2 min ago', type: 'submission' },
    { id: 2, message: 'Assignment due tomorrow: Science Lab Report', time: '1 hour ago', type: 'reminder' },
    { id: 3, message: 'Meera Krishnan achieved 18-day streak!', time: '2 hours ago', type: 'achievement' },
    { id: 4, message: 'New message from Priya Patel\'s parent', time: '3 hours ago', type: 'message' },
    { id: 5, message: 'Weekly engagement report available', time: '1 day ago', type: 'report' }
  ];

  const messages = [
    { id: 1, from: 'Rajesh Sharma (Parent)', message: 'Thank you for helping Aarav with his math concepts...', time: '30 min ago', unread: true },
    { id: 2, from: 'Priya Patel', message: 'Could you please clarify the science assignment requirements?', time: '2 hours ago', unread: true },
    { id: 3, from: 'Principal Kumar', message: 'Please submit the quarterly progress report by Friday.', time: '1 day ago', unread: false },
    { id: 4, from: 'Ananya Singh', message: 'Thank you for the extra help session yesterday!', time: '2 days ago', unread: false }
  ];

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.grade && newStudent.email) {
      // In a real app, this would make an API call
      console.log('Adding student:', newStudent);
      setNewStudent({ name: '', grade: '', email: '' });
      setShowAddStudent(false);
      // You could update the students array here
    }
  };

  const handleAddAssignment = () => {
    if (newAssignment.title && newAssignment.subject && newAssignment.dueDate) {
      // In a real app, this would make an API call
      console.log('Adding assignment:', newAssignment);
      setNewAssignment({ title: '', subject: '', dueDate: '', description: '' });
      setShowAddAssignment(false);
      // You could update the assignments array here
    }
  };

  const handleExportReport = () => {
    // In a real app, this would generate and download a report
    console.log('Exporting report...');
    // You can implement CSV, PDF, or Excel export here
    const reportData = {
      students: students.length,
      avgEngagement: 86,
      totalAssignments: 12,
      generatedAt: new Date().toISOString()
    };
    
    // Create a simple CSV export
    const csvContent = `Student Name,Grade,Engagement,Streak,Dopamine Level\n${students.map(s => 
      `${s.name},${s.grade},${s.engagement}%,${s.streak},${s.dopamineLevel}`
    ).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const dopamineDistribution = [
    { name: 'High', value: 60, color: '#10B981' },
    { name: 'Medium', value: 30, color: '#F59E0B' },
    { name: 'Low', value: 10, color: '#EF4444' }
  ];

  const recentActivities = [
    { student: 'Aarav Sharma', activity: 'Completed Math Quiz', score: 95, time: '2 min ago', type: 'achievement' },
    { student: 'Priya Patel', activity: 'Submitted Science Project', score: 88, time: '15 min ago', type: 'submission' },
    { student: 'Meera Krishnan', activity: '18-day streak milestone!', score: 100, time: '1 hour ago', type: 'milestone' },
    { student: 'Kavya Iyer', activity: 'Peer tutoring session', score: 0, time: '2 hours ago', type: 'collaboration' }
  ];

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const StudentCard = ({ student, onClick }) => (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onClick(student)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{student.avatar}</div>
          <div>
            <p className="font-medium text-gray-900">{student.name}</p>
            <p className="text-sm text-gray-600">Grade: {student.grade}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            student.dopamineLevel === 'High' ? 'bg-green-100 text-green-800' :
            student.dopamineLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {student.dopamineLevel}
          </div>
          <p className="text-sm text-gray-600 mt-1">{student.streak} day streak</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Engagement</span>
          <span>{student.engagement}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              student.engagement >= 90 ? 'bg-green-500' :
              student.engagement >= 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${student.engagement}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-full ${
        activity.type === 'achievement' ? 'bg-green-100' :
        activity.type === 'submission' ? 'bg-blue-100' :
        activity.type === 'milestone' ? 'bg-purple-100' :
        'bg-orange-100'
      }`}>
        {activity.type === 'achievement' && <Trophy className="w-4 h-4 text-green-600" />}
        {activity.type === 'submission' && <BookOpen className="w-4 h-4 text-blue-600" />}
        {activity.type === 'milestone' && <Star className="w-4 h-4 text-purple-600" />}
        {activity.type === 'collaboration' && <Users className="w-4 h-4 text-orange-600" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{activity.student}</p>
        <p className="text-xs text-gray-600">{activity.activity}</p>
      </div>
      <div className="text-right">
        {activity.score > 0 && (
          <p className="text-sm font-medium text-gray-900">{activity.score}%</p>
        )}
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DLED Teacher Dashboard</h1>
                  <p className="text-sm text-gray-600">Dopamine Driving through Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className={`p-1 rounded-full ${
                              notification.type === 'submission' ? 'bg-blue-100' :
                              notification.type === 'reminder' ? 'bg-yellow-100' :
                              notification.type === 'achievement' ? 'bg-green-100' :
                              notification.type === 'message' ? 'bg-purple-100' :
                              'bg-gray-100'
                            }`}>
                              {notification.type === 'submission' && <BookOpen className="w-3 h-3 text-blue-600" />}
                              {notification.type === 'reminder' && <Clock className="w-3 h-3 text-yellow-600" />}
                              {notification.type === 'achievement' && <Trophy className="w-3 h-3 text-green-600" />}
                              {notification.type === 'message' && <MessageSquare className="w-3 h-3 text-purple-600" />}
                              {notification.type === 'report' && <BarChart3 className="w-3 h-3 text-gray-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-800">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowMessages(!showMessages)}
                  className="p-2 text-gray-600 hover:text-gray-900 relative"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </span>
                </button>
                {showMessages && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Messages</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {messages.map((message) => (
                        <div key={message.id} className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${message.unread ? 'bg-blue-50' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700">
                                {message.from.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">{message.from}</p>
                                {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-800">View all messages</button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">T</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Teacher</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'students', 'analytics', 'assignments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Students" value="32" change={8} icon={Users} color="blue" />
              <StatCard title="Avg Engagement" value="86%" change={5} icon={TrendingUp} color="green" />
              <StatCard title="Assignments Due" value="12" change={-2} icon={BookOpen} color="orange" />
              <StatCard title="Dopamine Score" value="88%" change={12} icon={Zap} color="purple" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Weekly Engagement Trends</h3>
                  <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="dopamine" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activities & Dopamine Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dopamine Level Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={dopamineDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dopamineDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {dopamineDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-sm text-gray-600">{entry.name}: {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Student Overview</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={() => setShowAddStudent(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Student</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard key={student.id} student={student} onClick={setSelectedStudent} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
              <button 
                onClick={handleExportReport}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Heatmap</h3>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-8 rounded ${
                        Math.random() > 0.7 ? 'bg-green-500' :
                        Math.random() > 0.4 ? 'bg-yellow-500' :
                        Math.random() > 0.2 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {students.slice(0, 5).map((student, index) => (
                    <div key={student.id} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.engagement}% engagement</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{student.grade}</p>
                        <p className="text-sm text-gray-600">{student.streak} days</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Assignment Management</h2>
              <button 
                onClick={() => setShowAddAssignment(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>New Assignment</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Assignments</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submissions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { name: 'Quadratic Equations Practice', subject: 'Mathematics', due: '2025-07-08', submissions: '28/32', score: 87, status: 'Active' },
                      { name: 'Photosynthesis Lab Report', subject: 'Biology', due: '2025-07-10', submissions: '15/32', score: 92, status: 'Active' },
                      { name: 'Essay on Independence Day', subject: 'History', due: '2025-07-12', submissions: '5/32', score: 85, status: 'Active' },
                      { name: 'Chemical Bonding Quiz', subject: 'Chemistry', due: '2025-07-06', submissions: '32/32', score: 79, status: 'Completed' }
                    ].map((assignment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{assignment.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{assignment.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{assignment.due}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{assignment.submissions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{assignment.score}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            assignment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add New Student</h2>
                <button
                  onClick={() => setShowAddStudent(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <select
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddStudent(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Assignment</h2>
                <button
                  onClick={() => setShowAddAssignment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter assignment title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter assignment description"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddAssignment(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAssignment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedStudent.avatar}</div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedStudent.name}</h2>
                    <p className="text-gray-600">Grade: {selectedStudent.grade} • {selectedStudent.streak} day streak</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">Engagement Score</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedStudent.engagement}%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-600">Dopamine Level</p>
                  <p className="text-2xl font-bold text-green-900">{selectedStudent.dopamineLevel}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Recent Activities</h3>
                <div className="space-y-2">
                  {recentActivities.filter(a => a.student === selectedStudent.name).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{activity.activity}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                      {activity.score > 0 && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          {activity.score}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;