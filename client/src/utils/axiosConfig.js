import axios from 'axios';
import MockAPI from './mockAPI';

// For GitHub Pages deployment, use mock API
const USE_MOCK_API = process.env.NODE_ENV === 'production';

// Set base URL for API calls when using real backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Create mock API instance for GitHub Pages
const mockAPI = new MockAPI();

// Export appropriate API based on environment
export default USE_MOCK_API ? mockAPI : api;