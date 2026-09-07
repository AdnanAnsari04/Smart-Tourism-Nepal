namespace SmartTourism.Api.DTOs.Catalog;

public record DestinationListItemDto(
    int Id,
    string Slug,
    string Name,
    string ProvinceName,
    string? District,
    int? CityId,
    string? CityName,
    string CategoryName,
    decimal Rating,
    int ReviewCount,
    decimal DistanceFromKathmanduKm,
    string? BestSeason,
    string? PhotoClass,
    string? ImageUrl,
    decimal Latitude,
    decimal Longitude,
    bool IsActive
);

public record DestinationDetailDto(
    int Id,
    string Slug,
    string Name,
    string Description,
    int ProvinceId,
    string ProvinceName,
    string? District,
    int? CityId,
    string? CityName,
    int CategoryId,
    string CategoryName,
    decimal Rating,
    int ReviewCount,
    decimal DistanceFromKathmanduKm,
    string? BestSeason,
    string? EntryInformation,
    string? PhotoClass,
    string? ImageUrl,
    decimal Latitude,
    decimal Longitude,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record DestinationCreateDto(
    string Name,
    string Description,
    int ProvinceId,
    string? District,
    int? CityId,
    int CategoryId,
    decimal DistanceFromKathmanduKm,
    string? BestSeason,
    string? EntryInformation,
    string? PhotoClass,
    string? ImageUrl,
    decimal Latitude,
    decimal Longitude
);

public record DestinationUpdateDto(
    string Name,
    string Description,
    string? District,
    int? CityId,
    int CategoryId,
    decimal DistanceFromKathmanduKm,
    string? BestSeason,
    string? EntryInformation,
    string? PhotoClass,
    string? ImageUrl,
    decimal Latitude,
    decimal Longitude,
    bool IsActive
);

/// <summary>Server-side search/filter/sort/paging for GET /api/destinations.
/// "SortBy" accepts: rating (default), name, distance, newest.
/// "IncludeInactive" is only honored by the controller when the caller is an
/// authenticated Admin — anonymous/regular-user requests always see active
/// destinations only, regardless of what they pass here.</summary>
public class DestinationQuery
{
    public int? ProvinceId { get; set; }
    public int? CityId { get; set; }
    public int? CategoryId { get; set; }
    public string? Search { get; set; }
    public decimal? MinRating { get; set; }
    public string? SortBy { get; set; }
    public string? SortDir { get; set; } // "asc" | "desc"
    public bool IncludeInactive { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}
