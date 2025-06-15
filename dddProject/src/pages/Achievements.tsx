import React, { useState } from 'react';
import { Badge, Trophy, Star, Zap, Target, Clock, BookOpen, Award } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import BadgeDisplay from '../components/achievements/BadgeDisplay';

const Achievements = () => {
  const { progress } = useProgress();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  
  const categories = [
    { id: 'all', label: 'All', icon: <Trophy size={16} /> },
    { id: 'streak', label: 'Streaks', icon: <Zap size={16} /> },
    { id: 'problem', label: 'Problems', icon: <Target size={16} /> },
    { id: 'time', label: 'Time', icon: <Clock size={16} /> },
    { id: 'course', label: 'Courses', icon: <BookOpen size={16} /> },
    { id: 'special', label: 'Special', icon: <Star size={16} /> },
  ];
  
  const filteredAchievements = activeTab === 'all' 
    ? progress.achievements 
    : progress.achievements.filter(achievement => achievement.category === activeTab);
  
  const earnedCount = progress.achievements.filter(a => a.earned).length;
  const totalCount = progress.achievements.length;
  const percentComplete = Math.round((earnedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Achievements
        </h1>
        
        <div className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center">
            <Award className="text-amber-500 mr-2" size={20} />
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {earnedCount}/{totalCount} Earned
            </span>
          </div>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex items-center">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full" 
                style={{ width: `${percentComplete}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {percentComplete}%
            </span>
          </div>
        </div>
      </div>
      
      <div className={`p-1 rounded-lg flex flex-wrap md:inline-flex ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium m-1 transition-colors
              ${activeTab === category.id 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAchievements.map((achievement) => (
          <BadgeDisplay 
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;