// Authentication middleware for protecting routes
import { Request, Response, NextFunction } from 'express';
import { verifyTokenSafe, extractTokenFromHeader } from '../utils/jwt';
import { MESSAGES } from '../config/constants';
import { JWTPayload } from '../types';

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to authenticate user using JWT token
 * Verifies token from Authorization header and attaches user to request
 * @param req - Express request
 * @param res - Express response
 * @param next - Next middleware function
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        message: MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    // Verify token (returns null if invalid)
    const decoded = verifyTokenSafe(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: MESSAGES.INVALID_TOKEN,
      });
      return;
    }

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: MESSAGES.UNAUTHORIZED,
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user to request if token is valid, but doesn't block request if invalid
 * @param req - Express request
 * @param res - Express response
 * @param next - Next middleware function
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyTokenSafe(token);
      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Continue even if token is invalid
    next();
  }
};

