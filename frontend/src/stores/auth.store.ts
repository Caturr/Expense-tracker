import { defineStore } from 'pinia';
import { authTokenKey } from '@/services/api-client';
import { getCurrentUser, login as loginRequest, register as registerRequest } from '@/services/auth.service';
import type { AuthUser, LoginPayload, RegisterPayload } from '@/services/auth.service';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem(authTokenKey),
    user: null,
    isLoading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(payload: LoginPayload) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await loginRequest(payload);
        this.setSession(response.accessToken, response.user);
      } catch {
        this.error = 'Invalid email or password.';
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async register(payload: RegisterPayload) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await registerRequest(payload);
        this.setSession(response.accessToken, response.user);
      } catch {
        this.error = 'Unable to register account.';
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchCurrentUser() {
      if (!this.token) {
        return null;
      }

      try {
        this.user = await getCurrentUser();
        return this.user;
      } catch {
        this.logout();
        return null;
      }
    },
    setSession(token: string, user: AuthUser) {
      this.token = token;
      this.user = user;
      localStorage.setItem(authTokenKey, token);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem(authTokenKey);
    },
  },
});
