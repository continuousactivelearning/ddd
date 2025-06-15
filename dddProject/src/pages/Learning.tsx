import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { BarChart, BookOpen, CheckCircle, ChevronRight, Clock, Filter, Search, Star } from 'lucide-react';
import CourseCard from '../components/learning/CourseCard';
import LearningPathCard from '../components/learning/LearningPathCard';
import RecommendedCourseCard from '../components/learning/RecommendedCourseCard';

const Learning = () => {
  const { progress } = useProgress();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('inProgress');
  
  const tabs = [
    { id: 'inProgress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'paths', label: 'Learning Paths' },
  ];
  
  const filteredCourses = activeTab === 'inProgress'
    ? progress.courses.filter(course => course.progress < 100)
    : activeTab === 'completed'
      ? progress.courses.filter(course => course.progress === 100)
      : [];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Learning Center
        </h1>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} w-full max-w-xs`}>
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search courses..."
              className={`ml-2 flex-1 outline-none border-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            />
          </div>
          
          <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <Filter size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className={`mb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {activeTab === 'paths' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.learningPaths.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No {activeTab === 'inProgress' ? 'in-progress' : 'completed'} courses
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'inProgress' 
                  ? 'Start a new course to see it here.' 
                  : 'Complete courses to see them here.'}
              </p>
            </div>
          )}
          
          {activeTab === 'inProgress' && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recommended for You
                </h2>
                <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center">
                  View all <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {progress.recommendedCourses.slice(0, 3).map((course) => (
                  <RecommendedCourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Learning;