import { apiRequest } from "./client";

// Mirrors backend RegisterRequestDto (DTOs/Auth/AuthDtos.cs).
export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  country: string;
}

// Mirrors backend LoginRequestDto.
export interface LoginPayload {
  email: string;
  password: string;
}

// Mirrors backend UserDto.
export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  country: string | null;
  role: string; // "Admin" | "Tourist"
  isEmailVerified: boolean;
  createdAt: string;
}

// Mirrors backend AuthResponseDto.
export interface AuthResponse {
  user: ApiUser;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", { method: "POST", body: payload });
}

export function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", { method: "POST", body: payload });
}

export function googleLoginRequest(idToken: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/google-login", { method: "POST", body: { idToken } });
}

export function meRequest(): Promise<ApiUser> {
  return apiRequest<ApiUser>("/auth/me", { method: "GET", auth: true });
}

export function revokeRequest(refreshToken: string): Promise<void> {
  return apiRequest<void>("/auth/revoke", { method: "POST", body: { refreshToken } });
}
