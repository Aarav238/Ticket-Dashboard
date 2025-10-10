// Guide content data for the Ticket Dashboard application
import { 
  User, 
  FolderKanban, 
  Ticket, 
  Bell, 
  Palette, 
  Zap, 
  Shield,
  MousePointer,
  Users,
  Mail,
  Smartphone
} from "lucide-react";
import type { GuideSection } from "@/types/guide";

export const guideSections: GuideSection[] = [
  {
    id: "authentication",
    title: "Authentication & Login",
    description: "Learn how to log in and access super user features",
    icon: <User className="h-6 w-6" />,
    estimatedTime: "2 minutes",
    difficulty: "Beginner",
    content: [
      {
        type: "text",
        title: "Welcome to Ticket Dashboard!",
        content: "This application uses a secure OTP (One-Time Password) authentication system. No passwords required!"
      },
      {
        type: "step",
        title: "Step 1: Enter Your Email",
        content: "On the login page, simply enter your email address and click 'Send OTP'. A 6-digit code will be sent to your email."
      },
      {
        type: "step",
        title: "Step 2: Verify OTP",
        content: "Check your email for the 6-digit code and enter it in the verification field. Your account will be created automatically if it's your first time."
      },
      {
        type: "tip",
        title: "Super User Mode",
        content: "Look for the shield icon in the top-right corner. Click it and enter the super user password to access advanced features like ticket assignment and deletion."
      },
      {
        type: "warning",
        title: "Security Note",
        content: "OTP codes expire in 10 minutes. If you don't receive an email, check your spam folder or try again."
      }
    ]
  },
  {
    id: "projects",
    title: "Project Management",
    description: "Create and manage your projects effectively",
    icon: <FolderKanban className="h-6 w-6" />,
    estimatedTime: "3 minutes",
    difficulty: "Beginner",
    content: [
      {
        type: "text",
        title: "Organize Your Work",
        content: "Projects help you organize your tickets and track progress. Each project has its own Kanban board."
      },
      {
        type: "step",
        title: "Creating a Project",
        content: "Click the 'New Project' button on the projects page. Enter a name and optional description, then click 'Create Project'."
      },
      {
        type: "step",
        title: "Editing Projects",
        content: "Hover over any project card and click the edit icon (pencil) to modify the project name or description."
      },
      {
        type: "tip",
        title: "Project Cards",
        content: "Each project card shows the project name, description, and last updated date. Click on a card to open its ticket board."
      },
      {
        type: "warning",
        title: "Super User Required",
        content: "Only super users can delete projects. Regular users can create and edit projects."
      }
    ]
  },
  {
    id: "tickets",
    title: "Ticket Management",
    description: "Master the Kanban board and ticket operations",
    icon: <Ticket className="h-6 w-6" />,
    estimatedTime: "5 minutes",
    difficulty: "Intermediate",
    content: [
      {
        type: "text",
        title: "Kanban Board Overview",
        content: "The Kanban board has three columns: TODO, IN PROGRESS, and DONE. Drag tickets between columns to update their status."
      },
      {
        type: "step",
        title: "Creating Tickets",
        content: "Click the 'Create Ticket' button in any column. Fill in the title, description, priority, type, and assignee (super users only)."
      },
      {
        type: "step",
        title: "Drag and Drop",
        content: "Simply drag any ticket card to a different column to change its status. The change will be saved automatically and synced with other users."
      },
      {
        type: "step",
        title: "Editing Tickets",
        content: "Click on any ticket card to open the edit modal. You can modify all ticket details including title, description, priority, and type."
      },
      {
        type: "tip",
        title: "Ticket Types",
        content: "Choose from BUG (issues to fix), FEATURE (new functionality), or TASK (general work items)."
      },
      {
        type: "tip",
        title: "Priority Levels",
        content: "Set priority as LOW, MEDIUM, HIGH, or URGENT. Higher priority tickets are visually distinct."
      },
      {
        type: "warning",
        title: "Super User Features",
        content: "Only super users can assign tickets to other users and delete tickets. Regular users can create and edit tickets."
      }
    ]
  },
  {
    id: "notifications",
    title: "Notifications System",
    description: "Stay updated with real-time notifications",
    icon: <Bell className="h-6 w-6" />,
    estimatedTime: "2 minutes",
    difficulty: "Beginner",
    content: [
      {
        type: "text",
        title: "Real-time Updates",
        content: "Get instant notifications when tickets are created, updated, moved, or deleted by any team member."
      },
      {
        type: "step",
        title: "Notification Panel",
        content: "Click the bell icon in the top-left corner to open the notification panel. See all recent activity and updates."
      },
      {
        type: "step",
        title: "Unread Badge",
        content: "The bell icon shows a red badge with the number of unread notifications. Click to view them."
      },
      {
        type: "tip",
        title: "Email Notifications",
        content: "If you're offline (haven't used the app in 2+ minutes), you'll receive rich HTML email notifications instead of in-app notifications."
      },
      {
        type: "step",
        title: "Mark as Read",
        content: "Click 'Mark all read' to clear all unread notifications, or click the X on individual notifications to dismiss them."
      },
      {
        type: "tip",
        title: "Browser Notifications",
        content: "The app can send browser notifications. Allow notifications when prompted for the best experience."
      }
    ]
  },
  {
    id: "ui-features",
    title: "User Interface",
    description: "Navigate and customize your experience",
    icon: <Palette className="h-6 w-6" />,
    estimatedTime: "2 minutes",
    difficulty: "Beginner",
    content: [
      {
        type: "text",
        title: "Beautiful Design",
        content: "The app features a modern, clean interface with smooth animations and hover effects."
      },
      {
        type: "step",
        title: "Dark Mode",
        content: "Click the moon/sun icon in the top-right corner to toggle between light and dark themes. Your preference is saved automatically."
      },
      {
        type: "step",
        title: "Floating Dock",
        content: "Use the floating dock at the bottom to navigate between Home, Projects, Notifications, and Logout."
      },
      {
        type: "step",
        title: "Mobile Navigation",
        content: "On mobile devices, tap the hamburger menu in the dock to access navigation options."
      },
      {
        type: "tip",
        title: "Responsive Design",
        content: "The app works perfectly on desktop, tablet, and mobile devices. All features are accessible on any screen size."
      },
      {
        type: "tip",
        title: "Hover Effects",
        content: "Hover over project cards and buttons to see beautiful animations and visual feedback."
      }
    ]
  },
  {
    id: "real-time",
    title: "Real-time Features",
    description: "Collaborate in real-time with your team",
    icon: <Zap className="h-6 w-6" />,
    estimatedTime: "3 minutes",
    difficulty: "Intermediate",
    content: [
      {
        type: "text",
        title: "Live Collaboration",
        content: "All changes are synchronized in real-time across all connected users. No need to refresh the page!"
      },
      {
        type: "step",
        title: "Automatic Updates",
        content: "When someone creates, updates, or moves a ticket, you'll see the changes instantly without any action required."
      },
      {
        type: "step",
        title: "User Presence",
        content: "The system tracks when users are online or offline. Online users get instant notifications, offline users get email notifications."
      },
      {
        type: "tip",
        title: "Connection Status",
        content: "The app automatically reconnects if your internet connection is lost. Your work is never lost."
      },
      {
        type: "tip",
        title: "Multi-tab Support",
        content: "You can have multiple tabs open. Changes in one tab will appear in all other tabs automatically."
      },
      {
        type: "warning",
        title: "Internet Required",
        content: "Real-time features require an internet connection. The app will work offline for viewing, but changes won't sync until you're back online."
      }
    ]
  },
  {
    id: "advanced",
    title: "Advanced Features",
    description: "Power user features and tips",
    icon: <Shield className="h-6 w-6" />,
    estimatedTime: "4 minutes",
    difficulty: "Advanced",
    content: [
      {
        type: "text",
        title: "Super User Powers",
        content: "Super users have elevated privileges and can perform administrative tasks."
      },
      {
        type: "step",
        title: "Ticket Assignment",
        content: "Super users can assign tickets to any user in the system. Look for the 'Assign to' field when creating or editing tickets."
      },
      {
        type: "step",
        title: "User Information",
        content: "Super users can see who created each ticket and when it was last updated. This information is hidden from regular users."
      },
      {
        type: "step",
        title: "Project Deletion",
        content: "Only super users can delete projects. Click the edit icon on a project and look for the delete button."
      },
      {
        type: "tip",
        title: "Super User Indicator",
        content: "When super user mode is active, the shield icon in the top-right will have a green dot and gradient background."
      },
      {
        type: "tip",
        title: "Email Notifications",
        content: "Super users receive detailed email notifications with rich HTML formatting, including ticket details and user information."
      },
      {
        type: "warning",
        title: "Security",
        content: "Super user access is protected by a password. Keep this password secure and only share it with trusted team members."
      }
    ]
  }
];
