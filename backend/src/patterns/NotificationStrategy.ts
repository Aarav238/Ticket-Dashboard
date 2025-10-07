// Strategy Pattern for notification system
// Allows switching between different notification methods (Email, Socket, etc.)
import { User, Activity } from '../types';
import { sendNotificationEmail } from '../services/emailService';
import { Server as SocketServer } from 'socket.io';

/**
 * Interface defining notification strategy
 * All notification implementations must follow this contract
 */
export interface NotificationStrategy {
  send(user: User, activity: Activity): Promise<void>;
}

/**
 * Email notification strategy
 * Sends notifications via email using Nodemailer
 */
export class EmailNotificationStrategy implements NotificationStrategy {
  /**
   * Sends notification via email
   * @param user - User to notify
   * @param activity - Activity details
   */
  async send(user: User, activity: Activity): Promise<void> {
    const subject = `Ticket Dashboard - ${activity.type.replace(/_/g, ' ')}`;
    await sendNotificationEmail(user.email, subject, activity.description);
  }
}

/**
 * Socket.io notification strategy
 * Sends real-time notifications via WebSocket
 */
export class SocketNotificationStrategy implements NotificationStrategy {
  private io: SocketServer;

  constructor(io: SocketServer) {
    this.io = io;
  }

  /**
   * Sends real-time notification via Socket.io
   * @param user - User to notify
   * @param activity - Activity details
   */
  async send(user: User, activity: Activity): Promise<void> {
    // Emit to specific user's room
    this.io.to(`user-${user.id}`).emit('notification', {
      id: activity.id,
      type: activity.type,
      description: activity.description,
      project_id: activity.project_id,
      ticket_id: activity.ticket_id,
      created_at: activity.created_at,
    });
  }
}

/**
 * Notification service using Strategy pattern
 * Can switch between different notification methods dynamically
 */
export class NotificationService {
  private strategy: NotificationStrategy;

  constructor(strategy: NotificationStrategy) {
    this.strategy = strategy;
  }

  /**
   * Sends notification using current strategy
   * @param user - User to notify
   * @param activity - Activity details
   */
  async notify(user: User, activity: Activity): Promise<void> {
    try {
      await this.strategy.send(user, activity);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Changes notification strategy at runtime
   * @param strategy - New notification strategy
   */
  setStrategy(strategy: NotificationStrategy): void {
    this.strategy = strategy;
  }
}

