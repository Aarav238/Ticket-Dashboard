// Database query functions for all entities
import pool from '../config/database';
import { User, Project, Ticket, TicketStatus } from '../types';

// ============ USER QUERIES ============

/**
 * Finds user by email address
 * @param email - User email
 * @returns Promise<User | null>
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

/**
 * Creates a new user
 * @param email - User email
 * @param name - Optional user name
 * @returns Promise<User>
 */
export const createUser = async (email: string, name?: string): Promise<User> => {
  const query = `
    INSERT INTO users (email, name)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await pool.query(query, [email, name]);
  return result.rows[0];
};

/**
 * Finds user by ID
 * @param userId - User ID
 * @returns Promise<User | null>
 */
export const findUserById = async (userId: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

/**
 * Gets all users in the system
 * @returns Promise<User[]>
 */
export const getAllUsers = async (): Promise<User[]> => {
  const query = 'SELECT * FROM users ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

/**
 * Updates user's last_seen timestamp to current time
 * @param userId - User ID
 * @returns Promise<void>
 */
export const updateUserLastSeen = async (userId: string): Promise<void> => {
  const query = `
    UPDATE users
    SET last_seen = CURRENT_TIMESTAMP
    WHERE id = $1
  `;
  await pool.query(query, [userId]);
};

/**
 * Sets user's online status
 * @param userId - User ID
 * @param isOnline - Online status (true/false)
 * @returns Promise<void>
 */
export const setUserOnlineStatus = async (
  userId: string,
  isOnline: boolean
): Promise<void> => {
  const query = `
    UPDATE users
    SET is_online = $1, last_seen = CURRENT_TIMESTAMP
    WHERE id = $2
  `;
  await pool.query(query, [isOnline, userId]);
};

/**
 * Checks if a user is considered offline
 * User is offline if:
 * - is_online flag is FALSE, OR
 * - last_seen timestamp is older than 2 minutes
 * @param userId - User ID
 * @returns Promise<boolean> - true if user is offline
 */
export const isUserOffline = async (userId: string): Promise<boolean> => {
  const query = `
    SELECT 
      is_online,
      last_seen,
      (EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - last_seen)) > 120) as is_stale
    FROM users
    WHERE id = $1
  `;
  const result = await pool.query(query, [userId]);
  
  if (!result.rows[0]) {
    return true; // User not found, consider offline
  }
  
  const { is_online, is_stale } = result.rows[0];
  
  // User is offline if explicitly marked offline OR last_seen is older than 2 minutes
  return !is_online || is_stale;
};

/**
 * Gets all users except the specified user
 * Used for sending notifications to other users
 * @param excludeUserId - User ID to exclude
 * @returns Promise<User[]>
 */
export const getAllUsersExcept = async (excludeUserId: string): Promise<User[]> => {
  const query = `
    SELECT * FROM users
    WHERE id != $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [excludeUserId]);
  return result.rows;
};

// ============ PROJECT QUERIES ============

/**
 * Creates a new project
 * @param name - Project name
 * @param createdBy - User ID who created the project
 * @param description - Optional project description
 * @returns Promise<Project>
 */
export const createProject = async (
  name: string,
  createdBy: string,
  description?: string
): Promise<Project> => {
  const query = `
    INSERT INTO projects (name, description, created_by)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [name, description, createdBy]);
  return result.rows[0];
};

/**
 * Gets all projects
 * @returns Promise<Project[]>
 */
export const getAllProjects = async (): Promise<Project[]> => {
  const query = `
    SELECT p.*, u.email as creator_email, u.name as creator_name
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.id
    ORDER BY p.updated_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

/**
 * Gets project by ID
 * @param projectId - Project ID
 * @returns Promise<Project | null>
 */
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  const query = `
    SELECT p.*, u.email as creator_email, u.name as creator_name
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.id = $1
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows[0] || null;
};

/**
 * Updates a project
 * @param projectId - Project ID
 * @param name - New project name
 * @param description - New project description
 * @returns Promise<Project | null>
 */
export const updateProject = async (
  projectId: string,
  name?: string,
  description?: string
): Promise<Project | null> => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    values.push(name);
  }
  if (description !== undefined) {
    updates.push(`description = $${paramCount++}`);
    values.push(description);
  }

  if (updates.length === 0) {
    return getProjectById(projectId);
  }

  values.push(projectId);
  const query = `
    UPDATE projects
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

/**
 * Deletes a project
 * @param projectId - Project ID
 * @returns Promise<boolean>
 */
export const deleteProject = async (projectId: string): Promise<boolean> => {
  const query = 'DELETE FROM projects WHERE id = $1';
  const result = await pool.query(query, [projectId]);
  return (result.rowCount || 0) > 0;
};

// ============ TICKET QUERIES ============

/**
 * Creates a new ticket
 * @param ticketData - Ticket data
 * @returns Promise<Ticket>
 */
export const createTicket = async (ticketData: {
  project_id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: string;
  type: string;
  assigned_to?: string;
  created_by: string;
  order_index: number;
}): Promise<Ticket> => {
  const { project_id, title, description, status, priority, type, assigned_to, created_by, order_index } = ticketData;
  
  // Insert ticket and return with user info
  const query = `
    WITH inserted_ticket AS (
      INSERT INTO tickets (project_id, title, description, status, priority, type, assigned_to, created_by, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    )
    SELECT t.*, 
           u_created.email as creator_email, u_created.name as creator_name,
           u_assigned.email as assignee_email, u_assigned.name as assignee_name
    FROM inserted_ticket t
    LEFT JOIN users u_created ON t.created_by = u_created.id
    LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
  `;
  
  const result = await pool.query(query, [
    project_id,
    title,
    description,
    status,
    priority,
    type,
    assigned_to,
    created_by,
    order_index,
  ]);
  return result.rows[0];
};

/**
 * Gets all tickets for a project
 * @param projectId - Project ID
 * @returns Promise<Ticket[]>
 */
export const getProjectTickets = async (projectId: string): Promise<Ticket[]> => {
  const query = `
    SELECT t.*, 
           u_created.email as creator_email, u_created.name as creator_name,
           u_assigned.email as assignee_email, u_assigned.name as assignee_name
    FROM tickets t
    LEFT JOIN users u_created ON t.created_by = u_created.id
    LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
    WHERE t.project_id = $1
    ORDER BY t.status, t.order_index ASC
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows;
};

/**
 * Gets ticket by ID
 * @param ticketId - Ticket ID
 * @returns Promise<Ticket | null>
 */
export const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
  const query = `
    SELECT t.*, 
           u_created.email as creator_email, u_created.name as creator_name,
           u_assigned.email as assignee_email, u_assigned.name as assignee_name
    FROM tickets t
    LEFT JOIN users u_created ON t.created_by = u_created.id
    LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
    WHERE t.id = $1
  `;
  const result = await pool.query(query, [ticketId]);
  return result.rows[0] || null;
};

/**
 * Updates a ticket
 * @param ticketId - Ticket ID
 * @param updates - Fields to update
 * @returns Promise<Ticket | null>
 */
export const updateTicket = async (
  ticketId: string,
  updates: Partial<Ticket>
): Promise<Ticket | null> => {
  const updateFields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      updateFields.push(`${key} = $${paramCount++}`);
      values.push(value);
    }
  });

  if (updateFields.length === 0) {
    return getTicketById(ticketId);
  }

  values.push(ticketId);
  
  // Update ticket and return with user info
  const query = `
    WITH updated_ticket AS (
      UPDATE tickets
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    )
    SELECT t.*, 
           u_created.email as creator_email, u_created.name as creator_name,
           u_assigned.email as assignee_email, u_assigned.name as assignee_name
    FROM updated_ticket t
    LEFT JOIN users u_created ON t.created_by = u_created.id
    LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

/**
 * Gets the maximum order index for tickets in a specific status column
 * @param projectId - Project ID
 * @param status - Ticket status
 * @returns Promise<number>
 */
export const getMaxOrderIndex = async (projectId: string, status: TicketStatus): Promise<number> => {
  const query = `
    SELECT COALESCE(MAX(order_index), 0) as max_order
    FROM tickets
    WHERE project_id = $1 AND status = $2
  `;
  const result = await pool.query(query, [projectId, status]);
  return result.rows[0].max_order;
};

/**
 * Deletes a ticket
 * @param ticketId - Ticket ID
 * @returns Promise<boolean>
 */
export const deleteTicket = async (ticketId: string): Promise<boolean> => {
  const query = 'DELETE FROM tickets WHERE id = $1';
  const result = await pool.query(query, [ticketId]);
  return (result.rowCount || 0) > 0;
};

