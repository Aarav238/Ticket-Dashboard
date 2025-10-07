// Application-wide constants and configuration values

export const CONFIG = {
  // OTP Configuration
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  
  // JWT Configuration
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Ticket Configuration
  DEFAULT_TICKET_ORDER_INCREMENT: 1000,
} as const;

export const MESSAGES = {
  // Success messages
  OTP_SENT: 'OTP sent successfully to your email',
  LOGIN_SUCCESS: 'Login successful',
  PROJECT_CREATED: 'Project created successfully',
  TICKET_CREATED: 'Ticket created successfully',
  TICKET_UPDATED: 'Ticket updated successfully',
  TICKET_DELETED: 'Ticket deleted successfully',
  
  // Error messages
  OTP_EXPIRED: 'OTP has expired. Please request a new one',
  OTP_INVALID: 'Invalid OTP',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid or expired token',
  PROJECT_NOT_FOUND: 'Project not found',
  TICKET_NOT_FOUND: 'Ticket not found',
  SUPER_USER_INVALID: 'Invalid super user password',
  EMAIL_SEND_FAILED: 'Failed to send email. Please try again',
  
  // Validation errors
  VALIDATION_ERROR: 'Validation error',
  EMAIL_REQUIRED: 'Email is required',
  OTP_REQUIRED: 'OTP is required',
} as const;

