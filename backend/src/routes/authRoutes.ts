// Authentication routes
import { Router } from 'express';
import {
  sendOTP,
  verifyOTPAndLogin,
  verifySuperUser,
  getCurrentUser,
} from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validation';
import {
  emailSchema,
  verifyOTPSchema,
  superUserSchema,
} from '../utils/validators';

const router = Router();

/**
 * @route POST /api/auth/send-otp
 * @desc Send OTP to email for authentication
 * @access Public
 */
router.post('/send-otp', validateBody(emailSchema), sendOTP);

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify OTP and login user
 * @access Public
 */
router.post('/verify-otp', validateBody(verifyOTPSchema), verifyOTPAndLogin);

/**
 * @route POST /api/auth/verify-super-user
 * @desc Verify super-user password
 * @access Private
 */
router.post('/verify-super-user', authenticate, validateBody(superUserSchema), verifySuperUser);

/**
 * @route GET /api/auth/me
 * @desc Get current logged-in user
 * @access Private
 */
router.get('/me', authenticate, getCurrentUser);

export default router;

