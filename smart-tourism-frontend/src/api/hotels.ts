import { apiRequest, buildQueryString } from "./client";
import type { PagedResult } from "./types";

// Mirrors backend DTOs/Catalog/HotelDtos.cs.

export interface HotelListItem {
  id: number;
  name: string;
  hotelType: string | null;
  destinationId: number | null;
  destinationName: string | null;
  provinceName: string;
  cityId: number | null;
  cityName: string | null;
  pricePerNightNpr: number;
  rating: number;
  availableRooms: number;
  amenities: string[];
  photoClass: string | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
}

export interface HotelDetail extends Omit<HotelListItem, "provinceName"> {
  description: string | null;
  address: string | null;
  provinceId: number;
  provinceName: string;
  reviewCount: number;
  contactPhone: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface HotelFormValues {
  name: string;
  description?: string | null;
  hotelType?: string | null;
  address?: string | null;
  destinationId?: number | null;
  cityId?: number | null;
  provinceId: number;
  pricePerNightNpr: number;
  rating?: number;
  availableRooms: number;
  amenities: string[];
  photoClass?: string | null;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contactPhone?: string | null;
  website?: string | null;
  isActive?: boolean;
}

export interface HotelQuery {
  provinceId?: number;
  cityId?: number;
  destinationId?: number;
  hotelType?: string;
  minPricePerNight?: number;
  maxPricePerNight?: number;
  minRating?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  includeInactive?: boolean;
  page?: number;
  pageSize?: number;
}

export function getHotels(query: HotelQuery): Promise<PagedResult<HotelListItem>> {
  return apiRequest<PagedResult<HotelListItem>>(`/hotels${buildQueryString(query)}`, {
    auth: query.includeInactive === true,
  });
}

export function getHotelById(id: number): Promise<HotelDetail> {
  return apiRequest<HotelDetail>(`/hotels/${id}`);
}

export function createHotel(values: HotelFormValues): Promise<HotelDetail> {
  return apiRequest<HotelDetail>("/hotels", { method: "POST", body: values, auth: true });
}

export function updateHotel(id: number, values: HotelFormValues): Promise<HotelDetail> {
  return apiRequest<HotelDetail>(`/hotels/${id}`, { method: "PUT", body: values, auth: true });
}

export function deleteHotel(id: number): Promise<void> {
  return apiRequest<void>(`/hotels/${id}`, { method: "DELETE", auth: true });
}
