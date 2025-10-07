// Activity service for logging and retrieving project/ticket activities
import pool from '../config/database';
import { Activity, ActivityType } from '../types';

/**
 * Creates a new activity log entry
 * Used for tracking all changes to tickets and projects
 * @param projectId - Project ID
 * @param userId - User who performed the action
 * @param type - Type of activity
 * @param description - Human-readable description
 * @param ticketId - Optional ticket ID if activity is ticket-related
 * @returns Promise<Activity> - Created activity
 */
export const createActivity = async (
  projectId: string,
  userId: string,
  type: ActivityType,
  description: string,
  ticketId?: string
): Promise<Activity> => {
  const query = `
    INSERT INTO activities (project_id, user_id, type, description, ticket_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const result = await pool.query(query, [projectId, userId, type, description, ticketId]);
  return result.rows[0];
};

/**
 * Retrieves activities for a specific project
 * @param projectId - Project ID
 * @param limit - Maximum number of activities to return
 * @returns Promise<Activity[]> - List of activities
 */
export const getProjectActivities = async (
  projectId: string,
  limit: number = 50
): Promise<Activity[]> => {
  const query = `
    SELECT a.*, u.email as user_email, u.name as user_name
    FROM activities a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.project_id = $1
    ORDER BY a.created_at DESC
    LIMIT $2
  `;

  const result = await pool.query(query, [projectId, limit]);
  return result.rows;
};

/**
 * Retrieves all activities for a user across all projects
 * @param userId - User ID
 * @param limit - Maximum number of activities to return
 * @returns Promise<Activity[]> - List of activities
 */
export const getUserActivities = async (
  userId: string,
  limit: number = 50
): Promise<Activity[]> => {
  const query = `
    SELECT a.*, p.name as project_name
    FROM activities a
    LEFT JOIN projects p ON a.project_id = p.id
    WHERE a.user_id = $1
    ORDER BY a.created_at DESC
    LIMIT $2
  `;

  const result = await pool.query(query, [userId, limit]);
  return result.rows;
};

/**
 * Retrieves activities for a specific ticket
 * @param ticketId - Ticket ID
 * @returns Promise<Activity[]> - List of activities
 */
export const getTicketActivities = async (ticketId: string): Promise<Activity[]> => {
  const query = `
    SELECT a.*, u.email as user_email, u.name as user_name
    FROM activities a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.ticket_id = $1
    ORDER BY a.created_at DESC
  `;

  const result = await pool.query(query, [ticketId]);
  return result.rows;
};

