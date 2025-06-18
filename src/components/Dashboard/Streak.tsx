import React from 'react';
import './styles.css';

const streakData = {
  currentStreak: 12,
  longestStreak: 25,
  bestStreakPercent: 48,
  week: [
    { day: 'M', date: '01/15', completed: true },
    { day: 'T', date: '01/16', completed: true },
    { day: 'W', date: '01/17', completed: true },
    { day: 'T', date: '01/18', completed: true },
    { day: 'F', date: '01/19', completed: true },
    { day: 'S', date: '01/20', completed: true },
    { day: 'S', date: '01/21', completed: false },
  ],
  milestone: {
    goal: 30,
    current: 12,
    label: 'Monthly Master Badge',
  },
  achievements: [
    { title: '7 Day Streak', desc: 'Week Warrior Badge', unlocked: true },
    { title: '14 Day Streak', desc: 'Consistency Champion', unlocked: true },
    { title: '30 Day Streak', desc: 'Monthly Master Badge', unlocked: false },
    { title: '100 Day Streak', desc: 'Century Streak Legend', unlocked: false },
  ],
};

const Streak: React.FC = () => {
  const { currentStreak, longestStreak, bestStreakPercent, week, milestone, achievements } = streakData;

  return (
    <div className="streak-card">
      <div className="streak-header">
        <h3>Learning Streak</h3>
        <p>Keep up the great work!</p>
        <div className="streak-flame">🔥</div>
      </div>

      <div className="streak-count">
        <div className="count">{currentStreak}</div>
        <div className="label">Current Streak (days)</div>
      </div>

      <div className="streak-week">
        {week.map((d, i) => (
          <div key={i} className={`day-box ${d.completed ? 'completed' : ''}`}>
            <div>{d.day}</div>
            <div className="date">{d.date}</div>
            {d.completed && <span className="check">✓</span>}
          </div>
        ))}
        <div className="week-summary">{week.filter(w => w.completed).length}/7 days</div>
      </div>

      <div className="streak-metrics">
        <div>
          <div className="metric-value">{longestStreak}</div>
          <div className="metric-label">Longest Streak</div>
        </div>
        <div>
          <div className="metric-value">{bestStreakPercent}%</div>
          <div className="metric-label">of Best Streak</div>
        </div>
      </div>

      <div className="milestone-progress">
        <div className="milestone-label">Next Milestone</div>
        <div className="milestone-title">{milestone.label}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(milestone.current / milestone.goal) * 100}%` }} />
        </div>
        <div className="milestone-stats">
          {milestone.current}/{milestone.goal} days
          <span className="milestone-remaining">{milestone.goal - milestone.current} days to go</span>
        </div>
      </div>

      <div className="achievements-section">
        <h4>Milestone Achievements</h4>
        <ul className="achievement-list">
          {achievements.map((ach, idx) => (
            <li key={idx} className={`achievement ${ach.unlocked ? 'unlocked' : 'locked'}`}>
              <div>
                <div className="ach-title">{ach.title}</div>
                <div className="ach-desc">{ach.desc}</div>
              </div>
              <div className="ach-icon">{ach.unlocked ? '🏅' : '🔒'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Streak;
