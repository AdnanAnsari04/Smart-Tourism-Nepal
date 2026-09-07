import { apiRequest, buildQueryString } from "./client";

export interface Province {
  id: number;
  slug: string;
  name: string;
  capital: string;
  description: string;
  cityCount: number;
  destinationCount: number;
}

export interface City {
  id: number;
  slug: string;
  name: string;
  district: string;
  description: string | null;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  provinceId: number;
  provinceName: string;
}

export interface Category {
  id: number;
  slug: string;
  label: string;
  icon: string | null;
}

export interface TrekkingRegion {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  provinceId: number;
  provinceName: string;
  routeCount: number;
}

export function getProvinces(): Promise<Province[]> {
  return apiRequest<Province[]>("/provinces");
}

export function getCities(provinceId?: number): Promise<City[]> {
  return apiRequest<City[]>(`/cities${buildQueryString({ provinceId })}`);
}

export function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/categories");
}

export function getTrekkingRegions(provinceId?: number): Promise<TrekkingRegion[]> {
  return apiRequest<TrekkingRegion[]>(`/trekking/regions${buildQueryString({ provinceId })}`);
}
