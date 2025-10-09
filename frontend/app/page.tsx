"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { AceternityLoading } from "@/components/ui/aceternity-loading";

/**
 * Home Page - Root route
 * Redirects authenticated users to projects page
 * Redirects unauthenticated users to login page
 * Waits for Zustand to rehydrate from localStorage before redirecting
 */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for store to rehydrate from localStorage
    if (!hasHydrated) return;

    // Redirect based on auth status
    if (isAuthenticated) {
      router.push("/projects");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, hasHydrated, router]);

  // Show loading screen while waiting for hydration
  return <AceternityLoading />;
}
