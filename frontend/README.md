# Ticket Dashboard - Frontend

Modern, real-time ticket management system built with Next.js 15, TypeScript, and Aceternity UI components.

## 🌐 Live Deployment
- **Frontend**: [https://ticket-dashboard-ashen.vercel.app](https://ticket-dashboard-ashen.vercel.app) (Vercel)
- **Backend API**: [https://ticket-dashboard-7ujo.onrender.com](https://ticket-dashboard-7ujo.onrender.com) (Render)

## 🚀 Features

- **OTP Authentication** - Passwordless login with email OTP
- **Real-time Updates** - Socket.io integration for live ticket updates
- **Drag-and-Drop Kanban** - Intuitive ticket management with dnd-kit
- **Super-User Mode** - Elevated privileges for ticket assignment
- **Beautiful UI** - Aceternity UI components with Framer Motion animations
- **Dark Mode** - Full dark mode support with persistent preferences
- **Responsive Design** - Mobile-first responsive design
- **Rich Notifications** - Real-time notifications with email fallback
- **User Presence** - Online/offline user tracking
- **Hybrid Notifications** - Socket.io for online users, email for offline users

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x with dark mode
- **State Management**: Zustand with persist middleware
- **Animations**: Framer Motion
- **Drag-and-Drop**: @dnd-kit
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React + Tabler Icons
- **HTTP Client**: Axios with interceptors
- **Real-time**: Socket.io-client
- **UI Components**: Aceternity UI
- **Theme**: Custom theme provider with localStorage persistence

## 🏗️ Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── login/                    # Login page with OTP
│   ├── projects/                 # Projects list
│   │   └── [id]/                 # Project ticket board
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirects)
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   │   └── super-user-toggle.tsx
│   ├── layout/                   # Layout components
│   │   └── app-layout.tsx
│   ├── notifications/            # Notification components
│   │   └── notification-panel.tsx
│   ├── projects/                 # Project components
│   │   └── create-project-modal.tsx
│   ├── tickets/                  # Ticket components
│   │   ├── kanban-board.tsx
│   │   ├── kanban-column.tsx
│   │   ├── ticket-card.tsx
│   │   ├── create-ticket-modal.tsx
│   │   └── edit-ticket-modal.tsx
│   └── ui/                       # Aceternity UI components
│       ├── background-gradient.tsx
│       ├── button.tsx
│       ├── card-stack.tsx
│       ├── floating-dock.tsx
│       ├── hover-effect.tsx
│       ├── input.tsx
│       ├── spinner.tsx
│       ├── tabs.tsx
│       └── text-generate-effect.tsx
├── lib/                          # Utilities
│   ├── api.ts                    # Axios API client
│   ├── socket.ts                 # Socket.io service
│   └── utils.ts                  # Helper functions
├── store/                        # Zustand stores
│   ├── authStore.ts              # Authentication state
│   ├── projectStore.ts           # Projects state
│   ├── ticketStore.ts            # Tickets state
│   └── notificationStore.ts      # Notifications state
├── types/                        # TypeScript types
│   └── index.ts                  # Shared types
└── middleware.ts                 # Next.js middleware (route protection)
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production deployment, update the API URL to your backend URL.

### 3. Run Development Server

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## 🔑 Authentication Flow

1. **Enter Email** - User enters email on login page
2. **Receive OTP** - 6-digit OTP sent to email
3. **Verify OTP** - User enters OTP to login
4. **Auto-Create Account** - Account automatically created on first login
5. **JWT Token** - Token stored in localStorage and used for API calls

## 🎯 Main Features

### Projects Page
- View all projects in grid layout
- Hover effect cards (Aceternity UI)
- Create new projects
- Super-user toggle

### Ticket Board
- Kanban board with 3 columns (TODO, IN_PROGRESS, DONE)
- Drag-and-drop tickets between columns
- Real-time updates via Socket.io
- Create, edit, and delete tickets
- Assign tickets (super-user only)
- Priority and type indicators

### Notifications
- Real-time notifications from Socket.io
- Browser notifications support
- Notification panel with history
- Rich email notifications for offline users
- Unread count badge
- Mark as read functionality

### Super-User Mode
- Password verification required
- Assign tickets to users
- Delete tickets
- Elevated privileges indicator

## 📡 Real-time Updates

The app uses Socket.io for real-time collaboration:

- **Ticket Created** - New tickets appear instantly
- **Ticket Updated** - Changes sync across all users
- **Ticket Moved** - Drag-and-drop updates everyone
- **Ticket Deleted** - Deletions reflect immediately
- **Notifications** - Activity updates in real-time
- **User Presence** - Online/offline status tracking
- **Hybrid Notifications** - Socket.io for online users, email for offline users

## 🎨 UI Components

### Aceternity UI Components Used

1. **Background Gradient Animation** - Animated gradient backgrounds
2. **Card Stack** - Stacked card animations
3. **Floating Dock** - macOS-style navigation dock
4. **Hover Effect Cards** - Beautiful card hover effects
5. **Tabs** - Animated tab switching
6. **Text Generate Effect** - Word-by-word text animations

### Custom Components

- **Button** - Variants: primary, secondary, danger, ghost
- **Input** - Styled input with label and error states
- **Spinner** - Loading spinner
- **Modals** - Animated modals with backdrop

## 🔐 Route Protection

Middleware protects authenticated routes:

- Public routes: `/login`
- Protected routes: `/projects`, `/projects/[id]`
- Auto-redirect based on auth state

## 📦 State Management

### Zustand Stores

1. **authStore** - User, token, super-user status
2. **projectStore** - Projects list and CRUD operations
3. **ticketStore** - Tickets list and CRUD operations
4. **notificationStore** - Real-time notifications

All stores include:
- Loading states
- Error handling
- Optimistic updates
- Real-time sync

## 🎯 Drag-and-Drop

Using `@dnd-kit` for robust drag-and-drop:

- Pointer sensor with 8px activation threshold
- Visual feedback during drag
- Smooth animations
- Touch device support
- Sortable lists within columns

## 🌐 API Integration

Axios client with interceptors:

- Auto-attach JWT token to requests
- Global error handling
- Auto-redirect on 401 Unauthorized
- Base URL configuration

## 🚀 Build & Deploy

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Environment Variables on Vercel

Add these in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://ticket-dashboard-7ujo.onrender.com
```

### Current Deployment
- **Frontend**: Deployed on Vercel with automatic deployments
- **Backend**: Deployed on Render with PostgreSQL database
- **Domain**: Custom domain with SSL certificate

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Issue: "Module not found" errors
**Solution**: Clear `.next` folder and reinstall dependencies
```bash
rm -rf .next node_modules
npm install
```

### Issue: Socket.io not connecting
**Solution**: Check backend URL in `.env.local` and ensure backend is running

### Issue: OTP not received
**Solution**: Check backend email configuration and spam folder

### Issue: Dark mode not working
**Solution**: Clear browser cache and localStorage

## 🎯 Current Features

### ✅ Implemented
- [x] OTP Authentication with auto user creation
- [x] Real-time Socket.io integration
- [x] Drag-and-drop Kanban board
- [x] Super-user mode with password protection
- [x] Dark/light mode with persistence
- [x] Mobile-responsive design
- [x] Rich notifications system
- [x] User presence tracking
- [x] Hybrid notifications (Socket.io + Email)
- [x] Project management
- [x] Ticket CRUD operations
- [x] Real-time updates
- [x] Beautiful UI with Aceternity components

## 🙏 Credits

- Aceternity UI for beautiful components
- Vercel for Next.js framework
- dnd-kit for drag-and-drop
- Zustand for state management
- Cursor

---

**Built with ❤️ using Next.js 15 and TypeScript**
