namespace SmartTourism.Api.DTOs.Trekking;

public record TrekkingRegionDto(
    int Id,
    string Slug,
    string Name,
    string? Description,
    int ProvinceId,
    string ProvinceName,
    int RouteCount
);

public record TrekkingRegionCreateDto(string Slug, string Name, string? Description, int ProvinceId);

public record TrekkingRouteListItemDto(
    int Id,
    string Slug,
    string Name,
    string RegionName,
    string ProvinceName,
    string? District,
    string Difficulty,
    int MinDurationDays,
    int MaxDurationDays,
    int MaxAltitudeMeters,
    decimal Rating,
    string? PhotoClass,
    string? ImageUrl,
    bool IsActive
);

public record TrekkingRouteDetailDto(
    int Id,
    string Slug,
    string Name,
    string Description,
    string? District,
    string Difficulty,
    int MinDurationDays,
    int MaxDurationDays,
    string BestSeason,
    int MaxAltitudeMeters,
    string? StartingPoint,
    string? EndingPoint,
    decimal? Latitude,
    decimal? Longitude,
    decimal Rating,
    int TrekkingRegionId,
    string RegionName,
    int ProvinceId,
    string ProvinceName,
    IReadOnlyList<string> RequiredPermits,
    IReadOnlyList<string> Equipment,
    string? PhotoClass,
    string? ImageUrl,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record TrekkingRouteCreateDto(
    string Name,
    string Description,
    string? District,
    string Difficulty, // "Easy" | "Moderate" | "Hard"
    int MinDurationDays,
    int MaxDurationDays,
    string BestSeason,
    int MaxAltitudeMeters,
    string? StartingPoint,
    string? EndingPoint,
    decimal? Latitude,
    decimal? Longitude,
    decimal Rating,
    int TrekkingRegionId,
    IReadOnlyList<string> RequiredPermits,
    IReadOnlyList<string> Equipment,
    string? PhotoClass,
    string? ImageUrl
);

public record TrekkingRouteUpdateDto(
    string Name,
    string Description,
    string? District,
    string Difficulty,
    int MinDurationDays,
    int MaxDurationDays,
    string BestSeason,
    int MaxAltitudeMeters,
    string? StartingPoint,
    string? EndingPoint,
    decimal? Latitude,
    decimal? Longitude,
    decimal Rating,
    IReadOnlyList<string> RequiredPermits,
    IReadOnlyList<string> Equipment,
    string? PhotoClass,
    string? ImageUrl,
    bool IsActive
);

/// <summary>Server-side search/filter/sort/paging for GET /api/trekking.
/// "SortBy" accepts: rating (default), difficulty, duration, altitude, name, newest.</summary>
public class TrekkingRouteQuery
{
    public int? ProvinceId { get; set; }
    public int? TrekkingRegionId { get; set; }
    public string? Difficulty { get; set; }
    public int? MinDurationDays { get; set; }
    public int? MaxDurationDays { get; set; }
    public decimal? MinRating { get; set; }
    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public string? SortDir { get; set; }
    public bool IncludeInactive { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}
