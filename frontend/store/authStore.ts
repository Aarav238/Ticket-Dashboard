// Zustand store for authentication state management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { socketService } from '@/lib/socket';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isSuperUser: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setSuperUser: (isSuperUser: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
}

/**
 * Authentication store with persist middleware
 * Stores user, token, and super-user status in localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isSuperUser: false,
      isLoading: false,
      error: null,

      /**
       * Set current user
       */
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      /**
       * Set authentication token
       */
      setToken: (token: string) => {
        // Store token in localStorage for API client
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({ token, isAuthenticated: true });
        
        // Connect Socket.io with token
        socketService.connect(token);
      },

      /**
       * Set super-user status
       */
      setSuperUser: (isSuperUser: boolean) => {
        set({ isSuperUser });
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
       * Login user with token
       */
      login: (user: User, token: string) => {
        // Store token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });

        // Connect Socket.io with token
        socketService.connect(token);
      },

      /**
       * Logout user and clear all data
       */
      logout: () => {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }

        // Disconnect Socket.io
        socketService.disconnect();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isSuperUser: false,
          error: null,
        });
      },

      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isSuperUser: state.isSuperUser,
      }),
    }
  )
);

