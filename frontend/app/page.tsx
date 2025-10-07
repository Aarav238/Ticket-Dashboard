"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Spinner } from "@/components/ui/spinner";

/**
 * Home Page - Root route
 * Redirects authenticated users to projects page
 * Redirects unauthenticated users to login page
 */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/projects");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="h-12 w-12 text-blue-600" />
    </div>
  );
}
