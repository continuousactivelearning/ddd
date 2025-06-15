import React from 'react';
import { useUser } from '../context/UserContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { BarChart3, BookOpen, Calendar, Clock, Edit, Medal, Target, Trophy, User } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import SkillsRadarChart from '../components/profile/SkillsRadarChart';
import ActivityCalendar from '../components/profile/ActivityCalendar';
import StatisticCard from '../components/ui/StatisticCard';

const Profile = () => {
  const { user } = useUser();
  const { progress } = useProgress();
  const { darkMode } = useTheme();
  
  const stats = [
    { 
      id: 1, 
      label: 'Problems Solved', 
      value: progress.totalProblemsSolved,
      icon: <Target className="text-indigo-600 dark:text-indigo-400" size={18} />
    },
    { 
      id: 2, 
      label: 'Courses Completed', 
      value: progress.completedCourses,
      icon: <BookOpen className="text-teal-600 dark:text-teal-400\" size={18} />
    },
    { 
      id: 3, 
      label: 'Streak', 
      value: `${progress.streak} days`,
      icon: <Trophy className="text-amber-600 dark:text-amber-400" size={18} />
    },
    { 
      id: 4, 
      label: 'Time Studied', 
      value: progress.totalStudyTime,
      icon: <Clock className="text-emerald-600 dark:text-emerald-400\" size={18} />
    },
  ];

  return (
    <div className="space-y-6">
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <Avatar src={user.avatar} alt={user.name} size="xl" />
            <button className="absolute bottom-0 right-0 p-1 rounded-full bg-indigo-600 text-white">
              <Edit size={14} />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              
              <div className="flex items-center">
                <div className={`flex items-center px-3 py-1 rounded-full ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                  <Medal className="mr-1" size={14} />
                  <span className="text-sm font-medium">Level {user.level}</span>
                </div>
                
                <div className={`ml-2 flex items-center px-3 py-1 rounded-full ${darkMode ? 'bg-amber-900 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
                  <Trophy className="mr-1" size={14} />
                  <span className="text-sm font-medium">{progress.achievements.filter(a => a.earned).length} Achievements</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <StatisticCard 
                  key={stat.id}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <BarChart3 className="inline-block mr-2" size={18} />
              Skills Proficiency
            </h2>
          </div>
          <SkillsRadarChart skills={user.skills} />
        </div>
        
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Calendar className="inline-block mr-2" size={18} />
              Activity Calendar
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last 12 weeks
            </div>
          </div>
          <ActivityCalendar activityData={progress.activityData} />
        </div>
      </div>
      
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <User className="inline-block mr-2" size={18} />
          Account Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={user.name}
              className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Joined
            </label>
            <input
              type="text"
              value={user.joinDate}
              className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Time Zone
            </label>
            <input
              type="text"
              value={user.timezone}
              className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              readOnly
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;