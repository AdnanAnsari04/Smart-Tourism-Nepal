// Shape of a single review, matching FR-12's expected outputs
// (Review Submission, Average Rating, User Feedback).
export interface Review {
  id: string;
  destinationId: string;
  authorName: string;
  rating: number; // 1-5, whole numbers only per VR-12
  comment: string;
  date: string; // ISO date string
}
