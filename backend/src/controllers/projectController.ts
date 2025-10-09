// Project controller for CRUD operations
import { Request, Response } from 'express';
import {
  createProject as createProjectQuery,
  getAllProjects,
  getProjectById,
  updateProject as updateProjectQuery,
  deleteProject as deleteProjectQuery,
} from '../models/queries';
import { createActivity } from '../services/activityService';
import { ActivityType, CreateProjectDTO } from '../types';
import { MESSAGES } from '../config/constants';

/**
 * Creates a new project
 * @route POST /api/projects
 */
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description }: CreateProjectDTO = req.body;
    const userId = req.user!.userId;

    // Create project
    const project = await createProjectQuery(name, userId, description);

    // Log activity
    await createActivity(
      project.id,
      userId,
      ActivityType.PROJECT_CREATED,
      `Project "${name}" created`
    );

    // Emit Socket.io event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('project-created', project);
      
      // Send notification to all OTHER users (not the creator)
      const sockets = await io.fetchSockets();
      for (const socket of sockets) {
        // Skip the user who created the project
        if (socket.data.user?.userId !== userId) {
          socket.emit('notification', {
            id: `notif-${Date.now()}-${socket.id}`,
            type: 'PROJECT_CREATED',
            description: `Project created: ${name}`,
            created_at: new Date().toISOString(),
            read: false,
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: MESSAGES.PROJECT_CREATED,
      data: project,
    });
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
    });
  }
};

/**
 * Gets all projects
 * @route GET /api/projects
 */
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await getAllProjects();

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
};

/**
 * Gets a single project by ID
 * @route GET /api/projects/:id
 */
export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await getProjectById(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: MESSAGES.PROJECT_NOT_FOUND,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error in getProject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
    });
  }
};

/**
 * Updates a project
 * @route PUT /api/projects/:id
 */
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await updateProjectQuery(id, name, description);

    if (!project) {
      res.status(404).json({
        success: false,
        message: MESSAGES.PROJECT_NOT_FOUND,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
    });
  }
};

/**
 * Deletes a project
 * @route DELETE /api/projects/:id
 */
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await deleteProjectQuery(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: MESSAGES.PROJECT_NOT_FOUND,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
    });
  }
};

