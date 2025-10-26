import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/verify-token.php`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success && response.data.user) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          } else {
            await refreshToken();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          await refreshToken();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    verifyToken();

    // Set up periodic token refresh (e.g., every 15 minutes)
    const interval = setInterval(refreshToken, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/refresh-token.php`, {}, {
        withCredentials: true,
      });
      if (response.data.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Add axios interceptor to handle token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401 && error.config && !error.config.__isRetryRequest) {
          error.config.__isRetryRequest = true;
          try {
            await refreshToken();
            const token = localStorage.getItem('authToken');
            error.config.headers.Authorization = `Bearer ${token}`;
            return axios(error.config);
          } catch (refreshError) {
            logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};