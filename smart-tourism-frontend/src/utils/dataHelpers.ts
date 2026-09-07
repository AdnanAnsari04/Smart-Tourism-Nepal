// Province -> City -> Category -> Destination (and the Hotel / TrekkingRoute
// variants) filtering helpers. Nothing here is city-specific — the same
// functions work for Pokhara, Kathmandu, Ilam, or any city added later, so
// pages should call these instead of writing new per-city conditions.
import { destinations } from "../data/destinations";
import { hotels } from "../data/hotels";
import { treks } from "../data/treks";
import { cities, getCitiesByProvince } from "../data/cities";
import type { Destination } from "../types/destination";
import type { Hotel } from "../types/hotel";
import type { Trek } from "../types/trek";
import type { Category } from "../types/category";
import { categories } from "../data/categories";

export function getDestinationsByCity(cityId: string): Destination[] {
  return destinations.filter((d) => d.cityId === cityId);
}

export function getDestinationsByCityAndCategory(cityId: string, categoryId: string): Destination[] {
  return destinations.filter((d) => d.cityId === cityId && d.category === categoryId);
}

export function getDestinationsByProvince(provinceId: string): Destination[] {
  const cityIds = new Set(getCitiesByProvince(provinceId).map((c) => c.id));
  return destinations.filter((d) => d.cityId && cityIds.has(d.cityId));
}

// Only the categories actually present among a city's destinations, in the
// canonical order — this is what a "select a city, see relevant categories"
// dropdown should render instead of showing every category everywhere.
export function getCategoriesForCity(cityId: string): Category[] {
  const present = new Set(getDestinationsByCity(cityId).map((d) => d.category));
  return categories.filter((c) => present.has(c.id));
}

export function getHotelsByCity(cityId: string): Hotel[] {
  return hotels.filter((h) => h.cityId === cityId);
}

export function getHotelsByProvince(provinceId: string): Hotel[] {
  const cityIds = new Set(getCitiesByProvince(provinceId).map((c) => c.id));
  return hotels.filter((h) => h.cityId && cityIds.has(h.cityId));
}

export function getTreksByProvince(provinceId: string): Trek[] {
  return treks.filter((t) => t.provinceId === provinceId);
}

// Cities that currently have at least one destination, hotel, or trek —
// useful for a "browse by city" list that shouldn't show empty cities.
export function getCitiesWithContent() {
  const withDest = new Set(destinations.map((d) => d.cityId).filter(Boolean));
  const withHotel = new Set(hotels.map((h) => h.cityId).filter(Boolean));
  const withTrek = new Set(treks.map((t) => t.provinceId).filter(Boolean));
  return cities.filter((c) => withDest.has(c.id) || withHotel.has(c.id) || withTrek.has(c.provinceId));
}
