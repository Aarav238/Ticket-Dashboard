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

### 🔔 Notifications
- **Real-time Notifications**: Instant updates via Socket.io
- **Email Notifications**: Rich HTML emails for offline users via SendGrid
- **Notification Panel**: Dedicated panel with read/unread status
- **Browser Notifications**: Native browser notifications support

### 🛡️ Security & Authentication
- **OTP Authentication**: Secure email-based login system
- **JWT Tokens**: Stateless authentication with token refresh
- **Super User Access**: Password-protected administrative mode
- **Route Protection**: Middleware-based route security

## 🏗️ Architecture

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

## 🚀 Deployment

### Live Application
- **Frontend**: [https://ticket-dashboard-ashen.vercel.app/](https://ticket-dashboard-ashen.vercel.app) (Vercel)
- **Backend**: [https://ticket-dashboard-7ujo.onrender.com](https://ticket-dashboard-7ujo.onrender.com) (Render)

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
