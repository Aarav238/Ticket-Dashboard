// Zustand store for notifications state management
import { create } from 'zustand';
import type { Activity } from '@/types';

interface NotificationState {
  // State
  notifications: Activity[];
  unreadCount: number;
  isOpen: boolean;

  // Actions
  addNotification: (notification: Activity) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: () => void;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

/**
 * Notifications store for managing real-time notifications
 */
export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  isOpen: false,

  /**
   * Add new notification to the list
   */
  addNotification: (notification: Activity) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // Optional: Auto-remove notification after 10 seconds
    setTimeout(() => {
      const currentNotifications = get().notifications;
      if (currentNotifications.find((n) => n.id === notification.id)) {
        get().removeNotification(notification.id);
      }
    }, 10000);
  },

  /**
   * Remove notification by ID
   */
  removeNotification: (id: string) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      const wasUnread = notification && state.unreadCount > 0;
      
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      };
    });
  },

  /**
   * Clear all notifications
   */
  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  /**
   * Mark all notifications as read
   */
  markAsRead: () => {
    set({ unreadCount: 0 });
  },

  /**
   * Toggle notification panel
   */
  togglePanel: () => {
    set((state) => {
      const newIsOpen = !state.isOpen;
      // Mark as read when opening
      return {
        isOpen: newIsOpen,
        unreadCount: newIsOpen ? 0 : state.unreadCount,
      };
    });
  },

  /**
   * Open notification panel
   */
  openPanel: () => {
    set({ isOpen: true, unreadCount: 0 });
  },

  /**
   * Close notification panel
   */
  closePanel: () => {
    set({ isOpen: false });
  },
}));

