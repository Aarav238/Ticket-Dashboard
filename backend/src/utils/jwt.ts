// JWT utility functions for token generation and verification
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as string;

/**
 * Generates a JWT token for authenticated user
 * @param payload - User data to encode in token (userId, email)
 * @returns JWT token string
 */
export const generateToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any, // Type assertion needed due to ms package type definitions
    algorithm: 'HS256',
  };
  return jwt.sign(payload as object, JWT_SECRET, options);
};

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token string
 * @returns Decoded payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'], // Whitelist allowed algorithms
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Verifies token and returns null on failure (for middleware use)
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const verifyTokenSafe = (token: string): JWTPayload | null => {
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
};

/**
 * Extracts token from Authorization header
 * @param authHeader - Authorization header string (e.g., "Bearer token")
 * @returns Token string or null
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove "Bearer " prefix
};

/**
 * Decodes token without verification (use with caution)
 * @param token - JWT token string
 * @returns Decoded payload or null
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};
