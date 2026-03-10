import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  expires_at: Date;
  created_at: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    expires_at: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

// TTL index: MongoDB automatically deletes expired OTP documents
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const OTPModel = mongoose.model<IOTP>('OTP', otpSchema);
