// Type definitions for the entire backend application

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
  order_index: number;
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
  created_at: Date;
}

export interface OTP {
  id: string;
  email: string;
  otp: string;
  expires_at: Date;
  created_at: Date;
}

// Request/Response DTOs
export interface CreateProjectDTO {
  name: string;
  description?: string;
}

export interface CreateTicketDTO {
  project_id: string;
  title: string;
  description?: string;
  priority: TicketPriority;
  type: TicketType;
  assigned_to?: string;
}

export interface UpdateTicketDTO {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigned_to?: string;
}

export interface MoveTicketDTO {
  status: TicketStatus;
  order_index: number;
}

export interface SendOTPDTO {
  email: string;
}

export interface VerifyOTPDTO {
  email: string;
  otp: string;
}

export interface VerifySuperUserDTO {
  password: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
}

// Express Request with authenticated user
export interface AuthRequest extends Express.Request {
  user?: JWTPayload;
}

