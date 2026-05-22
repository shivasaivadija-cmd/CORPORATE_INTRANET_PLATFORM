import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { User } from '@intranet/types';
import { apiClient } from '@/lib/api-client';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  tenantId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  initialize: () => Promise<void>;
  login: (tenantId: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, user: User) => void;
  refreshToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set, get) => ({
      user: null,
      accessToken: null,
      tenantId: null,
      isLoading: false,
      isAuthenticated: false,

      initialize: async () => {
        // Don't set loading state, just check if we have a token
        const state = get();
        
        if (!state.accessToken) {
          return; // No token, nothing to do
        }
        
        // If we have a token, try to validate it quickly
        try {
          const userRes = await apiClient.get('/users/me');
          if (userRes?.data?.data) {
            set((s) => {
              s.user = userRes.data.data;
              s.tenantId = userRes.data.data.tenantId;
              s.isAuthenticated = true;
            });
          } else {
            // Invalid token, clear it
            set((s) => {
              s.user = null;
              s.accessToken = null;
              s.tenantId = null;
              s.isAuthenticated = false;
            });
          }
        } catch (error) {
          // Token invalid, clear everything
          set((s) => {
            s.user = null;
            s.accessToken = null;
            s.tenantId = null;
            s.isAuthenticated = false;
          });
        }
      },

      login: async (tenantId, email, password) => {
        const { data } = await apiClient.post('/auth/login', { tenantId, email, password });
        const { accessToken, ...userData } = data.data;

        set((s) => {
          s.accessToken = accessToken;
          s.tenantId = tenantId;
          s.user = userData as User;
          s.isAuthenticated = true;
        });
      },

      logout: async () => {
        try {
          await apiClient.post('/auth/logout');
        } finally {
          set((s) => {
            s.user = null;
            s.accessToken = null;
            s.tenantId = null;
            s.isAuthenticated = false;
          });
        }
      },

      setTokens: (accessToken, user) => {
        set((s) => {
          s.accessToken = accessToken;
          s.user = user;
          s.tenantId = user.tenantId;
          s.isAuthenticated = true;
        });
      },

      refreshToken: async () => {
        try {
          const { data } = await apiClient.post('/auth/refresh');
          
          if (!data?.data?.accessToken) {
            return false;
          }
          
          const { accessToken } = data.data;

          const userRes = await apiClient.get('/users/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          
          if (!userRes?.data?.data) {
            return false;
          }

          set((s) => {
            s.accessToken = accessToken;
            s.user = userRes.data.data;
            s.tenantId = userRes.data.data.tenantId;
            s.isAuthenticated = true;
          });
          return true;
        } catch (error) {
          console.error('Token refresh failed:', error);
          return false;
        }
      },
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        tenantId: state.tenantId,
        user: state.user,
      }),
    },
  ),
);
