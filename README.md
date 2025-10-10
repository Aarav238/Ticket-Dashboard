# Ticket Dashboard

A modern, full-stack ticket management system built with Next.js 15, TypeScript, and PostgreSQL. Features real-time updates, drag-and-drop Kanban boards, and comprehensive project management capabilities.

## ✨ Features

### 🎯 Core Functionality
- **Project Management**: Create, edit, and delete projects with detailed descriptions
- **Ticket System**: Full CRUD operations with drag-and-drop Kanban board
- **Real-time Updates**: Live notifications and updates via Socket.io
- **User Authentication**: OTP-based login system with JWT tokens
- **Super User Mode**: Elevated privileges for administrative tasks

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface with Aceternity UI components
- **Dark/Light Mode**: Toggle between themes with persistent preferences
- **Mobile-First**: Fully responsive design optimized for all screen sizes
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Floating Dock**: macOS-style navigation dock
- **Interactive Guide**: Comprehensive application guide with progress tracking

### 🔔 Notifications
- **Real-time Notifications**: Instant updates via Socket.io
- **Email Notifications**: Rich HTML emails for offline users via SendGrid
- **Notification Panel**: Dedicated panel with read/unread status
- **Browser Notifications**: Native browser notifications support
- **Hybrid System**: Smart delivery based on user online/offline status
- **Rich Content**: Detailed notifications with context and action details

### 🛡️ Security & Authentication
- **OTP Authentication**: Secure email-based login system
- **JWT Tokens**: Stateless authentication with token refresh
- **Super User Access**: Password-protected administrative mode
- **Route Protection**: Middleware-based route security

## 🏗️ Architecture & Design Patterns

### System Architecture

The application follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│           Frontend (Next.js 15)             │
│  ┌─────────────────────────────────────┐   │
│  │  Components (UI Layer)              │   │
│  ├─────────────────────────────────────┤   │
│  │  Stores (State Management)          │   │
│  ├─────────────────────────────────────┤   │
│  │  API Client (HTTP/Socket)           │   │
│  └─────────────────────────────────────┘   │
└──────────────┬──────────────────────────────┘
               │ REST API / WebSocket
┌──────────────┴──────────────────────────────┐
│        Backend (Node.js + Express)          │
│  ┌─────────────────────────────────────┐   │
│  │  Routes (API Endpoints)             │   │
│  ├─────────────────────────────────────┤   │
│  │  Middleware (Auth, Validation)      │   │
│  ├─────────────────────────────────────┤   │
│  │  Controllers (Request Handlers)     │   │
│  ├─────────────────────────────────────┤   │
│  │  Services (Business Logic)          │   │
│  ├─────────────────────────────────────┤   │
│  │  Patterns (Strategy, Factory)       │   │
│  ├─────────────────────────────────────┤   │
│  │  Models (Database Queries)          │   │
│  └─────────────────────────────────────┘   │
└──────────────┬──────────────────────────────┘
               │ SQL Queries
┌──────────────┴──────────────────────────────┐
│      Database (PostgreSQL/Supabase)         │
└─────────────────────────────────────────────┘
```

### 🎨 Design Patterns Implemented

#### 1️⃣ **Strategy Pattern** (Notification System)
**Location**: `backend/src/patterns/NotificationStrategy.ts`

**Purpose**: Dynamically switch between different notification delivery methods

**Implementation**:
```typescript
interface NotificationStrategy {
  send(user: User, activity: Activity): Promise<void>;
}

// Email Strategy
class EmailNotificationStrategy implements NotificationStrategy {
  async send(user: User, activity: Activity): Promise<void> {
    await sendNotificationEmail(user.email, subject, message);
  }
}

// Socket.io Strategy
class SocketNotificationStrategy implements NotificationStrategy {
  async send(user: User, activity: Activity): Promise<void> {
    this.io.to(`user-${user.id}`).emit('notification', data);
  }
}

// Context
class NotificationService {
  private strategy: NotificationStrategy;
  
  setStrategy(strategy: NotificationStrategy): void {
    this.strategy = strategy;
  }
  
  async notify(user: User, activity: Activity): Promise<void> {
    await this.strategy.send(user, activity);
  }
}
```

**Benefits**:
- ✅ Easy to add new notification methods (SMS, Push, etc.)
- ✅ Runtime strategy switching based on user status
- ✅ Testable in isolation
- ✅ Follows Open/Closed Principle

#### 2️⃣ **Factory Pattern** (Ticket Creation)
**Location**: `backend/src/patterns/TicketFactory.ts`

**Purpose**: Create tickets with type-specific defaults and validation

**Implementation**:
```typescript
class TicketFactory {
  static createTicket(type: TicketType, data: Omit<CreateTicketDTO, 'type'>): CreateTicketDTO {
    switch (type) {
      case TicketType.BUG:
        return { ...data, type: TicketType.BUG, priority: data.priority || TicketPriority.HIGH };
      case TicketType.FEATURE:
        return { ...data, type: TicketType.FEATURE, priority: data.priority || TicketPriority.MEDIUM };
      // ... more types
    }
  }
  
  static isUrgent(type: TicketType): boolean {
    return type === TicketType.BUG;
  }
  
  static getAssignmentStrategy(type: TicketType): string {
    // Returns recommended assignment strategy
  }
}
```

**Benefits**:
- ✅ Centralized ticket creation logic
- ✅ Type-specific defaults (bugs → high priority)
- ✅ Consistent ticket initialization
- ✅ Easy to extend with new ticket types

#### 3️⃣ **Middleware Pattern** (Express.js)
**Location**: `backend/src/middleware/`

**Purpose**: Cross-cutting concerns and request processing pipeline

**Implementation**:
```typescript
// Authentication Middleware
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = extractTokenFromHeader(req.headers.authorization);
  const decoded = verifyTokenSafe(token);
  req.user = decoded;
  next();
};

// Validation Middleware
export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error });
  next();
};

// Error Handler Middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
};

// User Activity Tracking
export const updateLastSeen = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.userId) {
    await setUserOnline(req.user.userId);
  }
  next();
};
```

**Benefits**:
- ✅ Reusable request processing logic
- ✅ Clean separation of concerns
- ✅ Easy to compose and order
- ✅ Testable in isolation

#### 4️⃣ **Repository Pattern** (Data Access Layer)
**Location**: `backend/src/models/queries.ts`

**Purpose**: Abstract database operations and queries

**Implementation**:
```typescript
// All database queries centralized in one place
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const createProject = async (data: CreateProjectDTO): Promise<Project> => {
  const result = await pool.query(
    'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
    [data.name, data.description, data.created_by]
  );
  return result.rows[0];
};
```

**Benefits**:
- ✅ Database logic separated from business logic
- ✅ Easy to swap database implementations
- ✅ Consistent error handling
- ✅ Query optimization in one place

#### 5️⃣ **Observer Pattern** (Real-time Updates)
**Location**: Socket.io event system

**Purpose**: Real-time event broadcasting and subscription

**Implementation**:
```typescript
// Server broadcasts events
io.to(`project-${projectId}`).emit('ticket-created', ticketData);
io.to(`user-${userId}`).emit('notification', notificationData);

// Clients subscribe to events
socket.on('ticket-updated', (data) => {
  updateTicketInStore(data);
});

socket.on('notification', (data) => {
  addNotificationToStore(data);
});
```

**Benefits**:
- ✅ Decoupled event producers and consumers
- ✅ Real-time collaboration
- ✅ Multiple subscribers per event
- ✅ Room-based event filtering

#### 6️⃣ **Singleton Pattern** (Database Connection)
**Location**: `backend/src/config/database.ts`

**Purpose**: Single database connection pool instance

**Implementation**:
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool; // Single instance exported
```

**Benefits**:
- ✅ Single connection pool across app
- ✅ Resource optimization
- ✅ Connection pooling
- ✅ Consistent database access

### 🔧 Architectural Principles

#### **Separation of Concerns**
- **Routes**: Define API endpoints and HTTP methods
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Database queries and data access
- **Middleware**: Cross-cutting concerns (auth, validation, logging)

#### **Dependency Injection**
- Services receive dependencies via constructor
- Easier testing with mock dependencies
- Loose coupling between components

#### **Type Safety**
- TypeScript throughout (frontend + backend)
- Shared type definitions
- Compile-time error catching
- Better IDE support and autocomplete

#### **Error Handling**
- Centralized error middleware
- Consistent error response format
- Validation errors with Zod
- Database error handling

### Backend Stack
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database with Supabase
- **Socket.io** for real-time communication
- **SendGrid** for email services
- **JWT** for authentication
- **Zod** for data validation

### Frontend Stack
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS 4.x** for styling
- **Zustand** for state management
- **Framer Motion** for animations
- **dnd-kit** for drag-and-drop
- **Aceternity UI** components

## 📁 Project Structure

```
Ticket-dashboard/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database queries
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migrations
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/              # API client & utilities
│   ├── store/            # Zustand stores
│   └── types/            # TypeScript interfaces
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- SendGrid account for email services

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ticket-dashboard
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=your_supabase_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_email

# Super User
SUPER_USER_PASSWORD=your_super_user_password

# CORS
SOCKET_CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Database Setup
1. Create a Supabase project
2. Run the SQL migrations in `backend/migrations/`
3. Update your `DATABASE_URL` in backend `.env`

## 🗄️ Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `name` (VARCHAR)
- `last_seen` (TIMESTAMP)
- `is_online` (BOOLEAN)

### Projects Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `created_by` (UUID, Foreign Key)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tickets Table
- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (ENUM: TODO, IN_PROGRESS, DONE)
- `priority` (ENUM: LOW, MEDIUM, HIGH, URGENT)
- `type` (ENUM: BUG, FEATURE, TASK)
- `assigned_to` (UUID, Foreign Key)
- `created_by` (UUID, Foreign Key)
- `order_index` (INTEGER)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/verify-super-user` - Verify super user password
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tickets
- `GET /api/tickets/project/:id` - Get project tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `PATCH /api/tickets/:id/move` - Move ticket (drag-and-drop)
- `DELETE /api/tickets/:id` - Delete ticket

### Users
- `GET /api/users` - Get all users

## 🔌 Socket.io Events

### Client → Server
- `join-project` - Join project room
- `leave-project` - Leave project room
- `ticket-updated` - Broadcast ticket update
- `ticket-moved` - Broadcast ticket move
- `ticket-created` - Broadcast ticket creation
- `ticket-deleted` - Broadcast ticket deletion

### Server → Client
- `project-created` - New project created
- `ticket-created` - New ticket created
- `ticket-updated` - Ticket updated
- `ticket-moved` - Ticket moved
- `ticket-deleted` - Ticket deleted
- `notification` - Real-time notification

## 🎨 UI Components

### Layout Components
- `AppLayout` - Main application layout
- `FloatingDock` - macOS-style navigation dock
- `NotificationPanel` - Real-time notifications panel

### Project Components
- `ProjectCard` - Individual project card
- `CreateProjectModal` - Project creation modal
- `EditProjectModal` - Project editing modal

### Ticket Components
- `TicketCard` - Individual ticket card
- `CreateTicketModal` - Ticket creation modal
- `EditTicketModal` - Ticket editing modal
- `KanbanBoard` - Drag-and-drop board

### Auth Components
- `SuperUserToggle` - Super user mode toggle
- `OTPForm` - OTP verification form

## 🔄 State Management

### Auth Store
- User authentication state
- JWT token management
- Super user mode
- Hydration handling

### Project Store
- Projects list
- Current project
- CRUD operations
- Loading states

### Ticket Store
- Tickets list
- Current ticket
- Drag-and-drop state
- Real-time updates

### Notification Store
- Notifications list
- Unread count
- Panel visibility
- Real-time updates

### Theme Store
- Dark/light mode
- Persistent preferences
- Theme application

## 📧 Email Integration

### SendGrid Configuration
- Rich HTML email templates
- Responsive design
- Branded notifications
- Offline user notifications

### Email Types
- OTP verification emails
- Project notifications
- Ticket notifications
- System alerts

## 🔔 Notification System

### How Notifications Work

Our notification system uses a **hybrid approach** that intelligently delivers notifications based on user presence:

#### 📱 **Real-time Notifications (Socket.io)**
- **For Online Users**: Instant delivery via WebSocket connection
- **Immediate Updates**: Project changes, ticket updates, assignments
- **Live Collaboration**: See changes as they happen

#### 📧 **Email Notifications (SendGrid)**
- **For Offline Users**: HTML emails with full context
- **Offline Threshold**: 2 minutes of inactivity
- **Detailed Content**: Includes ticket details, project info, and action context

#### 🎯 **Smart Delivery Logic**
```typescript
// User is considered offline if:
// 1. is_online flag is false, OR
// 2. last_seen is older than 2 minutes

const isOffline = !user.is_online || 
  (Date.now() - user.last_seen.getTime()) > 2 * 60 * 1000;

// Send via appropriate channel
if (isOffline) {
  await sendEmailNotification(user, notificationData);
} else {
  socket.to(user.id).emit('notification', notificationData);
}
```

### 🧪 Testing Notifications

#### **In-App Testing**
1. **Open Two Browser Windows**: 
   - Window 1: Log in as User A
   - Window 2: Log in as User B (different email)

2. **Test Real-time Notifications**:
   - Create/edit a project in Window 1
   - Create/edit a ticket in Window 1
   - Assign a ticket in Window 1
   - Watch notifications appear instantly in Window 2

3. **Test Notification Panel**:
   - Click the bell icon (top-left)
   - Mark notifications as read/unread
   - Test "Mark all as read" functionality

#### **Email Testing**
1. **Simulate Offline User**:
   - Login to the application
   - Close the browser/tab
   - Wait 2+ minutes
   - Perform actions from another account

2. **Check Email Inbox**:
   - Look for emails from your SendGrid verified sender
   - Verify HTML formatting
   - Check notification content and links

3. **Test Different Scenarios**:
   - Project creation/updates
   - Ticket creation/updates/assignments
   - Super user actions

#### **Notification Types**
- **Project Created**: "New project 'Project Name' created by user@email.com"
- **Ticket Created**: "New ticket 'Ticket Title' created in Project Name"
- **Ticket Assigned**: "Ticket 'Ticket Title' assigned to you by user@email.com"
- **Ticket Updated**: "Ticket 'Ticket Title' updated in Project Name"
- **Ticket Moved**: "Ticket 'Ticket Title' moved to In Progress"

## 🗄️ Database Architecture

### Why PostgreSQL Over NoSQL?

#### **✅ Advantages of PostgreSQL (Our Choice)**

1. **ACID Compliance**: Ensures data integrity for critical operations
   - Project updates are atomic
   - Ticket assignments are consistent
   - No partial updates or data corruption

2. **Relational Data**: Perfect for our structured data model
   - Users → Projects → Tickets relationships
   - Foreign key constraints prevent orphaned data
   - Complex queries with JOINs are efficient

3. **Advanced Querying**: SQL provides powerful data operations
   - Complex filtering and sorting
   - Aggregations (count tickets per project, user activity)
   - Full-text search capabilities

4. **Data Validation**: Schema enforcement at database level
   - ENUM types for ticket status/priority
   - NOT NULL constraints
   - Data type validation

5. **Mature Ecosystem**: Proven reliability and tooling
   - Supabase provides excellent PostgreSQL hosting
   - Rich migration tools
   - Backup and recovery solutions

#### **❌ Why Not NoSQL (MongoDB, etc.)?**

1. **Data Structure**: Our data is naturally relational
   - Projects contain multiple tickets
   - Users are assigned to tickets
   - Complex relationships would require manual management

2. **Consistency Requirements**: Ticket management needs strong consistency
   - Can't have tickets without projects
   - User assignments must be valid
   - Status updates must be atomic

3. **Query Complexity**: We need complex queries
   - "Get all tickets for user across all projects"
   - "Find projects with overdue tickets"
   - "Generate user activity reports"

4. **Transaction Requirements**: Multi-table operations
   - Creating a ticket updates project statistics
   - User actions affect multiple entities
   - Need rollback capabilities

### Database Schema Benefits

```sql
-- Strong relationships with foreign keys
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  -- ... other fields
);

-- Data integrity with ENUMs
CREATE TYPE ticket_status AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
```

## 📚 Interactive Guide System

### Guide Functionality

Our application includes a comprehensive **Interactive Guide** that helps users understand all features and functionalities:

#### 🎯 **Guide Features**
- **7 Comprehensive Sections**: Covering all aspects of the application
- **Progress Tracking**: Visual progress bar with completion percentage
- **Interactive Navigation**: Jump between sections or follow sequentially
- **Completion System**: Mark sections as complete for progress tracking
- **Reset Functionality**: Start over anytime

#### 📖 **Guide Sections**

1. **🔐 Authentication & Login**
   - OTP-based login system
   - Super user mode explanation
   - JWT token management

2. **📁 Project Management**
   - Creating and editing projects
   - Project permissions and access
   - Project organization

3. **🎫 Ticket Management**
   - Creating and updating tickets
   - Drag-and-drop Kanban board
   - Ticket assignment and prioritization

4. **🔔 Notifications System**
   - Real-time vs email notifications
   - Notification panel usage
   - User presence tracking

5. **🎨 User Interface**
   - Dark/light mode toggle
   - Responsive design features
   - Navigation and shortcuts

6. **⚡ Real-time Features**
   - Socket.io integration
   - Live collaboration
   - Instant updates

7. **⚙️ Advanced Features**
   - Super user capabilities
   - System settings
   - Power user tips


#### 🎮 **How to Use the Guide**
1. **Access**: Click the help icon (❓) in the floating dock
2. **Navigate**: Use sidebar or Previous/Next buttons
3. **Complete**: Mark sections as complete for progress tracking
4. **Reset**: Clear all progress and start fresh
5. **Track**: Monitor your progress with the visual progress bar

#### 💡 **Guide Benefits**
- **Onboarding**: New users learn the system quickly
- **Feature Discovery**: Existing users discover advanced features
- **Self-Service**: Reduce support requests with comprehensive documentation
- **Engagement**: Gamified progress tracking encourages completion

## 🚀 Deployment

### Live Application
- **Frontend**: [https://ticket-dashboard-ashen.vercel.app/](https://ticket-dashboard-ashen.vercel.app) (Vercel)
- **Backend**: [https://ticket-dashboard-7ujo.onrender.com](https://ticket-dashboard-7ujo.onrender.com) (Render)
- **Super User Password**: AaravShukla@123
### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy to Render
4. Set up SendGrid account

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel
3. Configure environment variables
4. Update API URLs

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
SENDGRID_API_KEY=your_key
SENDGRID_FROM_EMAIL=your_email
SUPER_USER_PASSWORD=your_password
SOCKET_CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
