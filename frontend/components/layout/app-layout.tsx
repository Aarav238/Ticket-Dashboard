"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useNotificationStore } from "@/store/notificationStore";
import { FloatingDock } from "@/components/ui/floating-dock";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import { SuperUserToggle } from "@/components/auth/super-user-toggle";
import { AceternityLoading } from "@/components/ui/aceternity-loading";
import { Tooltip } from "@/components/ui/tooltip";
import { 
  Home, 
  FolderKanban, 
  Bell, 
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { socketService } from "@/lib/socket";

/**
 * App Layout Component
 * Main layout wrapper for authenticated pages
 * Includes navigation dock, notifications, and super-user controls
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, logout, token, hasHydrated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { togglePanel } = useNotificationStore();

  // Connect to Socket.io on mount
  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [isAuthenticated, token]);

  // Redirect to login if not authenticated (wait for hydration)
  useEffect(() => {
    if (!hasHydrated) return; // Wait for store to rehydrate from localStorage
    
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, hasHydrated, router]);

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
      onClick: togglePanel,
    },
    {
      title: "Logout",
      icon: <LogOut className="h-full w-full text-red-500 dark:text-red-400" />,
      href: "#",
      onClick: handleLogout,
    },
  ];

  // Show loading while waiting for hydration
  if (!hasHydrated) {
    return <AceternityLoading />;
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top-right controls */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-3">
        {/* Super User Toggle */}
        <SuperUserToggle />

        {/* Dark mode toggle */}
        <Tooltip content={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"} position="bottom">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </Tooltip>
      </div>

      {/* Main content */}
      <main className="pb-24">{children}</main>

      {/* Notification panel */}
      <NotificationPanel />

      {/* Floating dock navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <FloatingDock items={navItems} />
      </div>
    </div>
  );
}

