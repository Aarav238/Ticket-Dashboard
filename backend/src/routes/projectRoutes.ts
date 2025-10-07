// Project routes
import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { authenticate } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validation';
import { createProjectSchema, updateProjectSchema } from '../utils/validators';

const router = Router();

// All project routes require authentication
router.use(authenticate);

/**
 * @route POST /api/projects
 * @desc Create a new project
 * @access Private
 */
router.post('/', validateBody(createProjectSchema), createProject);

/**
 * @route GET /api/projects
 * @desc Get all projects
 * @access Private
 */
router.get('/', getProjects);

/**
 * @route GET /api/projects/:id
 * @desc Get a single project by ID
 * @access Private
 */
router.get('/:id', getProject);

/**
 * @route PUT /api/projects/:id
 * @desc Update a project
 * @access Private
 */
router.put('/:id', validateBody(updateProjectSchema), updateProject);

/**
 * @route DELETE /api/projects/:id
 * @desc Delete a project
 * @access Private
 */
router.delete('/:id', deleteProject);

export default router;

