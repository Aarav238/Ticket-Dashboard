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
  hasHydrated: boolean; // Track if store has loaded from localStorage

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setSuperUser: (isSuperUser: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
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
      hasHydrated: false,

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
          hasHydrated: true, // Mark as hydrated since we're setting state manually
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

      /**
       * Mark store as hydrated from localStorage
       */
      setHasHydrated: (hasHydrated: boolean) => {
        set({ hasHydrated });
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
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated once localStorage data is loaded
        state?.setHasHydrated(true);
        
        // Reconnect Socket.io if token exists
        if (state?.token) {
          socketService.connect(state.token);
        }
      },
    }
  )
);

