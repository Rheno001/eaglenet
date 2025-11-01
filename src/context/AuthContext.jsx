import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../utils/roles';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('jwt', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          'http://localhost/backend/verify-token.php',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          const userData = res.data.user;
          login(userData, token);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Token verification error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const authContextValue = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
