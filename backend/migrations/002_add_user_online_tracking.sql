-- Migration: Add online/offline tracking to users table
-- Date: October 10, 2025
-- Purpose: Enable email notifications for offline users

-- Add last_seen column to track when user was last active
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add is_online column to track if user is currently connected
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE;

-- Create index on last_seen for performance
CREATE INDEX IF NOT EXISTS idx_users_last_seen ON users(last_seen);

-- Create index on is_online for performance
CREATE INDEX IF NOT EXISTS idx_users_is_online ON users(is_online);

-- Update existing users to have current timestamp
UPDATE users
SET last_seen = CURRENT_TIMESTAMP
WHERE last_seen IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.last_seen IS 'Timestamp of last user activity (API call or Socket.io event)';
COMMENT ON COLUMN users.is_online IS 'Whether user is currently connected via Socket.io';

-- Verification query (run this after migration to verify)
-- SELECT id, email, last_seen, is_online FROM users;

