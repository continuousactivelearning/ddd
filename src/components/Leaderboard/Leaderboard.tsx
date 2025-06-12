const users = [
  { name: 'gaurpad', score: 1200 },
  { name: 'Anshika', score: 1100 },
  { name: 'jhalak', score: 1050 },
  { name: 'yogesh', score: 1050 },
];

const Leaderboard = () => (
  <div className="bg-white p-4 rounded-xl shadow-md">
    <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
    <ul>
      {users.map((u, i) => (
        <li key={u.name} className="flex justify-between">
          <span>{i + 1}. {u.name}</span>
          <span>{u.score} XP</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Leaderboard;