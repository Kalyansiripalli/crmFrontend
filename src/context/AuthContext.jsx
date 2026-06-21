import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load user profile on startup if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('crmToken');
      if (token) {
        try {
          const { data } = await api.get('/api/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Session restored failed', error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('crmToken', data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
      });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      setAuthError(message);
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      localStorage.setItem('crmToken', data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
      });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Email might be in use.';
      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('crmToken');
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        register,
        logout,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
