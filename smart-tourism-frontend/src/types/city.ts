// A city/town/hub that Destinations, Hotels, and TrekkingRoutes can be
// grouped under. This is what lets the UI do Province -> City -> Category
// -> Destination filtering instead of hardcoding per-city logic.
export interface City {
  id: string; // stable slug, e.g. "pokhara"
  name: string;
  provinceId: string; // Province.id
  district: string;
  description: string;
  lat: number;
  lng: number;
  imageUrl?: string;
}
