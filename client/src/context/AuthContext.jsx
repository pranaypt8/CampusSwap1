import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusswap_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('campusswap_user', JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}! 👋`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/register', userData);
      setUser(data);
      localStorage.setItem('campusswap_user', JSON.stringify(data));
      toast.success('Registration successful! Welcome to CampusSwap 🎉');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusswap_user');
    toast.success('Logged out successfully.');
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put('/auth/profile', updatedData);
      const newUserData = { ...user, ...data };
      setUser(newUserData);
      localStorage.setItem('campusswap_user', JSON.stringify(newUserData));
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
