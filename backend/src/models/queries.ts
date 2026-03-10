// Database query functions for all entities (MongoDB/Mongoose)
import mongoose from 'mongoose';
import { User, Project, Ticket, TicketStatus } from '../types';
import { UserModel } from './UserModel';
import { ProjectModel } from './ProjectModel';
import { TicketModel } from './TicketModel';

// ============ HELPERS ============

const formatUser = (doc: any): User | null => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: obj._id.toString(),
    email: obj.email,
    name: obj.name,
    is_online: obj.is_online,
    last_seen: obj.last_seen,
    created_at: obj.created_at,
    updated_at: obj.updated_at,
  } as any;
};

const formatProject = (doc: any): Project | null => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  const result: any = {
    id: obj._id.toString(),
    name: obj.name,
    description: obj.description,
    created_at: obj.created_at,
    updated_at: obj.updated_at,
  };
  if (obj.created_by && typeof obj.created_by === 'object' && obj.created_by._id) {
    result.created_by = obj.created_by._id.toString();
    result.creator_email = obj.created_by.email;
    result.creator_name = obj.created_by.name;
  } else {
    result.created_by = obj.created_by?.toString();
  }
  return result;
};

const formatTicket = (doc: any): Ticket | null => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  const result: any = {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    status: obj.status,
    priority: obj.priority,
    type: obj.type,
    order_index: obj.order_index,
    created_at: obj.created_at,
    updated_at: obj.updated_at,
  };

  result.project_id =
    obj.project_id && typeof obj.project_id === 'object' && obj.project_id._id
      ? obj.project_id._id.toString()
      : obj.project_id?.toString();

  if (obj.created_by && typeof obj.created_by === 'object' && obj.created_by._id) {
    result.created_by = obj.created_by._id.toString();
    result.creator_email = obj.created_by.email;
    result.creator_name = obj.created_by.name;
  } else {
    result.created_by = obj.created_by?.toString();
  }

  if (obj.assigned_to && typeof obj.assigned_to === 'object' && obj.assigned_to._id) {
    result.assigned_to = obj.assigned_to._id.toString();
    result.assignee_email = obj.assigned_to.email;
    result.assignee_name = obj.assigned_to.name;
  } else if (obj.assigned_to) {
    result.assigned_to = obj.assigned_to?.toString();
  }

  return result;
};

// ============ USER QUERIES ============

/**
 * Finds user by email address
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const doc = await UserModel.findOne({ email: email.toLowerCase().trim() });
  return formatUser(doc);
};

/**
 * Creates a new user
 */
export const createUser = async (email: string, name?: string): Promise<User> => {
  const doc = await UserModel.create({ email, name });
  return formatUser(doc)!;
};

/**
 * Finds user by ID
 */
export const findUserById = async (userId: string): Promise<User | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  const doc = await UserModel.findById(userId);
  return formatUser(doc);
};

/**
 * Gets all users in the system
 */
export const getAllUsers = async (): Promise<User[]> => {
  const docs = await UserModel.find().sort({ created_at: -1 });
  return docs.map(formatUser).filter(Boolean) as User[];
};

/**
 * Updates user's last_seen timestamp to current time
 */
export const updateUserLastSeen = async (userId: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return;
  await UserModel.findByIdAndUpdate(userId, { last_seen: new Date() });
};

/**
 * Sets user's online status
 */
export const setUserOnlineStatus = async (
  userId: string,
  isOnline: boolean
): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return;
  await UserModel.findByIdAndUpdate(userId, {
    is_online: isOnline,
    last_seen: new Date(),
  });
};

/**
 * Checks if a user is considered offline (explicitly offline OR last_seen > 2 minutes ago)
 */
export const isUserOffline = async (userId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return true;
  const user = await UserModel.findById(userId).select('is_online last_seen');
  if (!user) return true;

  const twoMinutesAgo = new Date(Date.now() - 120 * 1000);
  const isStale = !user.last_seen || user.last_seen < twoMinutesAgo;

  return !user.is_online || isStale;
};

/**
 * Gets all users except the specified user
 */
export const getAllUsersExcept = async (excludeUserId: string): Promise<User[]> => {
  const query = mongoose.Types.ObjectId.isValid(excludeUserId)
    ? { _id: { $ne: new mongoose.Types.ObjectId(excludeUserId) } }
    : {};
  const docs = await UserModel.find(query).sort({ created_at: -1 });
  return docs.map(formatUser).filter(Boolean) as User[];
};

// ============ PROJECT QUERIES ============

/**
 * Creates a new project
 */
export const createProject = async (
  name: string,
  createdBy: string,
  description?: string
): Promise<Project> => {
  const doc = await ProjectModel.create({
    name,
    description,
    created_by: new mongoose.Types.ObjectId(createdBy),
  });
  const populated = await doc.populate('created_by', 'email name');
  return formatProject(populated)!;
};

/**
 * Gets all projects
 */
export const getAllProjects = async (): Promise<Project[]> => {
  const docs = await ProjectModel.find()
    .populate('created_by', 'email name')
    .sort({ updated_at: -1 });
  return docs.map(formatProject).filter(Boolean) as Project[];
};

/**
 * Gets project by ID
 */
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) return null;
  const doc = await ProjectModel.findById(projectId).populate('created_by', 'email name');
  return formatProject(doc);
};

/**
 * Updates a project
 */
export const updateProject = async (
  projectId: string,
  name?: string,
  description?: string
): Promise<Project | null> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) return null;

  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;

  if (Object.keys(updates).length === 0) {
    return getProjectById(projectId);
  }

  const doc = await ProjectModel.findByIdAndUpdate(projectId, { $set: updates }, { new: true }).populate(
    'created_by',
    'email name'
  );
  return formatProject(doc);
};

/**
 * Deletes a project and cascades to tickets and activities
 */
export const deleteProject = async (projectId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) return false;
  const result = await ProjectModel.findByIdAndDelete(projectId);
  if (!result) return false;

  // Cascade delete tickets
  const { TicketModel } = await import('./TicketModel');
  await TicketModel.deleteMany({ project_id: new mongoose.Types.ObjectId(projectId) });

  // Cascade delete activities
  const { ActivityModel } = await import('./ActivityModel');
  await ActivityModel.deleteMany({ project_id: new mongoose.Types.ObjectId(projectId) });

  return true;
};

// ============ TICKET QUERIES ============

/**
 * Creates a new ticket
 */
export const createTicket = async (ticketData: {
  project_id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: string;
  type: string;
  assigned_to?: string;
  created_by: string;
  order_index: number;
}): Promise<Ticket> => {
  const { project_id, title, description, status, priority, type, assigned_to, created_by, order_index } =
    ticketData;

  const createData: any = {
    project_id: new mongoose.Types.ObjectId(project_id),
    title,
    description,
    status,
    priority,
    type,
    created_by: new mongoose.Types.ObjectId(created_by),
    order_index,
  };
  if (assigned_to) {
    createData.assigned_to = new mongoose.Types.ObjectId(assigned_to);
  }

  const doc = await TicketModel.create(createData);

  const populated = await TicketModel.findById(doc._id)
    .populate('created_by', 'email name')
    .populate('assigned_to', 'email name');

  return formatTicket(populated)!;
};

/**
 * Gets all tickets for a project, ordered by status then order_index
 */
export const getProjectTickets = async (projectId: string): Promise<Ticket[]> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) return [];
  const docs = await TicketModel.find({ project_id: new mongoose.Types.ObjectId(projectId) })
    .populate('created_by', 'email name')
    .populate('assigned_to', 'email name')
    .sort({ status: 1, order_index: 1 });
  return docs.map(formatTicket).filter(Boolean) as Ticket[];
};

/**
 * Gets ticket by ID
 */
export const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
  if (!mongoose.Types.ObjectId.isValid(ticketId)) return null;
  const doc = await TicketModel.findById(ticketId)
    .populate('created_by', 'email name')
    .populate('assigned_to', 'email name');
  return formatTicket(doc);
};

/**
 * Updates a ticket
 */
export const updateTicket = async (
  ticketId: string,
  updates: Partial<Ticket>
): Promise<Ticket | null> => {
  if (!mongoose.Types.ObjectId.isValid(ticketId)) return null;

  const mongoUpdates: any = { ...updates };

  // Convert string IDs to ObjectIds where needed
  if (mongoUpdates.assigned_to !== undefined) {
    mongoUpdates.assigned_to = mongoUpdates.assigned_to
      ? new mongoose.Types.ObjectId(mongoUpdates.assigned_to)
      : null;
  }
  if (mongoUpdates.created_by) {
    mongoUpdates.created_by = new mongoose.Types.ObjectId(mongoUpdates.created_by);
  }

  // Remove virtual/computed fields that aren't stored
  delete mongoUpdates.id;
  delete mongoUpdates.project_id;
  delete mongoUpdates.creator_email;
  delete mongoUpdates.creator_name;
  delete mongoUpdates.assignee_email;
  delete mongoUpdates.assignee_name;
  delete mongoUpdates.created_at;
  delete mongoUpdates.updated_at;

  if (Object.keys(mongoUpdates).length === 0) {
    return getTicketById(ticketId);
  }

  const doc = await TicketModel.findByIdAndUpdate(
    ticketId,
    { $set: mongoUpdates },
    { new: true }
  )
    .populate('created_by', 'email name')
    .populate('assigned_to', 'email name');

  return formatTicket(doc);
};

/**
 * Gets the maximum order index for tickets in a specific status column
 */
export const getMaxOrderIndex = async (
  projectId: string,
  status: TicketStatus
): Promise<number> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) return 0;
  const doc = await TicketModel.findOne({
    project_id: new mongoose.Types.ObjectId(projectId),
    status,
  })
    .sort({ order_index: -1 })
    .select('order_index');
  return doc?.order_index ?? 0;
};

/**
 * Deletes a ticket
 */
export const deleteTicket = async (ticketId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(ticketId)) return false;
  const result = await TicketModel.findByIdAndDelete(ticketId);
  return result !== null;
};
