// User routes
import { Router } from 'express';
import { getUsers } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private
 */
router.get('/', getUsers);

export default router;

