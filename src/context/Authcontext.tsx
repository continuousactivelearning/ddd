// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define comprehensive User interface that handles all role types
interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for security
  role: 'Student' | 'Teacher' | 'Admin';
  avatar?: string;

  // Common properties
  phone?: string;
  status?: 'active' | 'inactive';
  profileImage?: string;
  joinDate?: string;
  lastLogin?: string;

  // Student-specific properties
  studentId?: string;
  class?: string;
  section?: string;
  rollNumber?: string;
  performance?: {
    score: number;
    accuracy: number;
    totalQuestions: number;
    quizScore: string;
  };
  quizHistory?: Array<{
    id: string;
    title: string;
    score: number;
    date: string;
    status: string;
  }>;
  courses?: Array<{ // This is the structure your sample data MUST match for students
    id: string;
    name: string; // Changed from 'title' to 'name' for consistency with User interface
    instructor: string;
    progress: number;
    grade: string;
  }>;

  // Teacher-specific properties
  teacherId?: string;
  department?: string;
  subjects?: string[];
  experience?: string;
  qualification?: string;
  assignedClasses?: Array<{
    classId: string;
    className: string;
    subject: string;
  }>;
  studentsTaught?: number;

  // Admin-specific properties
  permissions?: string[];
  adminLevel?: 'super' | 'department' | 'assistant';
  managedDepartments?: string[];
}

// Define the context interface
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  getUserRole: () => string | null;
  hasPermission: (permission: string) => boolean;
  isStudent: () => boolean;
  isTeacher: () => boolean;
  isAdmin: () => boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authStatus = sessionStorage.getItem('isAuthenticated');
        const userData = sessionStorage.getItem('currentUser');
        const userRole = sessionStorage.getItem('userRole');

        console.log('=== AUTH CHECK ===');
        console.log('Auth status from sessionStorage:', authStatus);
        console.log('User data from sessionStorage:', userData);
        console.log('User role from sessionStorage:', userRole);

        if (authStatus === 'true' && userData) {
          const parsedUser = JSON.parse(userData);

          // Ensure user has required properties and correct types
          const normalizedUser: User = {
            ...parsedUser,
            id: String(parsedUser.id), // Ensure id is string
            role: userRole || parsedUser.role || 'Student', // Ensure role is set
            email: parsedUser.email || '',
            name: parsedUser.name || 'Unknown User'
          };

          setUser(normalizedUser);
          setIsAuthenticated(true);
          console.log('User authenticated:', normalizedUser.name, 'Role:', normalizedUser.role);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          console.log('User not authenticated');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUser(null);
        // Clear corrupted data
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userRole');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array means this runs once on mount

  // Login function
  const login = (userData: User) => {
    console.log('=== LOGIN FUNCTION CALLED ===');
    console.log('User data:', userData);

    // Normalize user data (redundant if userData already conforms, but safe)
    const normalizedUser: User = {
      ...userData,
      id: String(userData.id), // Ensure id is string
      role: userData.role || 'Student',
      email: userData.email || '',
      name: userData.name || 'Unknown User'
    };

    setUser(normalizedUser);
    setIsAuthenticated(true);

    // Store in sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(normalizedUser));
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userRole', normalizedUser.role);

    console.log('Auth state updated - isAuthenticated:', true);
    console.log('User role set to:', normalizedUser.role);
  };

  // Logout function
  const logout = () => {
    console.log('=== LOGOUT FUNCTION CALLED ===');

    setUser(null);
    setIsAuthenticated(false);

    // Clear sessionStorage
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userRole');

    console.log('Auth state updated - isAuthenticated:', false);
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (!user) return; // Cannot update if no user is logged in

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);

    // Update sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));

    console.log('User updated:', updatedUser);
  };

  // Get user role
  const getUserRole = (): string | null => {
    return user?.role || null;
  };

  // Check if user has specific permission (mainly for admin users)
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Admin users with explicit permissions array
    if (user.role === 'Admin' && user.permissions) {
      return user.permissions.includes(permission);
    }

    // Default role-based permissions
    switch (user.role) {
      case 'Admin':
        return true; // Admins have all permissions by default if no explicit array or permission not found
      case 'Teacher':
        return ['view_students', 'grade_assignments', 'create_quizzes'].includes(permission);
      case 'Student':
        return ['view_courses', 'take_quizzes', 'view_grades'].includes(permission);
      default:
        return false;
    }
  };

  // Role check helper functions
  const isStudent = (): boolean => user?.role === 'Student';
  const isTeacher = (): boolean => user?.role === 'Teacher';
  const isAdmin = (): boolean => user?.role === 'Admin';

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateUser,
    getUserRole,
    hasPermission,
    isStudent,
    isTeacher,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the User type for use in other components
export type { User };