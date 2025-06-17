import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle CORS errors
    if (error.response?.status === 0) {
      console.error('CORS error:', error);
      return Promise.reject(new Error('CORS error. Please check your connection.'));
    }

    // Handle other errors
    console.error('API error:', error);
    return Promise.reject(error.response?.data?.message || 'An error occurred. Please try again.');
  }
);

export default instance; 