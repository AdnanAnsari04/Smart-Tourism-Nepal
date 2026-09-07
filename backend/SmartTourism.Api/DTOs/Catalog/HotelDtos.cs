namespace SmartTourism.Api.DTOs.Catalog;

public record HotelListItemDto(
    int Id,
    string Name,
    string? HotelType,
    int? DestinationId,
    string? DestinationName,
    string ProvinceName,
    int? CityId,
    string? CityName,
    decimal PricePerNightNpr,
    decimal Rating,
    int AvailableRooms,
    IReadOnlyList<string> Amenities,
    string? PhotoClass,
    string? ImageUrl,
    decimal? Latitude,
    decimal? Longitude,
    bool IsActive
);

public record HotelDetailDto(
    int Id,
    string Name,
    string? Description,
    string? HotelType,
    string? Address,
    int? DestinationId,
    string? DestinationName,
    int ProvinceId,
    string ProvinceName,
    int? CityId,
    string? CityName,
    decimal PricePerNightNpr,
    decimal Rating,
    int ReviewCount,
    int AvailableRooms,
    IReadOnlyList<string> Amenities,
    string? PhotoClass,
    string? ImageUrl,
    decimal? Latitude,
    decimal? Longitude,
    string? ContactPhone,
    string? Website,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record HotelCreateDto(
    string Name,
    string? Description,
    string? HotelType,
    string? Address,
    int? DestinationId,
    int? CityId,
    int ProvinceId,
    decimal PricePerNightNpr,
    decimal Rating,
    int AvailableRooms,
    IReadOnlyList<string> Amenities,
    string? PhotoClass,
    string? ImageUrl,
    decimal? Latitude,
    decimal? Longitude,
    string? ContactPhone,
    string? Website
);

public record HotelUpdateDto(
    string Name,
    string? Description,
    string? HotelType,
    string? Address,
    int? DestinationId,
    int? CityId,
    decimal PricePerNightNpr,
    decimal Rating,
    int AvailableRooms,
    IReadOnlyList<string> Amenities,
    string? PhotoClass,
    string? ImageUrl,
    decimal? Latitude,
    decimal? Longitude,
    string? ContactPhone,
    string? Website,
    bool IsActive
);

/// <summary>Server-side search/filter/sort/paging for GET /api/hotels.
/// "SortBy" accepts: rating (default), price, name, newest.</summary>
public class HotelQuery
{
    public int? ProvinceId { get; set; }
    public int? CityId { get; set; }
    public int? DestinationId { get; set; }
    public string? HotelType { get; set; }
    public decimal? MinPricePerNight { get; set; }
    public decimal? MaxPricePerNight { get; set; }
    public decimal? MinRating { get; set; }
    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public string? SortDir { get; set; }
    public bool IncludeInactive { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}
