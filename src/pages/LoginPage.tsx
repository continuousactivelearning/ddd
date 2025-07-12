import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import { sampleUserData } from '../data/SampleUserData';
import { sampleTeacherData } from '../data/SampleTeacherData';
import { sampleAdminData } from '../data/SampleAdminData';
import './styles.css';

type Role = 'Student' | 'Teacher' | 'Admin';

interface FormData {
  email: string;
  password: string;
  role: Role;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    role: 'Student',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const normalizeUser = (user: any, role: Role) => {
    return {
      id: String(user.id),
      name: user.name || 'Unnamed',
      email: user.email || '',
      role: role as Role,
      avatar: user.avatar || user.profilePicture || '',
      courses: Array.isArray(user.courses)
        ? user.courses.map((course: any, i: number) => ({
            id: course.id || `course-${i}`,
            name: course.name || course.title || 'Untitled Course',
            instructor: course.instructor || 'Unknown',
            progress: course.progress || 0,
            grade: course.grade || 'N/A',
          }))
        : [],
      experience: String(user.experience || ''),
      performance: user.performance || {
        score: 0,
        accuracy: 0,
        totalQuestions: 0,
        quizScore: '0%',
      },
      achievements: user.achievements || [],
      badges: user.badges || [],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { email, password, role } = formData;
      let userData;

      switch (role) {
        case 'Student':
          userData = sampleUserData.find(u => u.email === email && u.password === password);
          break;
        case 'Teacher':
          userData = sampleTeacherData.find(u => u.email === email && u.password === password);
          break;
        case 'Admin':
          userData = sampleAdminData.find(u => u.email === email && u.password === password);
          break;
        default:
          setError('Invalid role selected.');
          setLoading(false);
          return;
      }

      if (!userData) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      const normalizedUser = normalizeUser(userData, role);

      sessionStorage.setItem('currentUser', JSON.stringify(normalizedUser));
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userRole', role);

      login(normalizedUser);

      switch (role) {
        case 'Teacher':
          navigate('/teacher-dashboard');
          break;
        case 'Admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/student-dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Login as:</label>
            <div className="radio-group">
              {['Student', 'Teacher', 'Admin'].map(role => (
                <label key={role}>
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleChange}
                  />
                  {role}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
