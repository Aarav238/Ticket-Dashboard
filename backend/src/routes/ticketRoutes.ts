// Ticket routes
import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  moveTicket,
  deleteTicket,
} from '../controllers/ticketController';
import { authenticate } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validation';
import {
  createTicketSchema,
  updateTicketSchema,
  moveTicketSchema,
} from '../utils/validators';

const router = Router();

// All ticket routes require authentication
router.use(authenticate);

/**
 * @route POST /api/tickets
 * @desc Create a new ticket
 * @access Private
 */
router.post('/', validateBody(createTicketSchema), createTicket);

/**
 * @route GET /api/tickets/project/:projectId
 * @desc Get all tickets for a project
 * @access Private
 */
router.get('/project/:projectId', getTickets);

/**
 * @route GET /api/tickets/:id
 * @desc Get a single ticket by ID
 * @access Private
 */
router.get('/:id', getTicket);

/**
 * @route PUT /api/tickets/:id
 * @desc Update a ticket
 * @access Private
 */
router.put('/:id', validateBody(updateTicketSchema), updateTicket);

/**
 * @route PATCH /api/tickets/:id/move
 * @desc Move ticket to different status (drag-and-drop)
 * @access Private
 */
router.patch('/:id/move', validateBody(moveTicketSchema), moveTicket);

/**
 * @route DELETE /api/tickets/:id
 * @desc Delete a ticket
 * @access Private
 */
router.delete('/:id', deleteTicket);

export default router;

