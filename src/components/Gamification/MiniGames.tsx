const MiniGames = () => {
  const games = ['Memory Map', 'Quiz', 'Short Questions'];

  return (
    <div className="space-y-2">
      {games.map((game) => (
        <button key={game} className="bg-indigo-600 text-white w-full p-2 rounded-lg">{game}</button>
      ))}
    </div>
  );
};

export default MiniGames;