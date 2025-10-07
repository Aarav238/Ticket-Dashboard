// Factory Pattern for creating different types of tickets
// Provides a centralized way to create tickets with type-specific defaults
import { CreateTicketDTO, TicketType, TicketPriority } from '../types';

/**
 * Ticket Factory using Factory Pattern
 * Creates tickets with appropriate defaults based on ticket type
 */
export class TicketFactory {
  /**
   * Creates a ticket with type-specific configuration
   * @param type - Type of ticket (BUG, FEATURE, TASK, IMPROVEMENT)
   * @param data - Base ticket data
   * @returns Complete ticket data with type-specific defaults
   */
  static createTicket(type: TicketType, data: Omit<CreateTicketDTO, 'type'>): CreateTicketDTO {
    switch (type) {
      case TicketType.BUG:
        // Bugs default to HIGH priority
        return {
          ...data,
          type: TicketType.BUG,
          priority: data.priority || TicketPriority.HIGH,
        };

      case TicketType.FEATURE:
        // Features default to MEDIUM priority
        return {
          ...data,
          type: TicketType.FEATURE,
          priority: data.priority || TicketPriority.MEDIUM,
        };

      case TicketType.IMPROVEMENT:
        // Improvements default to LOW priority
        return {
          ...data,
          type: TicketType.IMPROVEMENT,
          priority: data.priority || TicketPriority.LOW,
        };

      case TicketType.TASK:
      default:
        // Tasks default to MEDIUM priority
        return {
          ...data,
          type: TicketType.TASK,
          priority: data.priority || TicketPriority.MEDIUM,
        };
    }
  }

  /**
   * Determines if a ticket type requires immediate attention
   * @param type - Ticket type
   * @returns boolean indicating urgency
   */
  static isUrgent(type: TicketType): boolean {
    return type === TicketType.BUG;
  }

  /**
   * Gets recommended assignee strategy based on ticket type
   * @param type - Ticket type
   * @returns String describing assignment strategy
   */
  static getAssignmentStrategy(type: TicketType): string {
    switch (type) {
      case TicketType.BUG:
        return 'Assign to QA team or senior developer';
      case TicketType.FEATURE:
        return 'Assign to product team lead';
      case TicketType.IMPROVEMENT:
        return 'Can be assigned to any available developer';
      case TicketType.TASK:
      default:
        return 'Assign based on workload and expertise';
    }
  }
}

