// Zustand store for projects state management
import { create } from 'zustand';
import type { Project } from '@/types';
import * as api from '@/lib/api';

interface ProjectState {
  // State
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API Actions
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (data: { name: string; description?: string }) => Promise<Project | null>;
  updateProject: (id: string, data: Partial<{ name: string; description?: string }>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Helpers
  addProject: (project: Project) => void;
  updateProjectInList: (project: Project) => void;
  removeProject: (id: string) => void;
  clearError: () => void;
}

/**
 * Projects store for managing project state
 */
export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  /**
   * Set projects list
   */
  setProjects: (projects: Project[]) => {
    set({ projects });
  },

  /**
   * Set current active project
   */
  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  /**
   * Set loading state
   */
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  /**
   * Set error message
   */
  setError: (error: string | null) => {
    set({ error });
  },

  /**
   * Fetch all projects from API
   */
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getProjects();
      if (response.success && response.data) {
        set({ projects: response.data, isLoading: false });
      } else {
        set({ error: response.message || 'Failed to fetch projects', isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch projects',
        isLoading: false,
      });
    }
  },

  /**
   * Fetch single project by ID
   */
  fetchProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getProject(id);
      if (response.success && response.data) {
        set({ currentProject: response.data, isLoading: false });
      } else {
        set({ error: response.message || 'Failed to fetch project', isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch project',
        isLoading: false,
      });
    }
  },

  /**
   * Create new project
   */
  createProject: async (data: { name: string; description?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createProject(data);
      if (response.success && response.data) {
        const newProject = response.data;
        set((state) => ({
          projects: [...state.projects, newProject],
          isLoading: false,
        }));
        return newProject;
      } else {
        set({ error: response.message || 'Failed to create project', isLoading: false });
        return null;
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create project',
        isLoading: false,
      });
      return null;
    }
  },

  /**
   * Update existing project
   */
  updateProject: async (id: string, data: Partial<{ name: string; description?: string }>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.updateProject(id, data);
      if (response.success && response.data) {
        const updatedProject = response.data;
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
          currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject,
          isLoading: false,
        }));
      } else {
        set({ error: response.message || 'Failed to update project', isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update project',
        isLoading: false,
      });
    }
  },

  /**
   * Delete project
   */
  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.deleteProject(id);
      if (response.success) {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
          isLoading: false,
        }));
      } else {
        set({ error: response.message || 'Failed to delete project', isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete project',
        isLoading: false,
      });
    }
  },

  /**
   * Add project to list (helper for optimistic updates)
   */
  addProject: (project: Project) => {
    set((state) => ({
      projects: [...state.projects, project],
    }));
  },

  /**
   * Update project in list (helper for real-time updates)
   */
  updateProjectInList: (project: Project) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
      currentProject: state.currentProject?.id === project.id ? project : state.currentProject,
    }));
  },

  /**
   * Remove project from list (helper for real-time updates)
   */
  removeProject: (id: string) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}));

