// Shape of a single trek, matching FR-07's expected outputs
// (Trek Route, Difficulty, Duration, Required Permits, Best Season, Equipment List).
export interface Trek {
  id: string;
  name: string;
  region: string;
  provinceId?: string; // Province.id — enables Province -> Region -> TrekkingRoute lookups
  difficulty: "Easy" | "Moderate" | "Hard";
  durationDays: string; // e.g. "7-10"
  bestSeason: string;
  maxAltitudeM: number;
  requiredPermits: string[];
  equipment: string[];
  description: string;
  photoClass: string;
  imageUrl?: string; // real photo from Wikimedia Commons; falls back to photoClass gradient when absent
}
