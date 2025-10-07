"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/store/notificationStore";
import { socketService } from "@/lib/socket";
import { X, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Notification Panel Component
 * Displays real-time notifications from Socket.io
 * Includes badge with unread count
 */
export function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    isOpen,
    addNotification,
    removeNotification,
    clearNotifications,
    markAsRead,
    togglePanel,
  } = useNotificationStore();

  // Setup Socket.io listeners for real-time notifications
  useEffect(() => {
    if (socketService.isSocketConnected()) {
      // Listen for notification events
      socketService.onNotification((activity) => {
        addNotification(activity);
        
        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification("New Activity", {
            body: activity.description,
            icon: "/favicon.ico",
          });
        }
      });
    }

    return () => {
      socketService.removeListener("notification");
    };
  }, [addNotification]);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /**
   * Format timestamp for display
   */
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      {/* Notification button */}
      <button
        onClick={togglePanel}
        className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-105 transition-transform"
      >
        <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={togglePanel}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAsRead}
                        className="text-xs"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark all read
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearNotifications}
                        className="text-xs text-red-600"
                      >
                        Clear all
                      </Button>
                    </>
                  )}
                  <button
                    onClick={togglePanel}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Notifications list */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              {notification.type}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                              {formatTime(notification.created_at)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <X className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

