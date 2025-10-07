// Validation middleware using Zod schemas
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { MESSAGES } from '../config/constants';

/**
 * Creates validation middleware for request body
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: MESSAGES.VALIDATION_ERROR,
        errors: error.errors || [{ message: error.message }],
      });
    }
  };
};

/**
 * Creates validation middleware for query parameters
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: MESSAGES.VALIDATION_ERROR,
        errors: error.errors || [{ message: error.message }],
      });
    }
  };
};

/**
 * Creates validation middleware for route parameters
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated;
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: MESSAGES.VALIDATION_ERROR,
        errors: error.errors || [{ message: error.message }],
      });
    }
  };
};

