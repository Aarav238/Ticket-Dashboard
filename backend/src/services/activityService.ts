// Activity service for logging and retrieving project/ticket activities
import mongoose from 'mongoose';
import { Activity, ActivityType } from '../types';
import { ActivityModel } from '../models/ActivityModel';

const formatActivity = (doc: any): Activity | null => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  const result: any = {
    id: obj._id.toString(),
    project_id: obj.project_id?.toString(),
    ticket_id: obj.ticket_id?.toString(),
    user_id:
      obj.user_id && typeof obj.user_id === 'object' && obj.user_id._id
        ? obj.user_id._id.toString()
        : obj.user_id?.toString(),
    type: obj.type,
    description: obj.description,
    created_at: obj.created_at,
  };

  if (obj.user_id && typeof obj.user_id === 'object' && obj.user_id._id) {
    result.user_email = obj.user_id.email;
    result.user_name = obj.user_id.name;
  }
  if (obj.project_id && typeof obj.project_id === 'object' && obj.project_id._id) {
    result.project_name = obj.project_id.name;
    result.project_id = obj.project_id._id.toString();
  }

  return result;
};

/**
 * Creates a new activity log entry
 */
export const createActivity = async (
  projectId: string,
  userId: string,
  type: ActivityType,
  description: string,
  ticketId?: string
): Promise<Activity> => {
  const createData: any = {
    project_id: new mongoose.Types.ObjectId(projectId),
    user_id: new mongoose.Types.ObjectId(userId),
    type,
    description,
  };
  if (ticketId) {
    createData.ticket_id = new mongoose.Types.ObjectId(ticketId);
  }
  const doc = await ActivityModel.create(createData);
  return formatActivity(doc)!;
};

/**
 * Retrieves activities for a specific project
 */
export const getProjectActivities = async (
  projectId: string,
  limit: number = 50
): Promise<Activity[]> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) return [];
  const docs = await ActivityModel.find({ project_id: new mongoose.Types.ObjectId(projectId) })
    .populate('user_id', 'email name')
    .sort({ created_at: -1 })
    .limit(limit);
  return docs.map(formatActivity).filter(Boolean) as Activity[];
};

/**
 * Retrieves all activities for a user across all projects
 */
export const getUserActivities = async (
  userId: string,
  limit: number = 50
): Promise<Activity[]> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const docs = await ActivityModel.find({ user_id: new mongoose.Types.ObjectId(userId) })
    .populate('project_id', 'name')
    .sort({ created_at: -1 })
    .limit(limit);
  return docs.map(formatActivity).filter(Boolean) as Activity[];
};

/**
 * Retrieves activities for a specific ticket
 */
export const getTicketActivities = async (ticketId: string): Promise<Activity[]> => {
  if (!mongoose.Types.ObjectId.isValid(ticketId)) return [];
  const docs = await ActivityModel.find({ ticket_id: new mongoose.Types.ObjectId(ticketId) })
    .populate('user_id', 'email name')
    .sort({ created_at: -1 });
  return docs.map(formatActivity).filter(Boolean) as Activity[];
};
