import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';
import DashboardOverview from './pages/Dashboard';
import Quiz from './pages/Quiz';
import MatchmakingGame from './components/Gamification/matchmaking_game';
import HangmanGame from './components/Gamification/Hangman';

import MyCourses from './pages/MyCourses';
import CourseActivity from './pages/CourseActivity';
import Achievements from './pages/Achievements';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/matchmaking" element={<MatchmakingGame />} />
            <Route path="/hangman" element={<HangmanGame />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/course-activity" element={<CourseActivity />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
