// Middleware to update user's last_seen timestamp on each request
import { Request, Response, NextFunction } from 'express';
import { updateUserLastSeen } from '../models/queries';

/**
 * Updates user's last_seen timestamp for authenticated requests
 * This helps track user activity and determine if they're offline
 * @middleware
 */
export const updateLastSeenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Only update if user is authenticated (has req.user from authMiddleware)
    if (req.user && req.user.userId) {
      // Update last_seen timestamp (don't await to avoid blocking request)
      updateUserLastSeen(req.user.userId).catch((error) => {
        console.error('Error updating last_seen:', error);
        // Don't block request even if update fails
      });
    }
    
    next();
  } catch (error) {
    // Don't block request if middleware fails
    console.error('Error in updateLastSeenMiddleware:', error);
    next();
  }
};

