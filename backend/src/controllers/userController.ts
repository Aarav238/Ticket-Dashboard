// User controller for user-related operations
import { Request, Response } from 'express';
import { getAllUsers } from '../models/queries';

/**
 * Gets all users in the system
 * Used for assigning tickets to users
 * @route GET /api/users
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

