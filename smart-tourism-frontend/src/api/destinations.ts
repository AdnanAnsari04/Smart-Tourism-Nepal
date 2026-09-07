import { apiRequest, buildQueryString } from "./client";
import type { PagedResult } from "./types";

// Mirrors backend DTOs/Catalog/DestinationDtos.cs.

export interface DestinationListItem {
  id: number;
  slug: string;
  name: string;
  provinceName: string;
  district: string | null;
  cityId: number | null;
  cityName: string | null;
  categoryName: string;
  rating: number;
  reviewCount: number;
  distanceFromKathmanduKm: number;
  bestSeason: string | null;
  photoClass: string | null;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export interface DestinationDetail extends Omit<DestinationListItem, "provinceName" | "categoryName"> {
  description: string;
  provinceId: number;
  provinceName: string;
  categoryId: number;
  categoryName: string;
  entryInformation: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface DestinationFormValues {
  name: string;
  description: string;
  provinceId: number;
  district?: string | null;
  cityId?: number | null;
  categoryId: number;
  distanceFromKathmanduKm: number;
  bestSeason?: string | null;
  entryInformation?: string | null;
  photoClass?: string | null;
  imageUrl?: string | null;
  latitude: number;
  longitude: number;
  isActive?: boolean;
}

export interface DestinationQuery {
  provinceId?: number;
  cityId?: number;
  categoryId?: number;
  search?: string;
  minRating?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  includeInactive?: boolean;
  page?: number;
  pageSize?: number;
}

export function getDestinations(query: DestinationQuery): Promise<PagedResult<DestinationListItem>> {
  return apiRequest<PagedResult<DestinationListItem>>(`/destinations${buildQueryString(query)}`, {
    auth: query.includeInactive === true,
  });
}

export function getDestinationById(id: number): Promise<DestinationDetail> {
  return apiRequest<DestinationDetail>(`/destinations/${id}`);
}

export function createDestination(values: DestinationFormValues): Promise<DestinationDetail> {
  return apiRequest<DestinationDetail>("/destinations", { method: "POST", body: values, auth: true });
}

export function updateDestination(id: number, values: DestinationFormValues): Promise<DestinationDetail> {
  return apiRequest<DestinationDetail>(`/destinations/${id}`, { method: "PUT", body: values, auth: true });
}

export function deleteDestination(id: number): Promise<void> {
  return apiRequest<void>(`/destinations/${id}`, { method: "DELETE", auth: true });
}
