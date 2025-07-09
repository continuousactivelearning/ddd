import { BrowserRouter as Router, Routes, Route , useLocation} from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';
import DashboardOverview from './pages/Dashboard';
import Quiz from './pages/Quiz';
import MatchmakingGame from './components/Gamification/matchmaking_game';
import HangmanGame from './components/Gamification/Hangman';
import SnakeGame from './components/Gamification/snake-game';
import MyCourses from './pages/MyCourses';
import CourseActivity from './pages/CourseActivity';
import Achievements from './pages/Achievements';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import PeerReviewDashboard from './pages/PeerReviewDashboard';
import FeedbackTrends from './pages/FeedbackTrends';
import Assignmentsubmission from "./pages/Assignmentsubmission";
import AssignmentEvaluation from './pages/AssignmentEvaluation';
import LoginForm from './pages/LoginPage';
import RegisterStep1 from './pages/RegisterStep1';
import RegisterStep2 from './pages/RegisterStep2';
import ForgotPassword from './pages/ForgotPassword';
import './App.css'; // Global styles
// import StudentDashboard from './pages/StudentDashboard';
// import TeacherDashboard from './pages/TeacherDashboard';
// import AdminDashboard from './pages/AdminDashboard';

import { AuthProvider } from './context/Authcontext'; // ✅ Import the provider

// ... your other imports

const MainLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/', '/Register1', '/Register2', '/ForgotPassword'];
  const isSidebarVisible = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {isSidebarVisible && <Sidebar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/Register1" element={<RegisterStep1 />} />
          <Route path="/Register2" element={<RegisterStep2 />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />

          <Route path="/Dashboard" element={<DashboardOverview />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/peer-review" element={<PeerReviewDashboard />} />
          <Route path="/feedback-trends" element={<FeedbackTrends />} />
          <Route path="/Assignmentsubmission" element={<Assignmentsubmission />} />
          <Route path="/AssignmentEvaluation" element={<AssignmentEvaluation />} />
          <Route path="/matchmaking" element={<MatchmakingGame />} />
          <Route path="/hangman" element={<HangmanGame />} />
          <Route path="/snake-game" element={<SnakeGame />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/course-activity" element={<CourseActivity />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider> {/* ✅ Wrap MainLayout here */}
        <MainLayout />
      </AuthProvider>
    </Router>
  );
};

export default App;

