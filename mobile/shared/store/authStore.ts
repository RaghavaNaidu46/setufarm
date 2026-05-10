import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';

interface User {
  id: string;
  name: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'driver';
  language: 'telugu' | 'hindi' | 'english';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string, role: string) => Promise<void>;

  setUser: (user: User | null) => void;
  logout: () => Promise<void>;

  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  sendOTP: async (email) => {
    await apiClient.post('/auth/send-otp', { email });
  },

  verifyOTP: async (email, otp, role) => {
    const { data } = await apiClient.post('/auth/verify-otp', { email, otp, role });

    await SecureStore.setItemAsync('auth_token', data.access_token);
    await SecureStore.setItemAsync('user', JSON.stringify(data.user));
    set({ token: data.access_token, user: data.user });
  },

  setUser: (user) => set({ user }),

  logout: async () => {

    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user');
    set({ user: null, token: null });
  },

  loadStoredAuth: async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    const userStr = await SecureStore.getItemAsync('user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) });
    }
  },
}));
