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
    set((state) => ({
      unreadCount: 0,
      // Keep notifications but mark them as read
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
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
        notifications: newIsOpen 
          ? state.notifications.map(n => ({ ...n, read: true }))
          : state.notifications,
      };
    });
  },

  /**
   * Open notification panel
   */
  openPanel: () => {
    set((state) => ({
      isOpen: true,
      unreadCount: 0,
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
  },

  /**
   * Close notification panel
   */
  closePanel: () => {
    set({ isOpen: false });
  },
}));

