import React from 'react';
import { CheckCircle, Clock, Play } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    totalLessons: number;
    completedLessons: number;
    progress: number;
    estimatedTime: string;
    videoUrl: string;
  };
  onRewatch: (videoUrl: string) => void;
  onRetakeQuiz: (courseId: number) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onRewatch, onRetakeQuiz }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-md hover:transform hover:scale-105`}>
      <div className="h-40 relative">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-md">
            {course.category}
          </span>
          <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-md">
            {course.progress}% Complete
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {course.title}
        </h3>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <CheckCircle size={14} className="mr-1" />
            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
          </div>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} className="mr-1" />
            <span>{course.estimatedTime}</span>
          </div>
        </div>

        <div className="mt-3 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500" 
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
            onClick={() => onRewatch(course.videoUrl)}
          >
            <Play size={16} className="mr-2" />
            {course.progress > 0 ? 'Rewatch' : 'Start Course'}
          </button>

          <button
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            onClick={() => onRetakeQuiz(course.id)}
          >
            📝 Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
