import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sampleUserData } from '../data/SampleUserData';
import { useAuth } from '../context/Authcontext';
import './styles.css';

interface FormData {
  email: string;
  password: string;
  role: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    role: 'Student'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  // Debug: Log the imported data when component mounts
  useEffect(() => {
    console.log('=== DEBUG INFO ===');
    console.log('Sample user data:', sampleUserData);
    console.log('Total users:', sampleUserData.length);
    sampleUserData.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password ? 'SET' : 'MISSING'
      });
    });
    console.log('=== END DEBUG ===');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Quick test function to verify a specific user
  const testSpecificUser = () => {
    const testEmail = 'gaurpadshukla@gmail.com';
    const testPassword = 'Gaurpad123';
    
    console.log('=== TESTING SPECIFIC USER ===');
    console.log('Test email:', testEmail);
    console.log('Test password:', testPassword);
    console.log('Selected role:', formData.role);
    
    const found = sampleUserData.find(u => {
      console.log('Checking user:', u.name);
      console.log('User email:', u.email);
      console.log('User password:', u.password);
      console.log('User role:', u.role);
      console.log('Email match:', u.email === testEmail);
      console.log('Password match:', u.password === testPassword);
      return u.email === testEmail && u.password === testPassword;
    });
    
    console.log('Found user:', found);
    console.log('=== END TEST ===');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Form email:', `"${formData.email}"`);
      console.log('Form password:', `"${formData.password}"`);
      console.log('Selected role:', `"${formData.role}"`);
      console.log('Email length:', formData.email.length);
      console.log('Password length:', formData.password.length);

      // Check if data exists
      if (!sampleUserData || sampleUserData.length === 0) {
        console.error('No sample user data available!');
        setError('No user data available. Check your data import.');
        setLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user with detailed logging
      const user = sampleUserData.find((u, index) => {
        console.log(`Checking user ${index + 1} (${u.name}):`);
        console.log('  Email:', `"${u.email}"`);
        console.log('  Password:', `"${u.password}"`);
        console.log('  Role:', `"${u.role}"`);
        console.log('  Email match:', u.email === formData.email);
        console.log('  Password match:', u.password === formData.password);
        console.log('  Role match:', (u.role || 'Student') === formData.role);
        console.log('  All match:', u.email === formData.email && u.password === formData.password && (u.role || 'Student') === formData.role);
        
        // Check email and password match, and role matches (default to Student if role not set)
        return u.email === formData.email && 
               u.password === formData.password && 
               (u.role || 'Student') === formData.role;
      });

      console.log('Final result - Found user:', user);

      if (user) {
        // Store user data in sessionStorage (for persistence)
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userRole', formData.role);
        
        // Update auth context
        login(user);
        
        console.log('Login successful for:', user.name);
        console.log('Role:', formData.role);
        console.log('Navigating to dashboard...');
        
        // Redirect to dashboard
        navigate('/Dashboard');
      } else {
        setError('Invalid email, password, or role. Please try again.');
        console.log('Login failed - no matching user found');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        
        {/* Debug button */}
        <button type="button" onClick={testSpecificUser} style={{
          marginBottom: '10px',
          padding: '5px 10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          Test Gaurpad Login (Check Console)
        </button>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selection */}
          <div className="form-group">
            <label>Login as:</label>
            <div className="radio-group" style={{
              display: 'flex',
              gap: '15px',
              marginTop: '8px',
              flexWrap: 'wrap'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={formData.role === 'Student'}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                Student
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="Teacher"
                  checked={formData.role === 'Teacher'}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                Teacher
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="Admin"
                  checked={formData.role === 'Admin'}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                Admin
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          <div className="demo-accounts">
            <p style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>Demo Accounts (All as Students):</p>
            <div style={{ fontSize: '11px', color: '#888', lineHeight: '1.4' }}>
              <p>• gaurpadshukla@gmail.com / Gaurpad123</p>
              <p>• anshikashukla0410@gmail.com / Anshika123</p>
              <p>• yogeshtharwani@gmail.com / Yogesh123</p>
              <p>• jhalak@gmail.com / yourPassword</p>
            </div>
            <p style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
              Note: Select "Student" role for demo accounts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;