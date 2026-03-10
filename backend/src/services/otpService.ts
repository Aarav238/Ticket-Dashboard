// OTP service for generating, storing, and verifying OTPs
import { OTPModel } from '../models/OTPModel';
import { CONFIG } from '../config/constants';

/**
 * Generates a random 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Stores OTP in database with expiry time
 */
export const storeOTP = async (email: string, otp: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + CONFIG.OTP_EXPIRY_MINUTES * 60 * 1000);
  await OTPModel.create({ email: email.toLowerCase().trim(), otp, expires_at: expiresAt });
};

/**
 * Verifies if provided OTP is valid for given email
 * Deletes the OTP after successful verification
 */
export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const record = await OTPModel.findOne({
    email: email.toLowerCase().trim(),
    otp,
    expires_at: { $gt: new Date() },
  }).sort({ created_at: -1 });

  if (!record) return false;

  await OTPModel.findByIdAndDelete(record._id);
  return true;
};

/**
 * Cleans up expired OTPs from database
 * (MongoDB TTL index handles this automatically, but provided for manual use)
 */
export const cleanupExpiredOTPs = async (): Promise<number> => {
  const result = await OTPModel.deleteMany({ expires_at: { $lt: new Date() } });
  return result.deletedCount || 0;
};
