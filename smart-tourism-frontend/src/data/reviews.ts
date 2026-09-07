import type { Review } from "../types/review";

// Stand-in for real data until the backend is connected. See FR-12.
// New reviews submitted via the DestinationDetail page are held in local
// component state only (no persistence) since this is a frontend-only phase.
export const reviews: Review[] = [
  { id: "r1", destinationId: "d7", authorName: "Sita R.", rating: 5, comment: "Durbar Square at sunset is unreal. Go early to beat the crowds.", date: "2026-05-12" },
  { id: "r2", destinationId: "d7", authorName: "Marcus T.", rating: 4, comment: "Beautiful architecture, but bring cash for the entry fee.", date: "2026-04-03" },
  { id: "r3", destinationId: "d16", authorName: "Anjali P.", rating: 5, comment: "Paragliding over Phewa Lake was the highlight of our whole trip.", date: "2026-06-20" },
  { id: "r4", destinationId: "d1", authorName: "Daniel K.", rating: 5, comment: "Hardest thing I've done, completely worth it. Hire a guide, don't go solo.", date: "2026-03-28" },
  { id: "r5", destinationId: "d11", authorName: "Priya S.", rating: 5, comment: "Boudhanath at dawn during the kora walk is deeply peaceful.", date: "2026-05-30" },
];
