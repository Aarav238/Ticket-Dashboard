"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/store/projectStore";
import { useAuthStore } from "@/store/authStore";
import { AppLayout } from "@/components/layout/app-layout";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { Plus } from "lucide-react";

/**
 * Projects Page Component
 * Displays all projects with Aceternity hover effect cards
 * Allows creating new projects and managing super-user access
 */
export default function ProjectsPage() {
  const router = useRouter();
  const { projects, isLoading, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <AppLayout>
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8 mr-0 md:mr-44">
            <div>
              <TextGenerateEffect
                words="Your Projects"
                className="text-4xl font-bold mb-2"
              />
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.email}!
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              New Project
            </Button>
          </div>

          {/* Projects grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-12 w-12 text-blue-600" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-4 text-6xl">📁</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                No projects yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first project to get started
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10">
              {projects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                  hoveredIndex={hoveredIndex}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create project modal */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </AppLayout>
  );
}

