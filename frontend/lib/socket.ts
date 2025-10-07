// Socket.io client for real-time updates
import { io, Socket } from 'socket.io-client';
import type { Ticket, Activity } from '@/types';

/**
 * Socket.io service for managing WebSocket connections
 * Singleton pattern to ensure only one connection
 */
class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  /**
   * Connect to Socket.io server with JWT authentication
   * @param token - JWT token for authentication
   */
  connect(token: string): Socket {
    if (this.socket && this.isConnected) {
      console.log('✅ Socket already connected');
      return this.socket;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(socketUrl, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('✅ Socket.io connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('❌ Socket.io disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket.io connection error:', error.message);
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket.io error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect from Socket.io server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('✅ Socket.io disconnected manually');
    }
  }

  /**
   * Get the current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket !== null;
  }

  // ============================================
  // Project Room Management
  // ============================================

  /**
   * Join a project room to receive updates
   * @param projectId - Project ID to join
   */
  joinProject(projectId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-project', projectId);
      console.log(`📍 Joined project room: ${projectId}`);
    }
  }

  /**
   * Leave a project room
   * @param projectId - Project ID to leave
   */
  leaveProject(projectId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-project', projectId);
      console.log(`📤 Left project room: ${projectId}`);
    }
  }

  // ============================================
  // Event Listeners
  // ============================================

  /**
   * Listen for ticket created events
   * @param callback - Function to call when ticket is created
   */
  onTicketCreated(callback: (ticket: Ticket) => void): void {
    this.socket?.on('ticket-created', callback);
  }

  /**
   * Listen for ticket updated events
   * @param callback - Function to call when ticket is updated
   */
  onTicketUpdated(callback: (ticket: Ticket) => void): void {
    this.socket?.on('ticket-updated', callback);
  }

  /**
   * Listen for ticket moved events (drag-and-drop)
   * @param callback - Function to call when ticket is moved
   */
  onTicketMoved(callback: (ticket: Ticket) => void): void {
    this.socket?.on('ticket-moved', callback);
  }

  /**
   * Listen for ticket deleted events
   * @param callback - Function to call when ticket is deleted
   */
  onTicketDeleted(callback: (ticketId: string) => void): void {
    this.socket?.on('ticket-deleted', callback);
  }

  /**
   * Listen for notification events
   * @param callback - Function to call when notification is received
   */
  onNotification(callback: (activity: Activity) => void): void {
    this.socket?.on('notification', callback);
  }

  // ============================================
  // Event Emitters
  // ============================================

  /**
   * Emit ticket created event to other clients
   * @param projectId - Project ID
   * @param ticket - Created ticket
   */
  emitTicketCreated(projectId: string, ticket: Ticket): void {
    this.socket?.emit('ticket-created', { projectId, ticket });
  }

  /**
   * Emit ticket updated event to other clients
   * @param projectId - Project ID
   * @param ticket - Updated ticket
   */
  emitTicketUpdated(projectId: string, ticket: Ticket): void {
    this.socket?.emit('ticket-updated', { projectId, ticket });
  }

  /**
   * Emit ticket moved event to other clients
   * @param projectId - Project ID
   * @param ticket - Moved ticket
   */
  emitTicketMoved(projectId: string, ticket: Ticket): void {
    this.socket?.emit('ticket-moved', { projectId, ticket });
  }

  /**
   * Emit ticket deleted event to other clients
   * @param projectId - Project ID
   * @param ticketId - Deleted ticket ID
   */
  emitTicketDeleted(projectId: string, ticketId: string): void {
    this.socket?.emit('ticket-deleted', { projectId, ticketId });
  }

  // ============================================
  // Cleanup
  // ============================================

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    this.socket?.off('ticket-created');
    this.socket?.off('ticket-updated');
    this.socket?.off('ticket-moved');
    this.socket?.off('ticket-deleted');
    this.socket?.off('notification');
  }

  /**
   * Remove specific event listener
   * @param event - Event name to remove listener from
   */
  removeListener(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();

