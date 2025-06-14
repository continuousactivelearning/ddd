export async function fetchUserData() {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'Gaurpad Shukla',
        level: 12,
        points: 870,
        activityStreak: 6,
        badges: ['Top Performer', 'Fast Responder', 'Team Player']
      });
    }, 1000);
  });
}
