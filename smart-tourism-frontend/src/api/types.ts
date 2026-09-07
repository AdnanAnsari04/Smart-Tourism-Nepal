// Mirrors backend DTOs/Common/CommonDtos.cs's PagedResult<T>, returned by
// every paginated list endpoint (destinations, hotels, trekking, admin users).
export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
