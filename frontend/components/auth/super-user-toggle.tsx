"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { verifySuperUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { Shield, X, Eye, EyeOff } from "lucide-react";

/**
 * Super User Toggle Component
 * Toggle super-user mode with password verification
 */
export function SuperUserToggle() {
  const { isSuperUser, setSuperUser } = useAuthStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        setShowPassword(false);
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
      setShowPassword(false);
      setError("");
    }
  };

  return (
    <>
      {/* Toggle button */}
      <Tooltip 
        content={isSuperUser ? "Disable Super User Mode" : "Enable Super User Mode"} 
        position="bottom"
      >
        <button
          onClick={handleToggle}
          className={`p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border flex items-center gap-2 cursor-pointer ${
            isSuperUser
              ? "bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          }`}
          aria-label={isSuperUser ? "Disable Super User" : "Enable Super User"}
        >
          <Shield
            className={`h-5 w-5 ${
              isSuperUser ? "text-white" : "text-gray-700 dark:text-gray-300"
            }`}
          />
          {isSuperUser && (
            <span className="text-xs font-semibold text-white pr-1">
              Super User
            </span>
          )}
        </button>
      </Tooltip>

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
                <Tooltip content="Close" position="left">
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50 cursor-pointer"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </Tooltip>
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
                  type={showPassword ? "text" : "password"}
                  label="Super User Password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoFocus
                  rightIcon={
                    <Tooltip content={showPassword ? "Hide password" : "Show password"} position="left">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                        disabled={isLoading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    </Tooltip>
                  }
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

