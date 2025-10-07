// TypeScript type definitions for the frontend application

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator_email?: string;
  creator_name?: string;
}

export enum TicketStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TicketType {
  BUG = 'BUG',
  FEATURE = 'FEATURE',
  TASK = 'TASK',
  IMPROVEMENT = 'IMPROVEMENT'
}

export interface Ticket {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  order_index: number;
  creator_email?: string;
  creator_name?: string;
  assignee_email?: string;
  assignee_name?: string;
}

export enum ActivityType {
  TICKET_CREATED = 'TICKET_CREATED',
  TICKET_UPDATED = 'TICKET_UPDATED',
  TICKET_MOVED = 'TICKET_MOVED',
  TICKET_ASSIGNED = 'TICKET_ASSIGNED',
  PROJECT_CREATED = 'PROJECT_CREATED'
}

export interface Activity {
  id: string;
  project_id: string;
  ticket_id?: string;
  user_id: string;
  type: ActivityType;
  description: string;
  created_at: string;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ message: string }>;
}

// Form types
export interface SendOTPForm {
  email: string;
}

export interface VerifyOTPForm {
  email: string;
  otp: string;
}

export interface CreateProjectForm {
  name: string;
  description?: string;
}

export interface CreateTicketForm {
  project_id: string;
  title: string;
  description?: string;
  priority: TicketPriority;
  type: TicketType;
  assigned_to?: string;
}

export interface UpdateTicketForm {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigned_to?: string | null;
}

export interface MoveTicketForm {
  status: TicketStatus;
  order_index: number;
}

export interface VerifySuperUserForm {
  password: string;
}

