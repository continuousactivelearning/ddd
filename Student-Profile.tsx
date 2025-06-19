import React, { useState } from 'react';
import { 
  User, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock, 
  Star, 
  Edit3, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Activity,
  Trophy,
  Brain,
  Zap,
  CheckCircle,
  BarChart3,
  PieChart,
  Users,
  Save,
  X
} from 'lucide-react';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  grade: string;
  profileImage: string;
  joinDate: string;
  bio: string;
}

interface LearningStats {
  totalHours: number;
  coursesCompleted: number;
  currentStreak: number;
  achievementPoints: number;
  rank: number;
  totalStudents: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface Subject {
  name: string;
  progress: number;
  grade: string;
  color: string;
  hours: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Activity {
  id: string;
  type: 'study' | 'quiz' | 'assignment' | 'discussion';
  title: string;
  subject: string;
  timestamp: string;
  score?: number;
}

const StudentProfileDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'achievements' | 'activity'>('overview');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<StudentProfile>({
    id: 'STU001',
    name: 'Yogesh Tharwani',
    email: 'abc@gmail.com',
    phone: '+91 123-4567-89',
    location: 'Delhi',
    grade: 'Grade 11',
    profileImage: '/api/placeholder/150/150',
    joinDate: '2024-01-15',
    bio: 'Passionate about mathematics and computer science. Love solving complex problems and helping classmates understand difficult concepts.'
  });
  const [currentProfile, setCurrentProfile] = useState<StudentProfile>({
    id: 'STU001',
    name: 'Yogesh Tharwani',
    email: 'abc@gmail.co',
    phone: '+91 123-4567-89',
    location: 'Delhi',
    grade: 'Grade 11',
    profileImage: '/api/placeholder/150/150',
    joinDate: '2024-01-15',
    bio: 'Passionate about mathematics and computer science. Love solving complex problems and helping classmates understand difficult concepts.'
  });

  const studentProfile: StudentProfile = currentProfile;

  const learningStats: LearningStats = {
    totalHours: 247,
    coursesCompleted: 12,
    currentStreak: 15,
    achievementPoints: 2850,
    rank: 8,
    totalStudents: 156,
    weeklyGoal: 20,
    weeklyProgress: 16
  };

  const subjects: Subject[] = [
    { name: 'Mathematics', progress: 85, grade: 'A', color: 'bg-blue-500', hours: 72 },
    { name: 'Physics', progress: 78, grade: 'B+', color: 'bg-green-500', hours: 58 },
    { name: 'Computer Science', progress: 92, grade: 'A+', color: 'bg-purple-500', hours: 89 },
    { name: 'Chemistry', progress: 69, grade: 'B', color: 'bg-orange-500', hours: 45 },
    { name: 'English Literature', progress: 74, grade: 'B+', color: 'bg-pink-500', hours: 38 }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Study Streak Master',
      description: 'Maintained a 15-day study streak',
      icon: '🔥',
      earnedDate: '2024-06-15',
      rarity: 'rare'
    },
    {
      id: '2',
      title: 'Math Wizard',
      description: 'Scored 100% on 5 consecutive math quizzes',
      icon: '🧙‍♂️',
      earnedDate: '2024-06-10',
      rarity: 'epic'
    },
    {
      id: '3',
      title: 'Quick Learner',
      description: 'Completed a course in record time',
      icon: '⚡',
      earnedDate: '2024-06-05',
      rarity: 'common'
    },
    {
      id: '4',
      title: 'Code Master',
      description: 'Solved 50 programming challenges',
      icon: '💻',
      earnedDate: '2024-05-28',
      rarity: 'legendary'
    }
  ];

  const recentActivity: Activity[] = [
    {
      id: '1',
      type: 'quiz',
      title: 'Calculus Quiz #5',
      subject: 'Mathematics',
      timestamp: '2 hours ago',
      score: 94
    },
    {
      id: '2',
      type: 'study',
      title: 'Quantum Mechanics Chapter 3',
      subject: 'Physics',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      type: 'assignment',
      title: 'Algorithm Analysis Project',
      subject: 'Computer Science',
      timestamp: '1 day ago',
      score: 98
    },
    {
      id: '4',
      type: 'discussion',
      title: 'Organic Chemistry Discussion',
      subject: 'Chemistry',
      timestamp: '2 days ago'
    }
  ];

  const handleEditProfile = () => {
    setEditedProfile({ ...currentProfile });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setCurrentProfile({ ...editedProfile });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile({ ...currentProfile });
    setIsEditing(false);
  };

  const getRarityColor = (rarity: Achievement['rarity']): string => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'quiz': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'study': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'assignment': return <Edit3 className="w-4 h-4 text-purple-500" />;
      case 'discussion': return <Users className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={studentProfile.profileImage}
                  alt={studentProfile.name}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjI1IiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0zMCAxMjBDMzAgMTAwIDUwIDg1IDc1IDg1Uzg1IDEwMCAxMjAgMTIwVjE1MEgzMFYxMjBaIiBmaWxsPSIjOUI5QkEzIi8+Cjwvc3ZnPgo=';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{studentProfile.name}</h1>
                <p className="text-gray-600">{studentProfile.grade} • Student ID: {studentProfile.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Rank</p>
                <p className="text-xl font-bold text-indigo-600">#{learningStats.rank}</p>
              </div>
              <button
                onClick={handleEditProfile}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={editedProfile.profileImage}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjI1IiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0zMCAxMjBDMzAgMTAwIDUwIDg1IDc1IDg1Uzg1IDEwMCAxMjAgMTIwVjE1MEgzMFYxMjBaIiBmaWxsPSIjOUI5QkEzIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Image URL
                    </label>
                    <input
                      type="url"
                      value={editedProfile.profileImage}
                      onChange={(e) => handleInputChange('profileImage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your location"
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade/Class
                  </label>
                  <select
                    value={editedProfile.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{studentProfile.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{studentProfile.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{studentProfile.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Joined {new Date(studentProfile.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">{studentProfile.bio}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Study Hours</p>
                    <p className="text-2xl font-bold">{learningStats.totalHours}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Courses</p>
                    <p className="text-2xl font-bold">{learningStats.coursesCompleted}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Streak</p>
                    <p className="text-2xl font-bold">{learningStats.currentStreak}</p>
                  </div>
                  <Zap className="w-8 h-8 text-orange-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Points</p>
                    <p className="text-2xl font-bold">{learningStats.achievementPoints}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { key: 'overview', label: 'Overview', icon: BarChart3 },
                    { key: 'subjects', label: 'Subjects', icon: BookOpen },
                    { key: 'achievements', label: 'Achievements', icon: Trophy },
                    { key: 'activity', label: 'Activity', icon: Activity }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.key
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Weekly Progress */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Study Goal</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress this week</span>
                      <span className="text-sm font-medium text-gray-900">
                        {learningStats.weeklyProgress}/{learningStats.weeklyGoal} hours
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(learningStats.weeklyProgress / learningStats.weeklyGoal) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {learningStats.weeklyGoal - learningStats.weeklyProgress} hours remaining to reach your goal
                    </p>
                  </div>

                  {/* Performance Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Top Subjects</h5>
                      <div className="space-y-2">
                        {subjects.slice(0, 3).map((subject, index) => (
                          <div key={subject.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                              <span className="text-sm text-gray-700">{subject.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{subject.grade}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Recent Achievements</h5>
                      <div className="space-y-2">
                        {achievements.slice(0, 3).map((achievement) => (
                          <div key={achievement.id} className="flex items-center space-x-3">
                            <span className="text-lg">{achievement.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                              <p className="text-xs text-gray-500">{achievement.earnedDate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subjects' && (
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject.name} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${subject.color}`}></div>
                          <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{subject.hours}h studied</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {subject.grade}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{subject.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${subject.color}`}
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`border-2 rounded-lg p-4 ${getRarityColor(achievement.rarity)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                              achievement.rarity === 'common' ? 'bg-gray-200 text-gray-800' :
                              achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                              achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                              'bg-yellow-200 text-yellow-800'
                            }`}>
                              {achievement.rarity}
                            </span>
                            <span className="text-xs text-gray-500">{achievement.earnedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <span className="text-sm text-gray-500">{activity.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600">{activity.subject}</p>
                          {activity.score && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                              {activity.score}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileDashboard;