# Ticket Dashboard Backend

A robust Node.js backend with Express, TypeScript, Socket.io, and PostgreSQL for real-time project and ticket management.

## 🌐 Live Deployment
- **Backend API**: [https://ticket-dashboard-7ujo.onrender.com](https://ticket-dashboard-7ujo.onrender.com) (Render)
- **Frontend**: [https://ticket-dashboard-ashen.vercel.app](https://ticket-dashboard-ashen.vercel.app) (Vercel)

## 🚀 Features

- **OTP Authentication** - Email-based OTP login with auto user registration
- **Real-time Updates** - Socket.io for live ticket updates across clients
- **Rich Notifications** - SendGrid email notifications for offline users
- **Super User Mode** - Password-protected mode to view user information
- **Activity Logging** - Track all project and ticket changes
- **Drag-and-Drop API** - RESTful endpoints for ticket reordering
- **Online/Offline Tracking** - User presence detection
- **Hybrid Notifications** - Socket.io for online users, email for offline users

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL (Supabase recommended)
- SendGrid account for email services

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup Database**
   - Create a PostgreSQL database in Supabase
   - Run the SQL migrations from `migrations/` folder in Supabase SQL Editor
   - Copy your connection string

3. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   DATABASE_URL=your-supabase-connection-string
   
   # JWT
   JWT_SECRET=your-secret-min-32-characters
   JWT_EXPIRES_IN=7d
   
   # Email Service (SendGrid)
   SENDGRID_API_KEY=your-sendgrid-api-key
   SENDGRID_FROM_EMAIL=your-verified-email
   
   # Super User
   SUPER_USER_PASSWORD=your-admin-password
   
   # CORS
   SOCKET_CORS_ORIGIN=http://localhost:3000
   CLIENT_URL=http://localhost:3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database and Socket.io configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Database queries
│   ├── services/        # Business logic (email, notifications)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # JWT and validation utilities
│   └── server.ts        # Entry point
├── migrations/          # Database migration files
│   ├── database-schema.sql
│   ├── 002_add_user_online_tracking.sql
│   └── README.md
├── .env.example        # Environment variables template
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/verify-super-user` - Verify super user password
- `GET /api/auth/me` - Get current user

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/project/:projectId` - Get project tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `PUT /api/tickets/:id` - Update ticket
- `PATCH /api/tickets/:id/move` - Move ticket (drag-and-drop)
- `DELETE /api/tickets/:id` - Delete ticket

### Users
- `GET /api/users` - Get all users

## 🔄 Socket.io Events

### Client → Server
- `join-project` - Join project room for real-time updates
- `leave-project` - Leave project room
- `ticket-created` - Broadcast new ticket
- `ticket-updated` - Broadcast ticket update
- `ticket-moved` - Broadcast ticket move (drag-and-drop)
- `ticket-deleted` - Broadcast ticket deletion

### Server → Client
- `notification` - Receive activity notifications
- `ticket-created` - Receive new ticket
- `ticket-updated` - Receive ticket update
- `ticket-moved` - Receive ticket move
- `ticket-deleted` - Receive ticket deletion

## 🎨 Architecture Patterns

### Hybrid Notification System
Combines Socket.io for online users and SendGrid email for offline users:
```typescript
// Online users get real-time Socket.io notifications
io.to(`user-${userId}`).emit('notification', notificationData);

// Offline users get rich HTML email notifications
await sendRichNotificationEmail(user.email, notificationData);
```

### User Presence Tracking
Tracks user online/offline status with automatic detection:
```typescript
// Set user online on connection
setUserOnlineStatus(userId, true);

// Set user offline on disconnect
setUserOnlineStatus(userId, false);

// Check if user is offline (2-minute threshold)
const isOffline = await isUserOffline(userId);
```

## 📧 Email Configuration

### SendGrid Setup
1. Create a SendGrid account
2. Verify your sender email address
3. Generate an API key
4. Add the API key to your `.env` file

### Email Features
- **Rich HTML Templates**: Professional email notifications
- **Responsive Design**: Works on all email clients
- **Branded Notifications**: Consistent with your application
- **Offline User Support**: Emails sent to users who are offline

## 🚢 Deployment

### Render (Current Deployment)
1. Create Web Service on Render
2. Connect GitHub repository
3. Configure environment variables
4. Deploy automatically

### Environment Variables for Production
```env
DATABASE_URL=your-production-database-url
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-verified-email
JWT_SECRET=your-production-jwt-secret
SUPER_USER_PASSWORD=your-production-super-user-password
SOCKET_CORS_ORIGIN=https://your-frontend-domain.com
CLIENT_URL=https://your-frontend-domain.com
```

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build

## 🔐 Security Notes

- JWT tokens expire in 7 days (configurable)
- OTPs expire in 10 minutes
- Super user password is hashed and verified
- Use HTTPS in production
- Keep `.env` file secure
- CORS properly configured for frontend domain

## 🐛 Troubleshooting

**Database Connection Error**
- Verify DATABASE_URL is correct
- Check Supabase IP allowlist (allow all or your IP)
- Ensure database migrations are run

**Email Not Sending**
- Verify SENDGRID_API_KEY is correct
- Check SENDGRID_FROM_EMAIL is verified
- Ensure SendGrid account is active

**Socket.io Connection Failed**
- Verify SOCKET_CORS_ORIGIN matches frontend URL
- Check firewall settings
- Ensure WebSocket connections are allowed

**User Offline Detection Not Working**
- Check database has `last_seen` and `is_online` columns
- Verify migration `002_add_user_online_tracking.sql` was run
- Check offline threshold (default: 2 minutes)


