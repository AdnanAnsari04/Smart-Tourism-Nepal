// Shape of a single hotel, matching FR-06's expected outputs
// (Recommended Hotels, Hotel Ratings, Estimated Cost, Availability).
export interface Hotel {
  id: string;
  name: string;
  destinationId: string; // links to a Destination
  destinationName: string;
  province: string;
  cityId?: string; // City.id — enables Province -> City -> Hotels lookups
  pricePerNight: number; // NPR
  rating: number; // out of 5
  amenities: string[];
  availableRooms: number;
  photoClass: string;
  // Photo of the hotel's destination/area, not the specific property.
  // We can't verify individual hotel exterior photos for names in this
  // mock dataset, so this represents "the area" honestly rather than
  // claiming to show the actual building. Falls back to the gradient
  // in photoClass when absent.
  imageUrl?: string;
}
