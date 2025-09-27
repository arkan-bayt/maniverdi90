import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // For mock API, check if token is valid
          if (api.getMe) {
            // Mock API
            const response = await api.getMe();
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            // Real API
            const response = await api.get('/auth/me');
            setUser(response.data.user);
            setToken(storedToken);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      let response;
      if (api.login) {
        // Mock API
        response = await api.login(username, password);
      } else {
        // Real API
        response = await api.post('/auth/login', { username, password });
      }

      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { token: newToken } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      return { success: true };
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSuperuser: user?.role === 'superuser',
    canManageUsers: user?.role === 'superuser' || user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};