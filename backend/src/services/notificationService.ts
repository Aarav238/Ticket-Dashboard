// Unified notification service for sending Socket.io and Email notifications
import { Server as SocketServer } from 'socket.io';
import { getAllUsersExcept, isUserOffline } from '../models/queries';
import { sendNotificationEmail } from './emailService';

/**
 * Notification data structure
 */
export interface NotificationData {
  type: string;
  title: string;
  description: string;
  project_id?: string;
  ticket_id?: string;
}

/**
 * Sends notifications to all users except the one who triggered the action
 * - Online users receive Socket.io notifications
 * - Offline users receive email notifications
 * 
 * @param io - Socket.io server instance
 * @param excludeUserId - User ID to exclude (typically the user who triggered the action)
 * @param notification - Notification data
 */
export const notifyAllUsers = async (
  io: SocketServer,
  excludeUserId: string,
  notification: NotificationData
): Promise<void> => {
  try {
    // Get all users except the one who triggered the action
    const allUsers = await getAllUsersExcept(excludeUserId);
    
    // Get all currently connected Socket.io users
    const sockets = await io.fetchSockets();
    const connectedUserIds = new Set(
      sockets.map((socket) => socket.data.user?.userId).filter(Boolean)
    );

    console.log(`📢 Notifying ${allUsers.length} users about: ${notification.title}`);
    
    // Counters for logging
    let socketNotifications = 0;
    let emailNotifications = 0;

    // Process each user
    for (const user of allUsers) {
      try {
        // Check if user is currently connected via Socket.io
        if (connectedUserIds.has(user.id)) {
          // User is ONLINE → Send Socket.io notification
          io.to(`user-${user.id}`).emit('notification', {
            id: `notif-${Date.now()}-${user.id}`,
            type: notification.type,
            description: notification.description,
            project_id: notification.project_id,
            ticket_id: notification.ticket_id,
            created_at: new Date().toISOString(),
            read: false,
          });
          socketNotifications++;
          console.log(`  ✅ Socket.io → ${user.email}`);
        } else {
          // User is NOT currently connected → Check if truly offline
          const offline = await isUserOffline(user.id);
          
          if (offline) {
            // User is OFFLINE → Send Email notification
            await sendNotificationEmail(
              user.email,
              `Ticket Dashboard - ${notification.title}`,
              notification.description
            );
            emailNotifications++;
            console.log(`  📧 Email → ${user.email}`);
          } else {
            console.log(`  ⏭️  Skipped → ${user.email} (recently active)`);
          }
        }
      } catch (error) {
        console.error(`  ❌ Error notifying ${user.email}:`, error);
        // Continue with other users even if one fails
      }
    }

    console.log(`📊 Notification summary: ${socketNotifications} Socket.io, ${emailNotifications} emails`);
  } catch (error) {
    console.error('❌ Error in notifyAllUsers:', error);
    throw error;
  }
};

/**
 * Sends notifications to specific users only
 * - Online users receive Socket.io notifications
 * - Offline users receive email notifications
 * 
 * @param io - Socket.io server instance
 * @param userIds - Array of user IDs to notify
 * @param notification - Notification data
 */
export const notifySpecificUsers = async (
  io: SocketServer,
  userIds: string[],
  notification: NotificationData
): Promise<void> => {
  try {
    // Get all currently connected Socket.io users
    const sockets = await io.fetchSockets();
    const connectedUserIds = new Set(
      sockets.map((socket) => socket.data.user?.userId).filter(Boolean)
    );

    console.log(`📢 Notifying ${userIds.length} specific users about: ${notification.title}`);

    for (const userId of userIds) {
      try {
        if (connectedUserIds.has(userId)) {
          // User is ONLINE → Send Socket.io notification
          io.to(`user-${userId}`).emit('notification', {
            id: `notif-${Date.now()}-${userId}`,
            type: notification.type,
            description: notification.description,
            project_id: notification.project_id,
            ticket_id: notification.ticket_id,
            created_at: new Date().toISOString(),
            read: false,
          });
          console.log(`  ✅ Socket.io → User ${userId}`);
        } else {
          // User is NOT currently connected → Check if offline
          const offline = await isUserOffline(userId);
          
          if (offline) {
            // We need the user's email for email notifications
            // This function is best used when you have full user objects
            console.log(`  ⚠️  Cannot email user ${userId} without email address`);
          }
        }
      } catch (error) {
        console.error(`  ❌ Error notifying user ${userId}:`, error);
      }
    }
  } catch (error) {
    console.error('❌ Error in notifySpecificUsers:', error);
    throw error;
  }
};

/**
 * Sends a project-wide notification to all users in a project room
 * This is for real-time board updates (ticket moves, updates, etc.)
 * 
 * @param io - Socket.io server instance
 * @param projectId - Project ID
 * @param event - Event name (e.g., 'ticket-created', 'ticket-updated')
 * @param data - Event data
 */
export const notifyProjectRoom = (
  io: SocketServer,
  projectId: string,
  event: string,
  data: any
): void => {
  io.to(`project:${projectId}`).emit(event, data);
  console.log(`📡 Broadcast to project:${projectId} → ${event}`);
};

