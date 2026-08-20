import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState([]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data } = await axiosInstance.get('/notifications');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      // Silent error
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const { data } = await axiosInstance.get('/wishlist');
      const ids = Array.isArray(data) ? data.map((item) => item._id || item) : [];
      setWishlistIds(ids);
    } catch (err) {
      // Silent error
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    try {
      await axiosInstance.put('/notifications/read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchWishlist();
      const interval = setInterval(fetchNotifications, 15000); // 15s polling for updates
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setWishlistIds([]);
    }
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        wishlistIds,
        fetchNotifications,
        fetchWishlist,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
