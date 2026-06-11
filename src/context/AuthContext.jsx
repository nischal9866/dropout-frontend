import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import jwtDecode from 'jwt-decode';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          fetchUserProfile();
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('accounts/profile/');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('accounts/login/', { username, password });
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(userData);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${userData.first_name || userData.username}!`);
      
      return { success: true, userType: userData.user_type };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('accounts/register/', userData);
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      const errors = error.response?.data;
      const errorMessage = Object.values(errors || {}).flat().join(', ');
      toast.error(errorMessage || 'Registration failed');
      return { success: false, errors };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await axios.post('accounts/change-password/', passwordData);
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
      return { success: false };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('accounts/profile/', profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      register,
      changePassword,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};