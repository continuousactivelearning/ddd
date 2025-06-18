// routes.jsx
// Defines all application routes using React Router.

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import Dashboard from './pages/student/Dashboard';
import Quiz from './pages/student/Quiz';
import QuizComplete from './pages/student/QuizComplete';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMeet from './pages/admin/Meet';
import { CircularProgress, Box } from '@mui/material';
import { useTheme } from '@mui/material';
import { memo } from 'react';

// Protected Route component
const ProtectedRoute = memo(({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          opacity: 0,
          animation: 'fadeIn 0.3s ease-in forwards'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // On student frontend, allow admin users to access student routes for testing
    // Only redirect if it's a student trying to access admin routes
    if (user.role === 'student' && allowedRoles.includes('admin')) {
      return <Navigate to="/student" replace />;
    }
    // For admin users on student frontend, allow access to student routes
    if (user.role === 'admin' && (allowedRoles.includes('student') || allowedRoles.includes('admin'))) {
      return children;
    }
    return <Navigate to="/student" replace />;
  }

  return (
    <Box
      sx={{
        opacity: 0,
        animation: 'fadeIn 0.3s ease-in forwards'
      }}
    >
      {children}
    </Box>
  );
});

ProtectedRoute.displayName = 'ProtectedRoute';

// Add this at the top of the file, after the imports
const globalStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Add this before the AppRoutes component
const GlobalStyles = () => {
  return <style>{globalStyles}</style>;
};

const AppRoutes = memo(() => {
  const { user } = useAuth();

  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to="/student" replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/public" 
          element={<Dashboard />}
        />
        <Route 
          path="/quiz/:quizCode" 
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/quizzes" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/student/quiz-complete" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <QuizComplete />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/meet/:meetId" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminMeet />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/student" replace />} />
      </Routes>
    </>
  );
});

AppRoutes.displayName = 'AppRoutes';

export default AppRoutes; 