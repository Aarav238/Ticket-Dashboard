// Socket.io configuration for real-time updates
import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyTokenSafe } from '../utils/jwt';
import { setUserOnlineStatus } from '../models/queries';

/**
 * Initializes Socket.io server with authentication
 * @param httpServer - HTTP server instance
 * @returns Socket.io server instance
 */
export const initializeSocket = (httpServer: HTTPServer): SocketServer => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyTokenSafe(token);

    if (!decoded) {
      return next(new Error('Authentication error: Invalid token'));
    }

    // Attach user to socket
    socket.data.user = decoded;
    next();
  });

  // Handle Socket.io connections
  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`✅ User connected: ${user.email} (${socket.id})`);

    // Set user as online
    setUserOnlineStatus(user.userId, true).catch((error) => {
      console.error('Error setting user online:', error);
    });

    // Join user-specific room for notifications
    socket.join(`user-${user.userId}`);

    /**
     * Join a project room to receive real-time updates
     * @param projectId - Project ID to join
     */
    socket.on('join-project', (projectId: string) => {
      socket.join(`project-${projectId}`);
      console.log(`User ${user.email} joined project ${projectId}`);
    });

    /**
     * Leave a project room
     * @param projectId - Project ID to leave
     */
    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project-${projectId}`);
      console.log(`User ${user.email} left project ${projectId}`);
    });

    /**
     * Broadcast ticket update to all users in project room
     * @param data - Ticket update data with projectId
     */
    socket.on('ticket-updated', (data: { projectId: string; ticket: any }) => {
      socket.to(`project-${data.projectId}`).emit('ticket-updated', data.ticket);
    });

    /**
     * Broadcast ticket moved event (drag-and-drop)
     * @param data - Ticket move data with projectId
     */
    socket.on('ticket-moved', (data: { projectId: string; ticket: any }) => {
      socket.to(`project-${data.projectId}`).emit('ticket-moved', data.ticket);
    });

    /**
     * Broadcast ticket created event
     * @param data - New ticket data with projectId
     */
    socket.on('ticket-created', (data: { projectId: string; ticket: any }) => {
      socket.to(`project-${data.projectId}`).emit('ticket-created', data.ticket);
    });

    /**
     * Broadcast ticket deleted event
     * @param data - Deleted ticket data with projectId and ticketId
     */
    socket.on('ticket-deleted', (data: { projectId: string; ticketId: string }) => {
      socket.to(`project-${data.projectId}`).emit('ticket-deleted', data.ticketId);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${user.email} (${socket.id})`);
      
      // Set user as offline
      setUserOnlineStatus(user.userId, false).catch((error) => {
        console.error('Error setting user offline:', error);
      });
    });
  });

  return io;
};

export default initializeSocket;

