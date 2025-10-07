// Authentication controller for OTP-based login and super-user verification
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateOTP, storeOTP, verifyOTP } from '../services/otpService';
import { sendOTPEmail } from '../services/emailService';
import { generateToken } from '../utils/jwt';
import { findUserByEmail, createUser } from '../models/queries';
import { MESSAGES } from '../config/constants';
import { SendOTPDTO, VerifyOTPDTO } from '../types';

/**
 * Sends OTP to user's email for authentication
 * Creates user automatically if email doesn't exist
 * @route POST /api/auth/send-otp
 */
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email }: SendOTPDTO = req.body;

    // Generate 6-digit OTP
    const otp = generateOTP();

    // Store OTP in database with expiry
    await storeOTP(email, otp);

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      res.status(500).json({
        success: false,
        message: MESSAGES.EMAIL_SEND_FAILED,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: MESSAGES.OTP_SENT,
    });
  } catch (error) {
    console.error('Error in sendOTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

/**
 * Verifies OTP and logs in user
 * Creates new user if email doesn't exist (auto-registration)
 * @route POST /api/auth/verify-otp
 */
export const verifyOTPAndLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp }: VerifyOTPDTO = req.body;

    // Verify OTP
    const isValid = await verifyOTP(email, otp);

    if (!isValid) {
      res.status(400).json({
        success: false,
        message: MESSAGES.OTP_INVALID,
      });
      return;
    }

    // Check if user exists
    let user = await findUserByEmail(email);

    // Auto-create user if doesn't exist
    if (!user) {
      user = await createUser(email);
      console.log(`✅ New user created: ${email}`);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: MESSAGES.LOGIN_SUCCESS,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error('Error in verifyOTPAndLogin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
    });
  }
};

/**
 * Verifies super-user password to enable viewing user information
 * @route POST /api/auth/verify-super-user
 */
export const verifySuperUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body;

    const superUserPassword = process.env.SUPER_USER_PASSWORD || 'admin123';

    // In production, you should hash the super-user password too
    // For simplicity, using plain text comparison
    const isValid = password === superUserPassword;

    if (!isValid) {
      res.status(401).json({
        success: false,
        message: MESSAGES.SUPER_USER_INVALID,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Super user verified',
      data: {
        isSuperUser: true,
      },
    });
  } catch (error) {
    console.error('Error in verifySuperUser:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify super user',
    });
  }
};

/**
 * Gets current logged-in user information
 * @route GET /api/auth/me
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    const user = await findUserByEmail(req.user.email);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
    });
  }
};

