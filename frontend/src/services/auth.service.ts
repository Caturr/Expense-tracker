import { apiClient } from './api-client';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name?: string;
}

export function login(payload: LoginPayload) {
  return apiClient.post<AuthResponse>('/auth/login', payload);
}

export function register(payload: RegisterPayload) {
  return apiClient.post<AuthResponse>('/auth/register', payload);
}

export function getCurrentUser() {
  return apiClient.get<AuthUser>('/auth/me');
}
