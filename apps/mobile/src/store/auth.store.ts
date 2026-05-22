import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../lib/api-client';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (tenantId: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  initialize: async () => {
    const token = await SecureStore.getItemAsync('access_token');
    if (!token) return;
    try {
      const { data } = await apiClient.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: data.data, accessToken: token, isAuthenticated: true });
    } catch {
      await SecureStore.deleteItemAsync('access_token');
    }
  },

  login: async (tenantId, email, password) => {
    const { data } = await apiClient.post('/auth/login', { tenantId, email, password });
    const { accessToken, userId } = data.data;
    await SecureStore.setItemAsync('access_token', accessToken);
    const userRes = await apiClient.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    set({ user: userRes.data.data, accessToken, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('access_token');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
