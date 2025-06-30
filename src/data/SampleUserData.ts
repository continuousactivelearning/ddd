export interface UserDashboardData {
  id: string;
  name: string;
  avatar?: string; 
  role?: string;
  performance: {
    score: number;
    accuracy: number;
    totalQuestions: number;
    quizScore: string;
  };
  peerComparison: number[];
  progress: {
    weeklyScores: { day: string; score: number; hours: number }[];
    peakScore: number;
    averageScore: number;
    totalHours: number;
  };
  xp: {
    daily: { day: string; xp: number; bonus: number }[];
  };
  streak: {
    current: number;
    longest: number;
    bestPercent: number;
    week: { day: string; date: string; completed: boolean }[];
  };
  badges: string[];
  courses: { title: string; progress: number }[];
}

export const sampleUserData: UserDashboardData[] = [
  {
    id: "user_001",
    name: "Gaurpad",
    avatar: "src/assets/user-avatar.jpg",
    role: "Student",
    performance: { score: 80, accuracy: 90, totalQuestions: 10, quizScore: "7.5/10" },
    peerComparison: [8, 6, 7, 9, 8],
    progress: {
      weeklyScores: [
        { day: "Mon", score: 60, hours: 2.0 },
        { day: "Tue", score: 62, hours: 2.3 },
        { day: "Wed", score: 64, hours: 2.6 },
        { day: "Thu", score: 66, hours: 2.9 },
        { day: "Fri", score: 68, hours: 3.2 },
        { day: "Sat", score: 70, hours: 3.5 },
        { day: "Sun", score: 72, hours: 3.8 }
      ],
      peakScore: 72,
      averageScore: 66,
      totalHours: 20.3
    },
    xp: {
      daily: [
        { day: "Mon", xp: 100, bonus: 10 },
        { day: "Tue", xp: 110, bonus: 13 },
        { day: "Wed", xp: 120, bonus: 16 },
        { day: "Thu", xp: 130, bonus: 19 },
        { day: "Fri", xp: 140, bonus: 22 },
        { day: "Sat", xp: 150, bonus: 25 },
        { day: "Sun", xp: 160, bonus: 28 }
      ]
    },
    streak: {
      current: 10,
      longest: 20,
      bestPercent: 40,
      week: [
        { day: "M", date: "01/15", completed: true },
        { day: "T", date: "01/16", completed: false },
        { day: "W", date: "01/17", completed: true },
        { day: "T", date: "01/18", completed: false },
        { day: "F", date: "01/19", completed: true },
        { day: "S", date: "01/20", completed: false },
        { day: "S", date: "01/21", completed: true }
      ]
    },
    badges: ["Early Bird", "Quiz Champion"],
    courses: [
      { title: "Data Structure and Algorithms", progress: 50 },
      { title: "MERN Stack Development", progress: 40 },
      { title: "SQL and Analytics", progress: 60 },
      { title: "Cloud Practitioner and Architect", progress: 30 }
    ]
  },
  {
    id: "user_002",
    name: "Anshika",
    avatar: "src/assets/anshika.jpg", 
    role: "Student",
    performance: { score: 88, accuracy: 87, totalQuestions: 12, quizScore: "8.1/10" },
    peerComparison: [7, 8, 6, 8, 7],
    progress: {
      weeklyScores: [
        { day: "Mon", score: 75, hours: 2.8 },
        { day: "Tue", score: 78, hours: 3.0 },
        { day: "Wed", score: 80, hours: 2.5 },
        { day: "Thu", score: 76, hours: 2.9 },
        { day: "Fri", score: 79, hours: 3.2 },
        { day: "Sat", score: 81, hours: 3.5 },
        { day: "Sun", score: 84, hours: 3.6 }
      ],
      peakScore: 84,
      averageScore: 79,
      totalHours: 21.5
    },
    xp: {
      daily: [
        { day: "Mon", xp: 130, bonus: 20 },
        { day: "Tue", xp: 140, bonus: 22 },
        { day: "Wed", xp: 135, bonus: 18 },
        { day: "Thu", xp: 138, bonus: 20 },
        { day: "Fri", xp: 145, bonus: 25 },
        { day: "Sat", xp: 150, bonus: 26 },
        { day: "Sun", xp: 155, bonus: 28 }
      ]
    },
    streak: {
      current: 8,
      longest: 18,
      bestPercent: 38,
      week: [
        { day: "M", date: "01/15", completed: false },
        { day: "T", date: "01/16", completed: true },
        { day: "W", date: "01/17", completed: true },
        { day: "T", date: "01/18", completed: true },
        { day: "F", date: "01/19", completed: false },
        { day: "S", date: "01/20", completed: true },
        { day: "S", date: "01/21", completed: true }
      ]
    },
    badges: ["Quiz Champion"],
    courses: [
      { title: "Data Structure and Algorithms", progress: 60 },
      { title: "MERN Stack Development", progress: 45 },
      { title: "SQL and Analytics", progress: 50 },
      { title: "Cloud Practitioner and Architect", progress: 35 }
    ]
  },
  {
    id: "user_003",
    name: "Jhalak",
    avatar: "src/assets/jhalak.jpg", 
    role: "Student",
    performance: { score: 82, accuracy: 85, totalQuestions: 14, quizScore: "7.8/10" },
    peerComparison: [6, 6, 7, 7, 6],
    progress: {
      weeklyScores: [
        { day: "Mon", score: 68, hours: 2.0 },
        { day: "Tue", score: 70, hours: 2.3 },
        { day: "Wed", score: 72, hours: 2.7 },
        { day: "Thu", score: 74, hours: 3.0 },
        { day: "Fri", score: 76, hours: 3.2 },
        { day: "Sat", score: 78, hours: 3.4 },
        { day: "Sun", score: 80, hours: 3.5 }
      ],
      peakScore: 80,
      averageScore: 74,
      totalHours: 20.1
    },
    xp: {
      daily: [
        { day: "Mon", xp: 110, bonus: 15 },
        { day: "Tue", xp: 115, bonus: 18 },
        { day: "Wed", xp: 120, bonus: 19 },
        { day: "Thu", xp: 125, bonus: 21 },
        { day: "Fri", xp: 130, bonus: 23 },
        { day: "Sat", xp: 135, bonus: 24 },
        { day: "Sun", xp: 140, bonus: 26 }
      ]
    },
    streak: {
      current: 9,
      longest: 21,
      bestPercent: 42,
      week: [
        { day: "M", date: "01/15", completed: true },
        { day: "T", date: "01/16", completed: true },
        { day: "W", date: "01/17", completed: false },
        { day: "T", date: "01/18", completed: true },
        { day: "F", date: "01/19", completed: false },
        { day: "S", date: "01/20", completed: true },
        { day: "S", date: "01/21", completed: false }
      ]
    },
    badges: ["Early Bird"],
    courses: [
      { title: "Data Structure and Algorithms", progress: 65 },
      { title: "MERN Stack Development", progress: 55 },
      { title: "SQL and Analytics", progress: 45 },
      { title: "Cloud Practitioner and Architect", progress: 40 }
    ]
  },
  {
    id: "user_004",
    name: "Yogesh",
    avatar: "../../assets/user-avatar.jpg", 
    role: "Student",
    performance: { score: 90, accuracy: 93, totalQuestions: 16, quizScore: "9.1/10" },
    peerComparison: [9, 9, 8, 8, 9],
    progress: {
      weeklyScores: [
        { day: "Mon", score: 85, hours: 3.0 },
        { day: "Tue", score: 87, hours: 3.1 },
        { day: "Wed", score: 89, hours: 3.4 },
        { day: "Thu", score: 91, hours: 3.7 },
        { day: "Fri", score: 93, hours: 4.0 },
        { day: "Sat", score: 95, hours: 4.2 },
        { day: "Sun", score: 97, hours: 4.5 }
      ],
      peakScore: 97,
      averageScore: 91,
      totalHours: 25.9
    },
    xp: {
      daily: [
        { day: "Mon", xp: 150, bonus: 25 },
        { day: "Tue", xp: 160, bonus: 27 },
        { day: "Wed", xp: 170, bonus: 28 },
        { day: "Thu", xp: 180, bonus: 30 },
        { day: "Fri", xp: 190, bonus: 32 },
        { day: "Sat", xp: 200, bonus: 33 },
        { day: "Sun", xp: 210, bonus: 35 }
      ]
    },
    streak: {
      current: 14,
      longest: 30,
      bestPercent: 50,
      week: [
        { day: "M", date: "01/15", completed: true },
        { day: "T", date: "01/16", completed: true },
        { day: "W", date: "01/17", completed: true },
        { day: "T", date: "01/18", completed: true },
        { day: "F", date: "01/19", completed: true },
        { day: "S", date: "01/20", completed: true },
        { day: "S", date: "01/21", completed: true }
      ]
    },
    badges: ["Early Bird", "Streak Master", "Quiz Champion"],
    courses: [
      { title: "Data Structure and Algorithms", progress: 90 },
      { title: "MERN Stack Development", progress: 80 },
      { title: "SQL and Analytics", progress: 85 },
      { title: "Cloud Practitioner and Architect", progress: 70 }
    ]
  }
];

export const getUserDataById = (id: string): UserDashboardData | undefined => {
  return sampleUserData.find((user) => user.id === id);
};

export const invitations = [
  { id: 1, name: "Anshika Shukla", topic: "Teamwork", instructor: "Dr. A. Kumar", deadline: "Tomorrow", rating: 4.5 },
  { id: 2, name: "Gaurpad Shukla", topic: "Communication", instructor: "Prof. R. Rao", deadline: "Friday", rating: 4.2 },
  { id: 3, name: "Yogesh Tharwani", topic: "Creativity", instructor: "Dr. M. Singh", deadline: "Monday", rating: 4.8 },
];

export const activeReviews = [
  { id: 4, name: "Jhalak", topic: "Problem Solving", progress: 60 },
  { id: 5, name: "Anshika Shukla", topic: "Technical Skills", progress: 30 },
  { id: 6, name: "Gaurpad Shukla", topic: "Leadership", progress: 80 },
];

export const pastReviews = [
  { id: 7, name: "Anshika Shukla", topic: "Teamwork", summary: "Excellent collaborator.", score: 9 },
  { id: 8, name: "Jhalak", topic: "Communication", summary: "Clear and concise.", score: 8 },
  { id: 9, name: "Yogesh Tharwani", topic: "Initiative", summary: "Great leadership.", score: 10 },
];

export const weeklyFeedback = [
  { label: 'Week 1', MERN: 8, DataStructuresAndAlgorithms: 7, SQLAnalytics: 6 , CloudComputing: 5},
  { label: 'Week 2', MERN: 9, DataStructuresAndAlgorithms: 8, SQLAnalytics: 7 , CloudComputing: 6},
  { label: 'Week 3', MERN: 7, DataStructuresAndAlgorithms: 9, SQLAnalytics: 8 , CloudComputing: 7},
  { label: 'Week 4', MERN: 8, DataStructuresAndAlgorithms: 7, SQLAnalytics: 9 , CloudComputing: 8},
];

export const monthlyFeedback = [
  { label: 'Jan', MERN: 7, DataStructuresAndAlgorithms: 6, SQLAnalytics: 5, CloudComputing: 4 },
  { label: 'Feb', MERN: 8, DataStructuresAndAlgorithms: 7, SQLAnalytics: 7, CloudComputing: 5 },
  { label: 'Mar', MERN: 9, DataStructuresAndAlgorithms: 8, SQLAnalytics: 8, CloudComputing: 6 },
  { label: 'Apr', MERN: 9, DataStructuresAndAlgorithms: 9, SQLAnalytics: 9, CloudComputing: 7 },
];

export const leaderboardUsers = sampleUserData.map((user, index) => {
  const totalXP = user.xp.daily.reduce((sum, entry) => sum + entry.xp + entry.bonus, 0);
  const totalScore = user.performance.score + user.performance.accuracy + user.performance.totalQuestions;
  return {
    name: user.name,
    level: Math.floor(user.performance.score / 2) + 20, // Simple level logic
    badges: user.badges.length,
    score: totalScore * 10, // Derived score
    xp: totalXP,
    streak: user.streak.current,
    change: [125, 89, -23, 156][index] || 0, // Dummy change data
    position: index + 1,
    you: user.name === 'Yogesh', // Highlight this user
  };
});

export const getDashboardMetricsById = (userId: string) => {
  const user = sampleUserData.find((u) => u.id === userId);
  if (!user) return null;

  // Calculate work time from total hours
  const totalMinutes = Math.round(user.progress.totalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const workTime = `${hours}h ${minutes}m`;

  return {
    workTime,
    evaluationsPending: 36, // Static or can be calculated if data available
    evaluationsCompleted: "59%", // Static for now
    streak: `${user.streak.current} Days`,
  };
};


