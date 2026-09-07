import { apiRequest, buildQueryString } from "./client";
import type { PagedResult } from "./types";

// Mirrors backend DTOs/Trekking/TrekkingDtos.cs. Uses the flat /api/trekking
// aliases (see TrekkingController's "flat aliases" section) rather than
// /api/trekking/routes — same data, shorter path.

export interface TrekkingRouteListItem {
  id: number;
  slug: string;
  name: string;
  regionName: string;
  provinceName: string;
  district: string | null;
  difficulty: string;
  minDurationDays: number;
  maxDurationDays: number;
  maxAltitudeMeters: number;
  rating: number;
  photoClass: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export interface TrekkingRouteDetail {
  id: number;
  slug: string;
  name: string;
  description: string;
  district: string | null;
  difficulty: string;
  minDurationDays: number;
  maxDurationDays: number;
  bestSeason: string;
  maxAltitudeMeters: number;
  startingPoint: string | null;
  endingPoint: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  trekkingRegionId: number;
  regionName: string;
  provinceId: number;
  provinceName: string;
  requiredPermits: string[];
  equipment: string[];
  photoClass: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface TrekkingRouteFormValues {
  name: string;
  description: string;
  district?: string | null;
  difficulty: "Easy" | "Moderate" | "Hard";
  minDurationDays: number;
  maxDurationDays: number;
  bestSeason: string;
  maxAltitudeMeters: number;
  startingPoint?: string | null;
  endingPoint?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  rating?: number;
  trekkingRegionId: number;
  requiredPermits: string[];
  equipment: string[];
  photoClass?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
}

export interface TrekkingRouteQuery {
  provinceId?: number;
  trekkingRegionId?: number;
  difficulty?: string;
  minDurationDays?: number;
  maxDurationDays?: number;
  minRating?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  includeInactive?: boolean;
  page?: number;
  pageSize?: number;
}

export function getTrekkingRoutes(query: TrekkingRouteQuery): Promise<PagedResult<TrekkingRouteListItem>> {
  return apiRequest<PagedResult<TrekkingRouteListItem>>(`/trekking${buildQueryString(query)}`, {
    auth: query.includeInactive === true,
  });
}

export function getTrekkingRouteById(id: number): Promise<TrekkingRouteDetail> {
  return apiRequest<TrekkingRouteDetail>(`/trekking/${id}`);
}

export function createTrekkingRoute(values: TrekkingRouteFormValues): Promise<TrekkingRouteDetail> {
  return apiRequest<TrekkingRouteDetail>("/trekking", { method: "POST", body: values, auth: true });
}

export function updateTrekkingRoute(id: number, values: TrekkingRouteFormValues): Promise<TrekkingRouteDetail> {
  return apiRequest<TrekkingRouteDetail>(`/trekking/${id}`, { method: "PUT", body: values, auth: true });
}

export function deleteTrekkingRoute(id: number): Promise<void> {
  return apiRequest<void>(`/trekking/${id}`, { method: "DELETE", auth: true });
}
