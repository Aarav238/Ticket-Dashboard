// Ticket controller for CRUD operations and drag-and-drop
import { Request, Response } from 'express';
import {
  createTicket as createTicketQuery,
  getProjectTickets,
  getTicketById,
  updateTicket as updateTicketQuery,
  deleteTicket as deleteTicketQuery,
  getMaxOrderIndex,
} from '../models/queries';
import { createActivity } from '../services/activityService';
import { notifyAllUsers } from '../services/notificationService';
import { TicketFactory } from '../patterns/TicketFactory';
import {
  ActivityType,
  CreateTicketDTO,
  UpdateTicketDTO,
  MoveTicketDTO,
  TicketStatus,
} from '../types';
import { MESSAGES, CONFIG } from '../config/constants';

/**
 * Creates a new ticket using Factory Pattern
 * @route POST /api/tickets
 */
export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticketData: CreateTicketDTO = req.body;
    const userId = req.user!.userId;

    // Use Factory Pattern to create ticket with type-specific defaults
    const processedTicketData = TicketFactory.createTicket(ticketData.type, ticketData);

    // Get max order index for TODO status
    const maxOrder = await getMaxOrderIndex(
      processedTicketData.project_id,
      TicketStatus.TODO
    );

    // Create ticket
    const ticket = await createTicketQuery({
      ...processedTicketData,
      status: TicketStatus.TODO,
      created_by: userId,
      order_index: maxOrder + CONFIG.DEFAULT_TICKET_ORDER_INCREMENT,
    });

    // Log activity
    await createActivity(
      ticket.project_id,
      userId,
      ActivityType.TICKET_CREATED,
      `Ticket "${ticket.title}" created`,
      ticket.id
    );

    // Emit Socket.io events for real-time updates
    const io = req.app.get('io');
    if (io) {
      // Emit to project room for real-time board updates
      io.to(`project:${ticket.project_id}`).emit('ticket-created', ticket);
      
      // Send notifications to all users (Socket.io for online, Email for offline)
      await notifyAllUsers(io, userId, {
        type: 'TICKET_CREATED',
        title: 'New Ticket Created',
        description: `Ticket created: ${ticket.title}`,
        project_id: ticket.project_id,
        ticket_id: ticket.id,
      });
    }

    res.status(201).json({
      success: true,
      message: MESSAGES.TICKET_CREATED,
      data: ticket,
    });
  } catch (error) {
    console.error('Error in createTicket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create ticket',
    });
  }
};

/**
 * Gets all tickets for a project
 * @route GET /api/tickets/project/:projectId
 */
export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    const tickets = await getProjectTickets(projectId);

    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error('Error in getTickets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
    });
  }
};

/**
 * Gets a single ticket by ID
 * @route GET /api/tickets/:id
 */
export const getTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ticket = await getTicketById(id);

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: MESSAGES.TICKET_NOT_FOUND,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Error in getTicket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
    });
  }
};

/**
 * Updates a ticket
 * @route PUT /api/tickets/:id
 */
export const updateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: UpdateTicketDTO = req.body;
    const userId = req.user!.userId;

    const ticket = await updateTicketQuery(id, updates);

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: MESSAGES.TICKET_NOT_FOUND,
      });
      return;
    }

    // Log activity
    await createActivity(
      ticket.project_id,
      userId,
      ActivityType.TICKET_UPDATED,
      `Ticket "${ticket.title}" updated`,
      ticket.id
    );

    // Emit Socket.io events for real-time updates
    const io = req.app.get('io');
    if (io) {
      // Emit to project room for real-time board updates
      io.to(`project:${ticket.project_id}`).emit('ticket-updated', ticket);
      
      // Send notifications to all users (Socket.io for online, Email for offline)
      await notifyAllUsers(io, userId, {
        type: 'TICKET_UPDATED',
        title: 'Ticket Updated',
        description: `Ticket updated: ${ticket.title}`,
        project_id: ticket.project_id,
        ticket_id: ticket.id,
      });
    }

    res.status(200).json({
      success: true,
      message: MESSAGES.TICKET_UPDATED,
      data: ticket,
    });
  } catch (error) {
    console.error('Error in updateTicket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket',
    });
  }
};

/**
 * Moves a ticket to different status column (for drag-and-drop)
 * Updates both status and order_index for proper positioning
 * @route PATCH /api/tickets/:id/move
 */
export const moveTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, order_index }: MoveTicketDTO = req.body;
    const userId = req.user!.userId;

    // Get current ticket
    const currentTicket = await getTicketById(id);
    if (!currentTicket) {
      res.status(404).json({
        success: false,
        message: MESSAGES.TICKET_NOT_FOUND,
      });
      return;
    }

    // Update ticket status and order
    const ticket = await updateTicketQuery(id, {
      status,
      order_index,
    });

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: MESSAGES.TICKET_NOT_FOUND,
      });
      return;
    }

    // Log activity
    const activityDescription = currentTicket.status === status
      ? `Ticket "${ticket.title}" reordered`
      : `Ticket "${ticket.title}" moved from ${currentTicket.status} to ${status}`;

    await createActivity(
      ticket.project_id,
      userId,
      ActivityType.TICKET_MOVED,
      activityDescription,
      ticket.id
    );

    // Emit Socket.io events for real-time updates
    const io = req.app.get('io');
    if (io) {
      // Emit to project room for real-time board updates
      io.to(`project:${ticket.project_id}`).emit('ticket-moved', ticket);
      
      // Send notifications to all users (Socket.io for online, Email for offline)
      await notifyAllUsers(io, userId, {
        type: 'TICKET_MOVED',
        title: 'Ticket Moved',
        description: activityDescription,
        project_id: ticket.project_id,
        ticket_id: ticket.id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket moved successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Error in moveTicket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to move ticket',
    });
  }
};

/**
 * Deletes a ticket
 * @route DELETE /api/tickets/:id
 */
export const deleteTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Get ticket before deletion for notification
    const ticket = await getTicketById(id);
    
    if (!ticket) {
      res.status(404).json({
        success: false,
        message: MESSAGES.TICKET_NOT_FOUND,
      });
      return;
    }

    const deleted = await deleteTicketQuery(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: MESSAGES.TICKET_NOT_FOUND,
      });
      return;
    }

    // Log activity
    await createActivity(
      ticket.project_id,
      userId,
      ActivityType.TICKET_DELETED,
      `Ticket "${ticket.title}" deleted`,
      ticket.id
    );

    // Emit Socket.io events for real-time updates
    const io = req.app.get('io');
    if (io) {
      // Emit to project room for real-time board updates
      io.to(`project:${ticket.project_id}`).emit('ticket-deleted', { id: ticket.id });
      
      // Send notifications to all users (Socket.io for online, Email for offline)
      await notifyAllUsers(io, userId, {
        type: 'TICKET_DELETED',
        title: 'Ticket Deleted',
        description: `Ticket deleted: ${ticket.title}`,
        project_id: ticket.project_id,
        ticket_id: ticket.id,
      });
    }

    res.status(200).json({
      success: true,
      message: MESSAGES.TICKET_DELETED,
    });
  } catch (error) {
    console.error('Error in deleteTicket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete ticket',
    });
  }
};

