import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/Authcontext';
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

// Import role-specific dashboards
import TeacherDashboardOverview from './components/TeacherDashboard/TeacherDashboardOverview';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import TeacherSidebar from './components/sidebar/TeacherSidebar';
import AdminSidebar from './components/sidebar/AdminSidebar';

import { AuthProvider } from './context/Authcontext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'Teacher':
        return <Navigate to="/teacher-dashboard" replace />;
      case 'Admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'Student':
      default:
        return <Navigate to="/student-dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

// Dashboard Router Component - Handles initial dashboard routing
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Redirect to role-specific dashboard
  switch (user.role) {
    case 'Teacher':
      return <Navigate to="/teacher-dashboard" replace />;
    case 'Admin':
      return <Navigate to="/admin-dashboard" replace />;
    case 'Student':
    default:
      return <Navigate to="/student-dashboard" replace />;
  }
};

const MainLayout = () => {
   const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  // Routes where sidebar should be hidden
  const hideSidebarRoutes = ['/', '/Register1', '/Register2', '/ForgotPassword'];

  // Check if sidebar should be visible for any authenticated user
  const isSidebarVisible =
    isAuthenticated &&
    !hideSidebarRoutes.includes(location.pathname);

  // Function to render the appropriate sidebar based on user role
  const renderSidebar = () => {
    if (!isSidebarVisible) return null;
    
    switch (user?.role) {
      case 'Student':
        return <Sidebar />;
      case 'Teacher':
        return <TeacherSidebar />;
      case 'Admin':
        return <AdminSidebar />;
      default:
        return null;
    }
  };



  return (
    <div className="app-container">
      {isSidebarVisible && renderSidebar()}
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/Register1" element={<RegisterStep1 />} />
          <Route path="/Register2" element={<RegisterStep2 />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          
          {/* Main Dashboard Route - Redirects based on role */}
          <Route 
            path="/Dashboard" 
            element={
              <ProtectedRoute allowedRoles={[]}>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          
          {/* Role-Specific Dashboard Routes */}
          <Route 
            path="/teacher-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Teacher']}>
                <TeacherDashboardOverview />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Student Dashboard (default) */}
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <DashboardOverview />
              </ProtectedRoute>
            } 
          />
          
          {/* Student-Specific Routes */}
          <Route 
            path="/quiz" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <Quiz />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/peer-review" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <PeerReviewDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/Assignmentsubmission" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <Assignmentsubmission />
              </ProtectedRoute>
            } 
          />
                    
          <Route 
            path="/feedback-trends" 
            element={
              <ProtectedRoute allowedRoles={['Teacher', 'Admin']}>
                <FeedbackTrends />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin-Specific Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Gamification Routes - Available to Students */}
          <Route 
            path="/matchmaking" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <MatchmakingGame />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/hangman" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <HangmanGame />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/snake-game" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <SnakeGame />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/achievements" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <Achievements />
              </ProtectedRoute>
            } 
          />
          
          {/* Common Routes - Available to all authenticated users */}
          <Route 
            path="/my-courses" 
            element={
              <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}>
                <MyCourses />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/AssignmentEvaluation" 
            element={
              <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}>
                <AssignmentEvaluation />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/course-activity" 
            element={
              <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}>
                <CourseActivity />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}>
                <Calendar />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}>
                <Settings />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </Router>
  );
};

export default App;