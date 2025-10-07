// Validation utilities using Zod schema validation
import { z } from 'zod';
import { TicketStatus, TicketPriority, TicketType } from '../types';

/**
 * Email validation schema
 */
export const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

/**
 * OTP verification schema
 */
export const verifyOTPSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

/**
 * Super user password verification schema
 */
export const superUserSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

/**
 * Create project validation schema
 */
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255, 'Project name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
});

/**
 * Update project validation schema
 */
export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255, 'Project name too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
});

/**
 * Create ticket validation schema
 */
export const createTicketSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  title: z.string().min(1, 'Ticket title is required').max(500, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  priority: z.nativeEnum(TicketPriority),
  type: z.nativeEnum(TicketType),
  assigned_to: z.string().uuid('Invalid user ID').optional(),
});

/**
 * Update ticket validation schema
 */
export const updateTicketSchema = z.object({
  title: z.string().min(1, 'Ticket title is required').max(500, 'Title too long').optional(),
  description: z.string().max(5000, 'Description too long').optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  assigned_to: z.string().uuid('Invalid user ID').nullable().optional(),
});

/**
 * Move ticket validation schema (for drag-and-drop)
 */
export const moveTicketSchema = z.object({
  status: z.nativeEnum(TicketStatus),
  order_index: z.number().int().min(0, 'Order index must be positive'),
});

/**
 * Generic validator function
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with success flag and parsed data or errors
 */
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, errors: [{ message: 'Validation failed' }] };
  }
};

