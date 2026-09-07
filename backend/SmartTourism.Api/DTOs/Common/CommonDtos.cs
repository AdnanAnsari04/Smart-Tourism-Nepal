namespace SmartTourism.Api.DTOs.Common;

/// <summary>Standard paginated list envelope returned by every list endpoint.</summary>
public class PagedResult<T>
{
    public IReadOnlyList<T> Items { get; init; } = Array.Empty<T>();
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
    public int TotalPages => PageSize == 0 ? 0 : (int)Math.Ceiling(TotalCount / (double)PageSize);

    public static PagedResult<T> Create(IReadOnlyList<T> items, int page, int pageSize, int totalCount) => new()
    {
        Items = items,
        Page = page,
        PageSize = pageSize,
        TotalCount = totalCount
    };
}

/// <summary>Common paging/sorting query parameters shared by list endpoints.</summary>
public class PaginationQuery
{
    private const int MaxPageSize = 100;
    private int _pageSize = 12;

    public int Page { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value <= 0 ? 12 : Math.Min(value, MaxPageSize);
    }
}

/// <summary>Standard error payload returned by the global exception middleware.</summary>
public class ApiErrorResponse
{
    public string Message { get; init; } = string.Empty;
    public int StatusCode { get; init; }
    public string? TraceId { get; init; }
    public IDictionary<string, string[]>? Errors { get; init; }
}
