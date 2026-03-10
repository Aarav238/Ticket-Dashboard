import mongoose, { Schema, Document } from 'mongoose';
import { TicketStatus, TicketPriority, TicketType } from '../types';

export interface ITicket extends Document {
  project_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  assigned_to?: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
  order_index: number;
  created_at: Date;
  updated_at: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.MEDIUM,
    },
    type: {
      type: String,
      enum: Object.values(TicketType),
      default: TicketType.TASK,
    },
    assigned_to: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order_index: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

ticketSchema.index({ project_id: 1, status: 1, order_index: 1 });

export const TicketModel = mongoose.model<ITicket>('Ticket', ticketSchema);
