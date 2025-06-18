import './styles.css';

const users = [
  {
    name: 'Gaurpad Shukla',
    level: 42,
    badges: 15,
    score: 2850,
    xp: 12500,
    streak: 28,
    change: 125,
    position: 1,
    you: false
  },
  {
    name: 'Anshika Shukla',
    level: 38,
    badges: 12,
    score: 2720,
    xp: 11800,
    streak: 21,
    change: 89,
    position: 2,
    you: false
  },
  {
    name: 'Jhalak ',
    level: 36,
    badges: 11,
    score: 2690,
    xp: 11200,
    streak: 19,
    change: -23,
    position: 3,
    you: false
  },
  {
    name: 'Yogesh Tharwani',
    level: 44,
    badges: 10,
    score: 2900,
    xp: 10900,
    streak: 16,
    change: 156,
    position: 4,
    you: true
  },
  {
    name: 'SK',
    level: 32,
    badges: 9,
    score: 2450,
    xp: 10200,
    streak: 14,
    change: 67,
    position: 5,
    you: false
  },
];

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
        {users.map((u) => (
          <li
            key={u.name}
            className={`leaderboard-entry ${u.position === 1 || u.position === 3 ? 'highlight' : ''} ${
              u.you ? 'you-row' : ''
            }`}
          >
            <div className="left">
              <div className="rank">{u.position}</div>
              <div className="avatar">{u.name.split(' ').map((n) => n[0]).join('')}</div>
              <div className="user-details">
                <span className="username">{u.name} {u.you && <span className="you-label">You</span>}</span>
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
