"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { verifySuperUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, X } from "lucide-react";

/**
 * Super User Toggle Component
 * Toggle super-user mode with password verification
 */
export function SuperUserToggle() {
  const { isSuperUser, setSuperUser } = useAuthStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handle toggling super-user mode
   */
  const handleToggle = () => {
    if (isSuperUser) {
      // Disable super-user mode
      setSuperUser(false);
    } else {
      // Open modal to verify password
      setIsModalOpen(true);
    }
  };

  /**
   * Handle password verification
   */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await verifySuperUser({ password });
      if (response.success && response.data?.isSuperUser) {
        setSuperUser(true);
        setIsModalOpen(false);
        setPassword("");
      } else {
        setError("Invalid super-user password");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid super-user password");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!isLoading) {
      setIsModalOpen(false);
      setPassword("");
      setError("");
    }
  };

  return (
    <>
      {/* Toggle button */}
      <Button
        variant={isSuperUser ? "primary" : "secondary"}
        onClick={handleToggle}
        className="flex items-center gap-2"
      >
        <Shield className={`h-4 w-4 ${isSuperUser ? "text-yellow-300" : ""}`} />
        {isSuperUser ? "Super User" : "Enable Super User"}
      </Button>

      {/* Password verification modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Super User Access
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Enter the super-user password to gain elevated privileges
              </p>

              {/* Form */}
              <form onSubmit={handleVerify} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                <Input
                  type="password"
                  label="Super User Password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoFocus
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={isLoading || !password}
                    className="flex-1"
                  >
                    Verify
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

