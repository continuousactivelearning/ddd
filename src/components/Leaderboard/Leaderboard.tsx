import './styles.css';
import { leaderboardUsers } from '../../data/SampleUserData'; // Adjust path as needed

const Leaderboard = () => {
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>Top Performers</h2>
        <p>Top learners this week</p>
        <div className="leaderboard-tabs">
          <button className="active">This Week</button>
          <button>Today</button>
          <button>This Month</button>
          <button>All Time</button>
        </div>
      </div>
      <ul className="leaderboard-list">
        {leaderboardUsers.map((u) => (
          <li
            key={u.name}
            className={`leaderboard-entry ${u.position === 1 || u.position === 3 ? 'highlight' : ''} ${u.you ? 'you-row' : ''}`}
          >
            <div className="left">
              <div className="rank">{u.position}</div>
              <div className="avatar">{u.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="user-details">
                <span className="username">
                  {u.name} {u.you && <span className="you-label">You</span>}
                </span>
                <span className="meta">Level {u.level} • {u.badges} badges</span>
              </div>
            </div>
            <div className="right">
              <div className="metric">
                <strong>{u.score.toLocaleString()}</strong>
                <span>Score</span>
              </div>
              <div className="metric">
                <strong>{u.xp.toLocaleString()}</strong>
                <span>XP</span>
              </div>
              <div className="metric">
                <strong>{u.streak}</strong>
                <span>Streak</span>
              </div>
              <div className={`change ${u.change >= 0 ? 'positive' : 'negative'}`}>
                {u.change >= 0 ? '▲' : '▼'} {Math.abs(u.change)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
