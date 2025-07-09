import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the User interface based on your data structure
interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  role?: string;
  avatar?: string;
  // Add other user properties as needed
}

// Define the context interface
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
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
        
        console.log('=== AUTH CHECK ===');
        console.log('Auth status from sessionStorage:', authStatus);
        console.log('User data from sessionStorage:', userData);
        
        if (authStatus === 'true' && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('User authenticated:', parsedUser.name);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          console.log('User not authenticated');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = (userData: User) => {
    console.log('=== LOGIN FUNCTION CALLED ===');
    console.log('User data:', userData);
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store in sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    sessionStorage.setItem('isAuthenticated', 'true');
    
    console.log('Auth state updated - isAuthenticated:', true);
  };

  // Logout function
  const logout = () => {
    console.log('=== LOGOUT FUNCTION CALLED ===');
    
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear sessionStorage
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isAuthenticated');
    
    console.log('Auth state updated - isAuthenticated:', false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
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