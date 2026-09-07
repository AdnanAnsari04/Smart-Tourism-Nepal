import { apiRequest, buildQueryString } from "./client";
import type { PagedResult } from "./types";

// Mirrors backend DTOs/Admin/AdminDtos.cs.

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalAdmins: number;
  totalDestinations: number;
  totalHotels: number;
  totalTrekkingRoutes: number;
  totalReviews: number;
  totalProvinces: number;
  totalCategories: number;
  newUsersLast7Days: number;
  newReviewsLast7Days: number;
  recentUsers: RecentUser[];
  recentActivity: RecentActivity[];
}

export interface RecentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface RecentActivity {
  id: string;
  userId: string;
  userFullName: string;
  activityType: string;
  description: string | null;
  createdAt: string;
}

export interface AdminUserListItem {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  country: string | null;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminUserDetail extends AdminUserListItem {
  updatedAt: string | null;
  reviewCount: number;
  favoriteCount: number;
}

export interface AdminUserQuery {
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>("/admin/dashboard", { auth: true });
}

export function getAdminUsers(query: AdminUserQuery): Promise<PagedResult<AdminUserListItem>> {
  return apiRequest<PagedResult<AdminUserListItem>>(`/admin/users${buildQueryString(query)}`, { auth: true });
}

export function getAdminUserById(id: string): Promise<AdminUserDetail> {
  return apiRequest<AdminUserDetail>(`/admin/users/${id}`, { auth: true });
}

export function updateUserStatus(id: string, isActive: boolean): Promise<AdminUserDetail> {
  return apiRequest<AdminUserDetail>(`/admin/users/${id}/status`, {
    method: "PUT",
    body: { isActive },
    auth: true,
  });
}

export function updateUserRole(id: string, role: string): Promise<AdminUserDetail> {
  return apiRequest<AdminUserDetail>(`/admin/users/${id}/role`, {
    method: "PUT",
    body: { role },
    auth: true,
  });
}

export function deleteAdminUser(id: string): Promise<void> {
  return apiRequest<void>(`/admin/users/${id}`, { method: "DELETE", auth: true });
}
