// OTP service for generating, storing, and verifying OTPs
import pool from '../config/database';
import { CONFIG } from '../config/constants';

/**
 * Generates a random 6-digit OTP
 * @returns 6-digit OTP string
 */
export const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

/**
 * Stores OTP in database with expiry time
 * @param email - User email address
 * @param otp - Generated OTP
 * @returns Promise<void>
 */
export const storeOTP = async (email: string, otp: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + CONFIG.OTP_EXPIRY_MINUTES * 60 * 1000);
  
  const query = `
    INSERT INTO otps (email, otp, expires_at)
    VALUES ($1, $2, $3)
  `;
  
  await pool.query(query, [email, otp, expiresAt]);
};

/**
 * Verifies if provided OTP is valid for given email
 * @param email - User email address
 * @param otp - OTP to verify
 * @returns Promise<boolean> - true if OTP is valid and not expired
 */
export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const query = `
    SELECT * FROM otps
    WHERE email = $1 AND otp = $2 AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `;
  
  const result = await pool.query(query, [email, otp]);
  
  if (result.rows.length === 0) {
    return false;
  }
  
  // Delete used OTP
  await pool.query('DELETE FROM otps WHERE id = $1', [result.rows[0].id]);
  
  return true;
};

/**
 * Cleans up expired OTPs from database
 * Should be called periodically
 * @returns Promise<number> - Number of deleted OTPs
 */
export const cleanupExpiredOTPs = async (): Promise<number> => {
  const result = await pool.query('DELETE FROM otps WHERE expires_at < NOW()');
  return result.rowCount || 0;
};

