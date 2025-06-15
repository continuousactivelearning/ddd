import React, { createContext, useContext, useState } from 'react';

interface Progress {
  streak: number;
  longestStreak: number;
  weeklyActivity: number[];
  totalProblemsSolved: number;
  completedCourses: number;
  totalStudyTime: string;
  chartData: Array<{
    date: string;
    problems: number;
    timeSpent: number;
  }>;
  courses: Array<{
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    totalLessons: number;
    completedLessons: number;
    progress: number;
    estimatedTime: string;
  }>;
  recommendedCourses: Array<{
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    rating: number;
    totalLessons: number;
    estimatedTime: string;
    students: number;
    level: string;
  }>;
  learningPaths: Array<{
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    totalCourses: number;
    completedCourses: number;
    difficulty: string;
    estimatedTime: string;
  }>;
  dailyGoals: {
    completed: number;
    total: number;
  };
  leaderboard: Array<{
    id: number;
    name: string;
    avatar: string;
    score: number;
    rank: number;
  }>;
  recentAchievements: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
  }>;
  achievements: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    category: string;
    earned: boolean;
    earnedAt?: string;
    progress?: number;
    requiredProgress?: number;
  }>;
  activityData: Array<{
    date: string;
    count: number;
  }>;
}

interface ProgressContextType {
  progress: Progress;
  updateProgress: (progress: Progress) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Progress>({
    streak: 27,
    longestStreak: 42,
    weeklyActivity: [3, 5, 2, 7, 4, 2, 6],
    totalProblemsSolved: 142,
    completedCourses: 7,
    totalStudyTime: '278 hours',
    chartData: [
      { date: 'Apr 1', problems: 5, timeSpent: 45 },
      { date: 'Apr 5', problems: 8, timeSpent: 60 },
      { date: 'Apr 10', problems: 12, timeSpent: 90 },
      { date: 'Apr 15', problems: 7, timeSpent: 55 },
      { date: 'Apr 20', problems: 10, timeSpent: 75 },
      { date: 'Apr 25', problems: 15, timeSpent: 120 },
      { date: 'May 1', problems: 8, timeSpent: 65 },
      { date: 'May 5', problems: 14, timeSpent: 95 },
      { date: 'May 10', problems: 18, timeSpent: 150 },
      { date: 'May 15', problems: 12, timeSpent: 85 },
      { date: 'May 20', problems: 22, timeSpent: 180 },
      { date: 'May 25', problems: 16, timeSpent: 135 },
    ],
    courses: [
      {
        id: 1,
        title: 'Data Structures Masterclass',
        category: 'Algorithms',
        thumbnail: 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalLessons: 24,
        completedLessons: 18,
        progress: 75,
        estimatedTime: '12h 30m',
      },
      {
        id: 2,
        title: 'System Design Interview Prep',
        category: 'System Design',
        thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalLessons: 18,
        completedLessons: 8,
        progress: 44,
        estimatedTime: '10h 15m',
      },
      {
        id: 3,
        title: 'Dynamic Programming Deep Dive',
        category: 'Algorithms',
        thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalLessons: 16,
        completedLessons: 12,
        progress: 75,
        estimatedTime: '8h 45m',
      },
      {
        id: 4,
        title: 'Database Design Fundamentals',
        category: 'Databases',
        thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalLessons: 14,
        completedLessons: 14,
        progress: 100,
        estimatedTime: '7h 20m',
      },
      {
        id: 5,
        title: 'Frontend Development Bootcamp',
        category: 'Web Development',
        thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalLessons: 32,
        completedLessons: 32,
        progress: 100,
        estimatedTime: '16h 40m',
      },
    ],
    recommendedCourses: [
      {
        id: 101,
        title: 'Graph Algorithms Specialization',
        category: 'Algorithms',
        thumbnail: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.8,
        totalLessons: 22,
        estimatedTime: '14h 45m',
        students: 3542,
        level: 'Advanced',
      },
      {
        id: 102,
        title: 'Microservices Architecture',
        category: 'System Design',
        thumbnail: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.6,
        totalLessons: 18,
        estimatedTime: '11h 30m',
        students: 2865,
        level: 'Intermediate',
      },
      {
        id: 103,
        title: 'Machine Learning for Developers',
        category: 'AI',
        thumbnail: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.9,
        totalLessons: 28,
        estimatedTime: '18h 15m',
        students: 4721,
        level: 'Intermediate',
      },
    ],
    learningPaths: [
      {
        id: 201,
        title: 'Full Stack Developer',
        description: 'Master both frontend and backend development technologies',
        thumbnail: 'https://images.pexels.com/photos/574070/pexels-photo-574070.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalCourses: 5,
        completedCourses: 2,
        difficulty: 'Intermediate',
        estimatedTime: '45h 30m',
      },
      {
        id: 202,
        title: 'Data Science Specialist',
        description: 'Learn data analysis, visualization, and machine learning',
        thumbnail: 'https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalCourses: 6,
        completedCourses: 1,
        difficulty: 'Advanced',
        estimatedTime: '52h 15m',
      },
      {
        id: 203,
        title: 'Cloud Architecture',
        description: 'Build and deploy scalable applications on cloud platforms',
        thumbnail: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalCourses: 4,
        completedCourses: 0,
        difficulty: 'Advanced',
        estimatedTime: '38h 45m',
      },
    ],
    dailyGoals: {
      completed: 2,
      total: 3,
    },
    leaderboard: [
      {
        id: 1,
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
        score: 1842,
        rank: 1,
      },
      {
        id: 2,
        name: 'Alex Johnson',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
        score: 1756,
        rank: 2,
      },
      {
        id: 3,
        name: 'Michael Kim',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
        score: 1687,
        rank: 3,
      },
      {
        id: 4,
        name: 'Jessica Lee',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
        score: 1542,
        rank: 4,
      },
    ],
    recentAchievements: [
      {
        id: 1,
        title: 'Problem Solving Prodigy',
        description: 'Solved 100 coding problems',
        icon: 'award',
        earnedAt: '2 days ago',
      },
      {
        id: 2,
        title: 'Streak Master',
        description: 'Maintained a 25-day streak',
        icon: 'flame',
        earnedAt: '1 week ago',
      },
      {
        id: 3,
        title: 'Course Completer',
        description: 'Completed "Data Structures Masterclass"',
        icon: 'book',
        earnedAt: '2 weeks ago',
      },
    ],
    achievements: [
      {
        id: 1,
        title: 'Problem Solving Prodigy',
        description: 'Solve 100 coding problems',
        icon: 'target',
        category: 'problem',
        earned: true,
        earnedAt: 'May 10, 2024',
      },
      {
        id: 2,
        title: 'Streak Master',
        description: 'Maintain a 25-day streak',
        icon: 'flame',
        category: 'streak',
        earned: true,
        earnedAt: 'May 5, 2024',
      },
      {
        id: 3,
        title: 'Course Completer',
        description: 'Complete 5 courses',
        icon: 'book',
        category: 'course',
        earned: true,
        earnedAt: 'Apr 20, 2024',
      },
      {
        id: 4,
        title: 'Algorithm Expert',
        description: 'Solve 50 algorithm problems',
        icon: 'code',
        category: 'problem',
        earned: true,
        earnedAt: 'Apr 15, 2024',
      },
      {
        id: 5,
        title: 'Data Structure Guru',
        description: 'Complete the Data Structures path',
        icon: 'database',
        category: 'course',
        earned: true,
        earnedAt: 'Apr 8, 2024',
      },
      {
        id: 6,
        title: 'Time Warrior',
        description: 'Study for 100 hours total',
        icon: 'clock',
        category: 'time',
        earned: true,
        earnedAt: 'Mar 28, 2024',
      },
      {
        id: 7,
        title: 'Challenge Champion',
        description: 'Win a coding challenge',
        icon: 'trophy',
        category: 'special',
        earned: true,
        earnedAt: 'Mar 15, 2024',
      },
      {
        id: 8,
        title: 'Marathon Coder',
        description: 'Maintain a 50-day streak',
        icon: 'flame',
        category: 'streak',
        earned: false,
        progress: 27,
        requiredProgress: 50,
      },
      {
        id: 9,
        title: 'Problem Solving Expert',
        description: 'Solve 250 coding problems',
        icon: 'target',
        category: 'problem',
        earned: false,
        progress: 142,
        requiredProgress: 250,
      },
      {
        id: 10,
        title: 'Learning Enthusiast',
        description: 'Complete 10 courses',
        icon: 'book',
        category: 'course',
        earned: false,
        progress: 7,
        requiredProgress: 10,
      },
      {
        id: 11,
        title: 'Study Machine',
        description: 'Study for 250 hours total',
        icon: 'clock',
        category: 'time',
        earned: false,
        progress: 215,
        requiredProgress: 250,
      },
      {
        id: 12,
        title: 'Top Contributor',
        description: 'Answer 50 community questions',
        icon: 'users',
        category: 'special',
        earned: false,
        progress: 18,
        requiredProgress: 50,
      },
    ],
    activityData: Array.from({ length: 84 }, (_, i) => {
      // Generate random activity data for the last 84 days (12 weeks)
      const date = new Date();
      date.setDate(date.getDate() - (84 - i - 1));
      const dateStr = date.toISOString().split('T')[0];
      
      // Higher probability of activity on weekdays
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const probability = isWeekend ? 0.4 : 0.7;
      
      return {
        date: dateStr,
        count: Math.random() < probability ? Math.floor(Math.random() * 6) : 0,
      };
    }),
  });

  const updateProgress = (newProgress: Progress) => {
    setProgress(newProgress);
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};