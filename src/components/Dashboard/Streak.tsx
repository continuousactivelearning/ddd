import React from 'react';
import './styles.css';
import { getUserDataById } from '../../data/SampleUserData';

interface StreakProps {
  userId: string;
}

const Streak: React.FC<StreakProps> = ({ userId }) => {
  const user = getUserDataById(userId);
  if (!user) return null;

  const { current, longest, bestPercent, week } = user.streak;

  const milestoneGoal = 30;
  const achievements = [
    { title: '7 Day Streak', desc: 'Week Warrior Badge', unlocked: current >= 7 },
    { title: '14 Day Streak', desc: 'Consistency Champion', unlocked: current >= 14 },
    { title: '30 Day Streak', desc: 'Monthly Master Badge', unlocked: current >= 30 },
    { title: '100 Day Streak', desc: 'Century Streak Legend', unlocked: current >= 100 },
  ];

  return (
    <div className="streak-card">
      <div className="streak-header">
        <h3>Learning Streak</h3>
        <p>Keep up the great work!</p>
        <div className="streak-flame">🔥</div>
      </div>

      <div className="streak-count">
        <div className="count">{current}</div>
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
          <div className="metric-value">{longest}</div>
          <div className="metric-label">Longest Streak</div>
        </div>
        <div>
          <div className="metric-value">{bestPercent}%</div>
          <div className="metric-label">of Best Streak</div>
        </div>
      </div>

      <div className="milestone-progress">
        <div className="milestone-label">Next Milestone</div>
        <div className="milestone-title">Monthly Master Badge</div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(current / milestoneGoal) * 100}%` }}
          />
        </div>
        <div className="milestone-stats">
          {current}/{milestoneGoal} days
          <span className="milestone-remaining">{milestoneGoal - current} days to go</span>
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
