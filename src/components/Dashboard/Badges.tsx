const badges = ['Newbie', 'Task Master', 'Productivity Pro', 'Legend', 'Dominator'];

const Badges = () => (
  <div className="flex gap-2 flex-wrap">
    {badges.map((badge) => (
      <div key={badge} className="bg-yellow-500 text-white px-4 py-2 rounded-full">{badge}</div>
    ))}
  </div>
);

export default Badges;