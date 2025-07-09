// src/pages/ForgotPassword.tsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register2.css'; // reuse same styling

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setSuccessMessage('');

    if (!value.trim()) {
      setError('EmailID is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setError('Invalid EmailID');
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || error) {
      setError('Please enter a valid EmailID');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setSuccessMessage('Reset password link has been sent to your registered email ID');
      setEmail('');
    } catch (err) {
      console.error('Error sending reset email:', err);
      setError('Failed to send reset email. Try again later.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={handleChange}
          />
          {error && <p className="error-text">{error}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
