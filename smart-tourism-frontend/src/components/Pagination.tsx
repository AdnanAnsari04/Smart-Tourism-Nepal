interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

// Simple prev/next + page-number pagination shared by every admin list tab.
// Deliberately plain (no ellipsis/jump-to-page) — admin datasets here are
// small enough that a straightforward strip of page numbers is enough.
export default function Pagination({ page, totalPages, totalCount, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="admin-pagination">
      <span className="admin-pagination-count">{totalCount} total</span>
      <div className="admin-pagination-controls">
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </button>

        {pageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            className={`admin-pagination-btn ${n === page ? "active" : ""}`}
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          className="admin-pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
