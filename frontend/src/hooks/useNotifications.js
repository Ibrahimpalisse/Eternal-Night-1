import { useState, useCallback } from 'react';

const useNotifications = (autoFetch = true) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    // This is a mock implementation without backend dependency
    try {
      // Check if we have a stored count in localStorage
      const storedCount = localStorage.getItem('notif_unreadNotifications');
      const count = storedCount ? JSON.parse(storedCount) : 0;
      
      setUnreadCount(count);
      return count;
    } catch (error) {
      console.error('Error fetching notifications count:', error);
      return 0;
    }
  }, []);

  // Function to mark notifications as read
  const markAsRead = useCallback(async (notificationId) => {
    // Mock implementation
    setUnreadCount(prev => Math.max(0, prev - 1));
    localStorage.setItem('notif_unreadNotifications', JSON.stringify(Math.max(0, unreadCount - 1)));
    
    return true;
  }, [unreadCount]);

  // Function to mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    // Mock implementation
    setUnreadCount(0);
    localStorage.setItem('notif_unreadNotifications', '0');
    
    return true;
  }, []);

  return {
    unreadCount,
    notifications,
    loading,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead
  };
};

export default useNotifications; 