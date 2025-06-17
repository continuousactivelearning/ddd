import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ActivityItem {
  date: string;
  count: number;
  type?: 'quiz' | 'course'; 
}

interface ActivityCalendarProps {
  activityData: ActivityItem[];
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ activityData }) => {
  const { darkMode } = useTheme();

  const weeks = [];
  const weekCount = 12;
  const cellsPerWeek = 7;
  const today = new Date();

  const maxCount = Math.max(...activityData.map(d => d.count));

  const calendar = Array(weekCount * cellsPerWeek).fill(null).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - ((weekCount * cellsPerWeek) - index - 1));
    const dateStr = date.toISOString().split('T')[0];

    const activity = activityData.find(d => d.date === dateStr);

    return {
      date: dateStr,
      count: activity?.count ?? 0,
      type: activity?.type ?? 'course',
      dayOfWeek: date.getDay()
    };
  });

  for (let i = 0; i < weekCount; i++) {
    weeks.push(calendar.slice(i * cellsPerWeek, (i + 1) * cellsPerWeek));
  }

  const getIntensityColor = (count: number, type: string) => {
    if (count === 0) return darkMode ? '#374151' : '#f3f4f6';

    const intensity = Math.ceil((count / maxCount) * 4);

    if (darkMode) {
      if (type === 'quiz') {
        return ['#4b5563', '#16a34a', '#15803d', '#166534', '#14532d'][intensity];
      } else {
        return ['#4b5563', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'][intensity];
      }
    } else {
      if (type === 'quiz') {
        return ['#e5e7eb', '#bbf7d0', '#86efac', '#4ade80', '#22c55e'][intensity];
      } else {
        return ['#e5e7eb', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6'][intensity];
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
        <span>12 weeks ago</span>
        <span>Today</span>
      </div>

      <div className="flex">
        <div className="mr-2 flex flex-col justify-between h-32 text-xs text-gray-500 dark:text-gray-400">
          <span>Sun</span>
          <span>Tue</span>
          <span>Thu</span>
          <span>Sat</span>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: getIntensityColor(day.count, day.type) }}
                  title={`${day.date}: ${day.count} ${day.type === 'quiz' ? 'quizzes attempted' : 'lessons completed'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2">
        <div className="flex items-center">
          <span className="mr-1">Course</span>
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-3 h-3 mx-0.5 rounded-sm"
              style={{ backgroundColor: getIntensityColor(i === 0 ? 0 : (i * maxCount) / 4, 'course') }}
            />
          ))}
        </div>
        <div className="flex items-center">
          <span className="mr-1">Quiz</span>
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-3 h-3 mx-0.5 rounded-sm"
              style={{ backgroundColor: getIntensityColor(i === 0 ? 0 : (i * maxCount) / 4, 'quiz') }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
