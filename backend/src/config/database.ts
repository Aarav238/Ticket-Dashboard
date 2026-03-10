// MongoDB connection configuration using Mongoose
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use MONGODB_URL from env, fallback to local MongoDB Compass
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017';

/**
 * Connects to MongoDB. Database name is always "ticket-dashboard".
 * Uses MONGODB_URL env variable if provided, otherwise connects to localhost:27017.
 */
export const connectDB = async (): Promise<void> => {
  await mongoose.connect(MONGODB_URI, {
    dbName: 'ticket-dashboard',
  });
};

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB (ticket-dashboard)');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(-1);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

export default mongoose;
