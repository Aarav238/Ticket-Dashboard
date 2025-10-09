"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Tooltip } from "@/components/ui/tooltip";
import { Edit, FolderOpen } from "lucide-react";
import type { Project } from "@/types";
import { EditProjectModal } from "./edit-project-modal";

interface ProjectCardProps {
  project: Project;
  hoveredIndex: number | null;
  index: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function ProjectCard({
  project,
  hoveredIndex,
  index,
  onMouseEnter,
  onMouseLeave,
}: ProjectCardProps) {
  const router = useRouter();
  const { isSuperUser } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the edit button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/projects/${project.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div
        className="relative group block p-2 h-full w-full cursor-pointer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleCardClick}
      >
        {hoveredIndex === index && (
          <motion.span
            className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
        
        <div className="rounded-2xl h-full w-full p-4 overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/[0.2] group-hover:border-slate-400 dark:group-hover:border-slate-600 relative z-20 transition-colors duration-200">
          <div className="relative z-50">
            <div className="p-4">
              {/* Header with icon and edit button */}
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                {isSuperUser && (
                  <Tooltip content="Edit Project" position="left">
                    <button
                      onClick={handleEditClick}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </Tooltip>
                )}
              </div>

              {/* Project name */}
              <h4 className="text-gray-900 dark:text-zinc-100 font-bold tracking-wide mt-4">
                {project.name}
              </h4>

              {/* Project description */}
              <p className="mt-8 text-gray-600 dark:text-zinc-400 tracking-wide leading-relaxed text-sm line-clamp-3">
                {project.description || "No description provided"}
              </p>

              {/* Footer metadata */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
      />
    </>
  );
}

