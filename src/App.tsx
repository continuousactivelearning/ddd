import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';
import DashboardOverview from './pages/Dashboard';
import Quiz from './pages/Quiz';
import MatchmakingGame from './components/Gamification/matchmaking_game';
import HangmanGame from './components/Gamification/Hangman';
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
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
