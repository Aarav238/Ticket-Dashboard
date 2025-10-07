# Ticket Dashboard Backend

A robust Node.js backend with Express, TypeScript, Socket.io, and PostgreSQL for real-time project and ticket management.

## 🚀 Features

- **OTP Authentication** - Email-based OTP login with auto user registration
- **Real-time Updates** - Socket.io for live ticket updates across clients
- **Design Patterns** - Strategy pattern for notifications, Factory pattern for tickets
- **Super User Mode** - Password-protected mode to view user information
- **Activity Logging** - Track all project and ticket changes
- **Drag-and-Drop API** - RESTful endpoints for ticket reordering

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL (Supabase recommended)
- SMTP credentials (Gmail App Password or SendGrid)

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup Database**
   - Create a PostgreSQL database in Supabase
   - Run the SQL schema from `database-schema.sql` in Supabase SQL Editor
   - Copy your connection string

3. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   DATABASE_URL=your-supabase-connection-string
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-gmail-app-password
   JWT_SECRET=your-secret-min-32-characters
   SUPER_USER_PASSWORD=your-admin-password
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
│   ├── patterns/        # Design patterns (Strategy, Factory)
│   ├── routes/          # API routes
│   ├── services/        # Business logic (email, OTP, activities)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # JWT and validation utilities
│   └── server.ts        # Entry point
├── database-schema.sql  # PostgreSQL schema
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

## 🎨 Design Patterns

### Strategy Pattern - Notification Service
Different notification strategies (Email, Socket) can be swapped at runtime:
```typescript
const emailStrategy = new EmailNotificationStrategy();
const socketStrategy = new SocketNotificationStrategy(io);
const notificationService = new NotificationService(emailStrategy);
```

### Factory Pattern - Ticket Creation
Creates tickets with type-specific defaults:
```typescript
const ticket = TicketFactory.createTicket(TicketType.BUG, ticketData);
// Bugs automatically get HIGH priority
```

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password: Google Account → Security → App passwords
3. Use the 16-character password in `.env`

### Other Providers
Update SMTP settings in `.env` for SendGrid, Mailgun, etc.

## 🚢 Deployment

### Railway (Recommended)
1. Connect GitHub repository
2. Add PostgreSQL service
3. Set environment variables
4. Deploy automatically

### Render
1. Create Web Service
2. Add PostgreSQL database
3. Configure environment
4. Deploy

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build

## 🔐 Security Notes

- JWT tokens expire in 7 days (configurable)
- OTPs expire in 10 minutes
- Passwords should be hashed in production
- Use HTTPS in production
- Keep `.env` file secure

## 🐛 Troubleshooting

**Database Connection Error**
- Verify DATABASE_URL is correct
- Check Supabase IP allowlist (allow all or your IP)

**Email Not Sending**
- Verify SMTP credentials
- Check Gmail App Password is correct
- Ensure 2FA is enabled for Gmail

**Socket.io Connection Failed**
- Verify SOCKET_CORS_ORIGIN matches frontend URL
- Check firewall settings

## 📄 License

MIT

