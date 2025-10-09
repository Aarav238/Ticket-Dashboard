"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTicketStore } from "@/store/ticketStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { TicketPriority, TicketType } from "@/types";
import { getUsers } from "@/lib/api";
import { X } from "lucide-react";
import { socketService } from "@/lib/socket";

/**
 * Create Ticket Modal Component
 * Modal form for creating new tickets
 */
interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function CreateTicketModal({
  isOpen,
  onClose,
  projectId,
}: CreateTicketModalProps) {
  const { createTicket, isLoading } = useTicketStore();
  const { isSuperUser } = useAuthStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [type, setType] = useState<TicketType>(TicketType.TASK);
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);
  const [error, setError] = useState("");

  // Fetch users for assignment (only for super-users)
  useEffect(() => {
    if (isOpen && isSuperUser) {
      fetchUsers();
    }
  }, [isOpen, isSuperUser]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Ticket title is required");
      return;
    }

    const result = await createTicket({
      project_id: projectId,
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      type,
      assigned_to: assignedTo || undefined,
    });

    if (result) {
      // Emit Socket.io event for real-time updates
      socketService.emitTicketCreated(projectId, result);

      // Success - close modal and reset form
      resetForm();
      onClose();
    } else {
      setError("Failed to create ticket");
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority(TicketPriority.MEDIUM);
    setType(TicketType.TASK);
    setAssignedTo("");
    setError("");
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Ticket
              </h2>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              <Input
                label="Ticket Title"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  placeholder="Describe the ticket in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer disabled:cursor-not-allowed"
                    value={type}
                    onChange={(e) => setType(e.target.value as TicketType)}
                    disabled={isLoading}
                  >
                    <option value={TicketType.TASK}>Task</option>
                    <option value={TicketType.BUG}>Bug</option>
                    <option value={TicketType.FEATURE}>Feature</option>
                    <option value={TicketType.IMPROVEMENT}>Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer disabled:cursor-not-allowed"
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as TicketPriority)
                    }
                    disabled={isLoading}
                  >
                    <option value={TicketPriority.LOW}>Low</option>
                    <option value={TicketPriority.MEDIUM}>Medium</option>
                    <option value={TicketPriority.HIGH}>High</option>
                    <option value={TicketPriority.URGENT}>Urgent</option>
                  </select>
                </div>
              </div>

              {isSuperUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assign To
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer disabled:cursor-not-allowed"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  disabled={isLoading || !title.trim()}
                  className="flex-1"
                >
                  Create Ticket
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

