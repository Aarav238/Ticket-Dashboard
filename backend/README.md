# Ticket Dashboard Backend

A robust Node.js backend with Express, TypeScript, Socket.io, and MongoDB for real-time project and ticket management.

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
- MongoDB (local via [MongoDB Compass](https://www.mongodb.com/products/compass) or cloud via [MongoDB Atlas](https://www.mongodb.com/atlas))
- SendGrid account for email services

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup Database**

   **Local (MongoDB Compass)**
   - Install and open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - The `ticket-dashboard` database is created automatically on first run — no migrations needed

   **Cloud (MongoDB Atlas)**
   - Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Copy the connection string and set `MONGODB_URL` in `.env`

3. **Configure Environment**
   ```bash
   cp .env .env.backup
   ```

   Edit `.env` with your credentials:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database (optional — defaults to mongodb://localhost:27017)
   # MONGODB_URL=mongodb://localhost:27017
   # MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net  ← Atlas

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
│   ├── config/          # Database (MongoDB) and Socket.io configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Mongoose models & query functions
│   │   ├── UserModel.ts
│   │   ├── ProjectModel.ts
│   │   ├── TicketModel.ts
│   │   ├── ActivityModel.ts
│   │   ├── OTPModel.ts
│   │   └── queries.ts
│   ├── services/        # Business logic (email, notifications, OTP, activity)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # JWT and validation utilities
│   └── server.ts        # Entry point
├── .env                 # Environment variables
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
- `DELETE /api/projects/:id` - Delete project (cascades to tickets & activities)

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

## 🗄️ MongoDB Collections

| Collection | Description |
|-----------|-------------|
| `users` | User accounts with presence tracking (`is_online`, `last_seen`) |
| `projects` | Projects with creator reference |
| `tickets` | Tickets with status, priority, type, and user refs |
| `activities` | Audit log of all changes |
| `otps` | One-time passwords (TTL-indexed, auto-deleted on expiry) |

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

### TTL-based OTP Expiry
MongoDB automatically deletes expired OTP documents via a TTL index:
```typescript
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
```

## 📧 Email Configuration

### SendGrid Setup
1. Create a SendGrid account
2. Verify your sender email address
3. Generate an API key
4. Add the API key to your `.env` file

## 🚢 Deployment

### Render (Current Deployment)
1. Create Web Service on Render
2. Connect GitHub repository
3. Configure environment variables
4. Deploy automatically

### Environment Variables for Production
```env
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net
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
- OTPs expire in 10 minutes (auto-deleted via MongoDB TTL index)
- Use HTTPS in production
- Keep `.env` file secure and never commit it
- CORS properly configured for frontend domain

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running locally (`mongod` or MongoDB Compass)
- Verify `MONGODB_URL` is correct if set
- For Atlas: check network access allowlist and credentials

**Email Not Sending**
- Verify `SENDGRID_API_KEY` is correct
- Check `SENDGRID_FROM_EMAIL` is a verified sender in SendGrid
- Ensure SendGrid account is active

**Socket.io Connection Failed**
- Verify `SOCKET_CORS_ORIGIN` matches your frontend URL exactly
- Check firewall settings allow WebSocket connections

**User Offline Detection Not Working**
- Check `is_online` and `last_seen` fields exist in the users collection
- Offline threshold is 2 minutes of inactivity
