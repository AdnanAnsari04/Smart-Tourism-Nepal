// Shape of a single destination, matching FR-05's expected outputs
// (Destination List, Images, Ratings, Distance, Category).
export interface Destination {
  id: string;
  name: string;
  province: string;
  cityId?: string; // City.id — links into the Province -> City -> Category -> Destination hierarchy
  category: string;
  rating: number;       // out of 5
  distanceKm: number;   // distance from Kathmandu, for demo purposes
  description: string;
  photoClass: string;   // which CSS gradient to use as a placeholder image
  imageUrl?: string;    // optional real photo; falls back to photoClass gradient when absent
  lat: number;           // for the Interactive Tourism Map (FR/scope: GIS-based location services)
  lng: number;
}