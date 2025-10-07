// Axios API client for making HTTP requests to the backend
import axios from 'axios';
import type {
  APIResponse,
  User,
  Project,
  Ticket,
  SendOTPForm,
  VerifyOTPForm,
  CreateProjectForm,
  CreateTicketForm,
  UpdateTicketForm,
  MoveTicketForm,
  VerifySuperUserForm,
} from '@/types';

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add auth token to requests
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// Authentication API
// ============================================

/**
 * Send OTP to email for authentication
 */
export const sendOTP = async (data: SendOTPForm) => {
  const response = await api.post<APIResponse<void>>('/api/auth/send-otp', data);
  return response.data;
};

/**
 * Verify OTP and login
 */
export const verifyOTP = async (data: VerifyOTPForm) => {
  const response = await api.post<APIResponse<{ token: string; user: User }>>('/api/auth/verify-otp', data);
  return response.data;
};

/**
 * Verify super-user password
 */
export const verifySuperUser = async (data: VerifySuperUserForm) => {
  const response = await api.post<APIResponse<{ isSuperUser: boolean }>>('/api/auth/verify-super-user', data);
  return response.data;
};

/**
 * Get current logged-in user
 */
export const getCurrentUser = async () => {
  const response = await api.get<APIResponse<User>>('/api/auth/me');
  return response.data;
};

// ============================================
// Projects API
// ============================================

/**
 * Get all projects
 */
export const getProjects = async () => {
  const response = await api.get<APIResponse<Project[]>>('/api/projects');
  return response.data;
};

/**
 * Get single project by ID
 */
export const getProject = async (id: string) => {
  const response = await api.get<APIResponse<Project>>(`/api/projects/${id}`);
  return response.data;
};

/**
 * Create new project
 */
export const createProject = async (data: CreateProjectForm) => {
  const response = await api.post<APIResponse<Project>>('/api/projects', data);
  return response.data;
};

/**
 * Update project
 */
export const updateProject = async (id: string, data: Partial<CreateProjectForm>) => {
  const response = await api.put<APIResponse<Project>>(`/api/projects/${id}`, data);
  return response.data;
};

/**
 * Delete project
 */
export const deleteProject = async (id: string) => {
  const response = await api.delete<APIResponse<void>>(`/api/projects/${id}`);
  return response.data;
};

// ============================================
// Tickets API
// ============================================

/**
 * Get all tickets for a project
 */
export const getProjectTickets = async (projectId: string) => {
  const response = await api.get<APIResponse<Ticket[]>>(`/api/tickets/project/${projectId}`);
  return response.data;
};

/**
 * Get single ticket by ID
 */
export const getTicket = async (id: string) => {
  const response = await api.get<APIResponse<Ticket>>(`/api/tickets/${id}`);
  return response.data;
};

/**
 * Create new ticket
 */
export const createTicket = async (data: CreateTicketForm) => {
  const response = await api.post<APIResponse<Ticket>>('/api/tickets', data);
  return response.data;
};

/**
 * Update ticket
 */
export const updateTicket = async (id: string, data: UpdateTicketForm) => {
  const response = await api.put<APIResponse<Ticket>>(`/api/tickets/${id}`, data);
  return response.data;
};

/**
 * Move ticket (drag-and-drop)
 */
export const moveTicket = async (id: string, data: MoveTicketForm) => {
  const response = await api.patch<APIResponse<Ticket>>(`/api/tickets/${id}/move`, data);
  return response.data;
};

/**
 * Delete ticket
 */
export const deleteTicket = async (id: string) => {
  const response = await api.delete<APIResponse<void>>(`/api/tickets/${id}`);
  return response.data;
};

// ============================================
// Users API
// ============================================

/**
 * Get all users
 */
export const getUsers = async () => {
  const response = await api.get<APIResponse<User[]>>('/api/users');
  return response.data;
};

export default api;

