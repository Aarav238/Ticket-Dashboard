"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { FloatingDock } from "@/components/ui/floating-dock";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import { 
  Home, 
  FolderKanban, 
  Bell, 
  User, 
  LogOut,
  Shield
} from "lucide-react";
import { socketService } from "@/lib/socket";

/**
 * App Layout Component
 * Main layout wrapper for authenticated pages
 * Includes navigation dock, notifications, and super-user controls
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, logout, token, isSuperUser } = useAuthStore();

  // Connect to Socket.io on mount
  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [isAuthenticated, token]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Navigation items for floating dock
  const navItems = [
    {
      title: "Home",
      icon: <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/",
    },
    {
      title: "Projects",
      icon: <FolderKanban className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/projects",
    },
    {
      title: "Notifications",
      icon: <Bell className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "Profile",
      icon: <User className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "Logout",
      icon: <LogOut className="h-full w-full text-red-500 dark:text-red-400" />,
      href: "#",
    },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Super-user indicator */}
      {isSuperUser && (
        <div className="fixed top-4 right-4 z-50 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center gap-2 shadow-lg">
          <Shield className="h-4 w-4 text-white" />
          <span className="text-xs font-semibold text-white">Super User</span>
        </div>
      )}

      {/* Main content */}
      <main className="pb-24">{children}</main>

      {/* Notification panel */}
      <NotificationPanel />

      {/* Floating dock navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={navItems} />
      </div>
    </div>
  );
}

