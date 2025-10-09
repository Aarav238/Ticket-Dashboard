"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectStore } from "@/store/projectStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { X, Trash2 } from "lucide-react";
import type { Project } from "@/types";

/**
 * Edit Project Modal Component
 * Modal form for editing and deleting projects
 */
interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export function EditProjectModal({
  isOpen,
  onClose,
  project,
}: EditProjectModalProps) {
  const { updateProject, deleteProject, isLoading } = useProjectStore();
  const { isSuperUser } = useAuthStore();
  
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update form when project changes
  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
    }
  }, [project]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      await updateProject(project.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update project");
    }
  };

  /**
   * Handle project deletion
   */
  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete project");
      setShowDeleteConfirm(false);
    }
  };

  /**
   * Close modal and reset form
   */
  const handleClose = () => {
    if (!isLoading) {
      setName(project.name);
      setDescription(project.description || "");
      setError("");
      setShowDeleteConfirm(false);
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
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Project
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ID: {project.id.slice(0, 8)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isSuperUser && (
                  <Tooltip content="Delete Project" position="bottom">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isLoading}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </Tooltip>
                )}
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
            </div>

            {/* Delete confirmation */}
            {showDeleteConfirm && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800">
                <h4 className="text-red-800 dark:text-red-400 font-semibold mb-2">
                  Delete Project?
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  This will permanently delete this project and all its tickets. This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Yes, Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

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
                label="Project Name"
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                autoFocus
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  placeholder="What's this project about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>Created at: {new Date(project.created_at).toLocaleString()}</p>
                  <p>Updated at: {new Date(project.updated_at).toLocaleString()}</p>
                </div>
              </div>

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
                  disabled={isLoading || !name.trim()}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

