import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request URL:', config.url);
    console.log('Token present:', !!token);
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'No token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('No token found in localStorage');
    }
    // Add cache control headers to prevent unnecessary requests
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only force logout if the 401 is from the auth check endpoint
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes('/api/admin/auth/me')
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // For other 401s, just reject the error (let the page handle it)
    return Promise.reject(error.response?.data?.message || 'An error occurred. Please try again.');
  }
);

export default instance; 