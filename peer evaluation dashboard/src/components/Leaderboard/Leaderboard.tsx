import './styles.css'; // Make sure this path is correct based on your project structure

const users = [
  { name: 'Gaurpad', score: 1200 },
  { name: 'Anshika', score: 1100 },
  { name: 'Jhalak', score: 1050 },
  { name: 'Yogesh', score: 1050 },
];

const Leaderboard = () => (
  <div className="card leaderboard-full">
    <h2>🏆 Leaderboard</h2>
   <ul className="leaderboard">
  {users.map((u, i) => (
    <li key={u.name}>
      <div className="user-info">
       <span className="name">{i + 1}. {u.name}</span>
      </div>
      <span className="score">{u.score} XP</span>
    </li>
  ))}
</ul>
</div>
);

export default Leaderboard;
