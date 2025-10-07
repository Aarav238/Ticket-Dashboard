// Zustand store for tickets state management
import { create } from 'zustand';
import type { Ticket, TicketStatus, CreateTicketForm, UpdateTicketForm } from '@/types';
import * as api from '@/lib/api';

interface TicketState {
  // State
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setTickets: (tickets: Ticket[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // API Actions
  fetchProjectTickets: (projectId: string) => Promise<void>;
  createTicket: (data: CreateTicketForm) => Promise<Ticket | null>;
  updateTicket: (id: string, data: UpdateTicketForm) => Promise<void>;
  moveTicket: (id: string, status: TicketStatus, order_index: number) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;

  // Helpers
  addTicket: (ticket: Ticket) => void;
  updateTicketInList: (ticket: Ticket) => void;
  removeTicket: (id: string) => void;
  getTicketsByStatus: (status: TicketStatus) => Ticket[];
  clearError: () => void;
}

/**
 * Tickets store for managing ticket state with drag-and-drop support
 */
export const useTicketStore = create<TicketState>((set, get) => ({
  // Initial state
  tickets: [],
  isLoading: false,
  error: null,

  /**
   * Set tickets list
   */
  setTickets: (tickets: Ticket[]) => {
    set({ tickets });
  },

  /**
   * Set loading state
   */
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  /**
   * Set error message
   */
  setError: (error: string | null) => {
    set({ error });
  },

  /**
   * Fetch all tickets for a project
   */
  fetchProjectTickets: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getProjectTickets(projectId);
      if (response.success && response.data) {
        // Sort tickets by order_index within each status
        const sortedTickets = response.data.sort((a, b) => a.order_index - b.order_index);
        set({ tickets: sortedTickets, isLoading: false });
      } else {
        set({ error: response.message || 'Failed to fetch tickets', isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch tickets',
        isLoading: false,
      });
    }
  },

  /**
   * Create new ticket
   */
  createTicket: async (data: CreateTicketForm) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createTicket(data);
      if (response.success && response.data) {
        const newTicket = response.data;
        set((state) => ({
          tickets: [...state.tickets, newTicket],
          isLoading: false,
        }));
        return newTicket;
      } else {
        set({ error: response.message || 'Failed to create ticket', isLoading: false });
        return null;
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create ticket',
        isLoading: false,
      });
      return null;
    }
  },

  /**
   * Update existing ticket
   */
  updateTicket: async (id: string, data: UpdateTicketForm) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.updateTicket(id, data);
      if (response.success && response.data) {
        const updatedTicket = response.data;
        set((state) => ({
          tickets: state.tickets.map((t) => (t.id === id ? updatedTicket : t)),
          isLoading: false,
        }));
      } else {
        set({ error: response.message || 'Failed to update ticket', isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update ticket',
        isLoading: false,
      });
    }
  },

  /**
   * Move ticket (drag-and-drop)
   */
  moveTicket: async (id: string, status: TicketStatus, order_index: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.moveTicket(id, { status, order_index });
      if (response.success && response.data) {
        const movedTicket = response.data;
        set((state) => ({
          tickets: state.tickets.map((t) => (t.id === id ? movedTicket : t)),
          isLoading: false,
        }));
      } else {
        set({ error: response.message || 'Failed to move ticket', isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to move ticket',
        isLoading: false,
      });
    }
  },

  /**
   * Delete ticket
   */
  deleteTicket: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.deleteTicket(id);
      if (response.success) {
        set((state) => ({
          tickets: state.tickets.filter((t) => t.id !== id),
          isLoading: false,
        }));
      } else {
        set({ error: response.message || 'Failed to delete ticket', isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete ticket',
        isLoading: false,
      });
    }
  },

  /**
   * Add ticket to list (helper for optimistic updates)
   */
  addTicket: (ticket: Ticket) => {
    set((state) => ({
      tickets: [...state.tickets, ticket],
    }));
  },

  /**
   * Update ticket in list (helper for real-time updates)
   */
  updateTicketInList: (ticket: Ticket) => {
    set((state) => ({
      tickets: state.tickets.map((t) => (t.id === ticket.id ? ticket : t)),
    }));
  },

  /**
   * Remove ticket from list (helper for real-time updates)
   */
  removeTicket: (id: string) => {
    set((state) => ({
      tickets: state.tickets.filter((t) => t.id !== id),
    }));
  },

  /**
   * Get tickets filtered by status
   */
  getTicketsByStatus: (status: TicketStatus) => {
    return get().tickets.filter((t) => t.status === status)
      .sort((a, b) => a.order_index - b.order_index);
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}));

