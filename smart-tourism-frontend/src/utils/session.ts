import type { ApiUser } from "../api/auth";

export type UserRole = "tourist" | "admin";

const ROLE_KEY = "yatra.session.role";
const NAME_KEY = "userName";
const ACCESS_TOKEN_KEY = "yatra.session.accessToken";
const REFRESH_TOKEN_KEY = "yatra.session.refreshToken";
const USER_ID_KEY = "yatra.session.userId";

// Historical mock helper, kept only for any leftover demo flows (e.g. the
// simulated Google sign-in button, which has no real backend endpoint yet).
// Real email/password login no longer uses this — the role now comes from
// the backend's own AuthResponseDto.user.role instead of being guessed from
// the email address.
const MOCK_ADMIN_EMAILS = ["admin@yatra.com", "admin@example.com"];

export function resolveRoleForEmail(email: string): UserRole {
  return MOCK_ADMIN_EMAILS.includes(email.trim().toLowerCase()) ? "admin" : "tourist";
}

/** Converts the backend's "Admin" / "Tourist" role name to this app's lowercase UserRole. */
export function apiRoleToUserRole(apiRole: string): UserRole {
  return apiRole.trim().toLowerCase() === "admin" ? "admin" : "tourist";
}

export function setSession(role: UserRole, name: string) {
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(NAME_KEY, name);
}

/** Stores a real backend auth result: role, display name, tokens, and user id. */
export function setApiSession(user: ApiUser, accessToken: string, refreshToken: string) {
  localStorage.setItem(ROLE_KEY, apiRoleToUserRole(user.role));
  localStorage.setItem(NAME_KEY, user.fullName);
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_ID_KEY, user.id);
}

export function getRole(): UserRole | null {
  const value = localStorage.getItem(ROLE_KEY);
  return value === "tourist" || value === "admin" ? value : null;
}

export function getDisplayName(): string {
  return localStorage.getItem(NAME_KEY) || "";
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function clearSession() {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function isLoggedIn(): boolean {
  return getRole() !== null;
}
