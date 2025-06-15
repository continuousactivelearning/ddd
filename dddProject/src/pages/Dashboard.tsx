import { Calendar, Clock, BookOpen, Target, PieChart } from 'lucide-react';
import ProgressChart from '../components/dashboard/ProgressChart';
import StreakCard from '../components/dashboard/StreakCard';
import LeaderboardCard from '../components/dashboard/LeaderboardCard';
import AchievementCard from '../components/dashboard/AchievementCard';
import DailyGoalCard from '../components/dashboard/DailyGoalCard';
import { CoursesProgressCard } from '../components/dashboard/CoursesProgressCard';
import StatsCard from '../components/ui/StatsCard';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { progress } = useProgress();
  const { darkMode } = useTheme();
  
  const stats = [
    { 
      id: 1, 
      title: 'Study Time', 
      value: '23h 45m', 
      change: '+2.5h', 
      isPositive: true, 
      icon: <Clock className="text-indigo-600 dark:text-indigo-400" /> 
    },
    { 
      id: 2, 
      title: 'Problems Solved', 
      value: '142', 
      change: '+24', 
      isPositive: true, 
      icon: <Target className="text-teal-600 dark:text-teal-400" /> 
    },
    { 
      id: 3, 
      title: 'Completion Rate', 
      value: '78%', 
      change: '+5%', 
      isPositive: true, 
      icon: <PieChart className="text-amber-600 dark:text-amber-400" /> 
    },
    { 
      id: 4, 
      title: 'Courses', 
      value: '5', 
      change: '+1', 
      isPositive: true, 
      icon: <BookOpen className="text-emerald-600 dark:text-emerald-400" /> 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Dashboard
        </h1>
        <div className="flex items-center space-x-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          <Calendar size={16} />
          <span>Last 30 Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard 
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Learning Progress</h2>
              <div className="flex space-x-2">
                <button className={`px-3 py-1 text-sm rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  Week
                </button>
                <button className={`px-3 py-1 text-sm rounded-md ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                  Month
                </button>
                <button className={`px-3 py-1 text-sm rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  Year
                </button>
              </div>
            </div>
            <ProgressChart data={progress.chartData} />
          </div>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <CoursesProgressCard courses={progress.courses} />
  
  <LeaderboardCard
    data={progress.leaderboard
      .filter((entry: unknown) => typeof entry === 'object' && entry !== null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((entry: any) => ({
        id: entry.id ?? '',
        name: entry.name ?? 'Unknown',
        avatar: entry.avatar ?? '',
        score: entry.score ?? 0,
        courses: entry.courses ?? 0,
        timeSpent: entry.timeSpent ?? 0,
        quizzes: entry.quizzes ?? 0,
        streak: entry.streak ?? 0,
      }))
    }
    metric="score"
  />
</div>
        </div>
        
        <div className="space-y-6">
          <StreakCard 
            streak={progress.streak}
            longestStreak={progress.longestStreak} 
            weeklyActivity={progress.weeklyActivity}
          />
          
          <DailyGoalCard 
            completed={progress.dailyGoals.completed} 
            total={progress.dailyGoals.total} 
          />
          
          <AchievementCard recentAchievements={progress.recentAchievements} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;