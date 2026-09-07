import type { Category } from "../types/category";

// This id must exactly match the `category` string stored on each
// Destination record. Add a category here first, then use the same
// string on destinations — every page (Destinations, Map, filters)
// reads from this one list.
export const categories: Category[] = [
  { id: "Nature", label: "Nature", icon: "🌿" },
  { id: "Trekking", label: "Trekking", icon: "🥾" },
  { id: "Adventure", label: "Adventure", icon: "🪂" },
  { id: "Heritage", label: "Heritage", icon: "🏛️" },
  { id: "Pilgrimage", label: "Religious", icon: "🛕" },
  { id: "Wildlife", label: "Wildlife", icon: "🐅" },
  { id: "City", label: "City", icon: "🏙️" },
  { id: "Lakes", label: "Lakes", icon: "🏞️" },
  { id: "Viewpoints", label: "Viewpoints", icon: "🌄" },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
