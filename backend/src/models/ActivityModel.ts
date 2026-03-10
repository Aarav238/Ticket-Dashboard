import mongoose, { Schema, Document } from 'mongoose';
import { ActivityType } from '../types';

export interface IActivity extends Document {
  project_id: mongoose.Types.ObjectId;
  ticket_id?: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  type: ActivityType;
  description: string;
  created_at: Date;
  updated_at: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    ticket_id: { type: Schema.Types.ObjectId, ref: 'Ticket', default: null },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(ActivityType), required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

activitySchema.index({ project_id: 1, created_at: -1 });
activitySchema.index({ user_id: 1, created_at: -1 });

export const ActivityModel = mongoose.model<IActivity>('Activity', activitySchema);
