import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Optionally fetch user profile
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('Making API request to /api/auth/login...');
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('API response received:', response.status, response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken || !userData) {
        console.error('Invalid response data:', response.data);
        return { success: false, message: 'Invalid response from server' };
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      console.log('Login successful, user set:', userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
        return { 
          success: false, 
          message: 'Cannot connect to server. Make sure the backend is running: npm run dev' 
        };
      }
      if (error.response?.status === 401) {
        return { 
          success: false, 
          message: 'Invalid email or password. Don\'t have an account? Click "Get Started" to create one.' 
        };
      }
      if (error.response?.status === 500) {
        return { 
          success: false, 
          message: 'Server error. Check if MongoDB is connected and backend is running.' 
        };
      }
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (email, password, profile) => {
    try {
      const response = await axios.post('/api/auth/register', { email, password, profile });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


