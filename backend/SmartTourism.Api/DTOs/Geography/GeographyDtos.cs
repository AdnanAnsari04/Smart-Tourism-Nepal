namespace SmartTourism.Api.DTOs.Geography;

public record ProvinceDto(
    int Id,
    string Slug,
    string Name,
    string Capital,
    string Description,
    int CityCount,
    int DestinationCount
);

public record CityDto(
    int Id,
    string Slug,
    string Name,
    string District,
    string? Description,
    decimal Latitude,
    decimal Longitude,
    string? ImageUrl,
    int ProvinceId,
    string ProvinceName
);

public record ProvinceCreateDto(string Slug, string Name, string Capital, string Description);
public record ProvinceUpdateDto(string Name, string Capital, string Description, bool IsActive);

public record CityCreateDto(
    string Slug,
    string Name,
    string District,
    string? Description,
    decimal Latitude,
    decimal Longitude,
    string? ImageUrl,
    int ProvinceId
);

public record CityUpdateDto(
    string Name,
    string District,
    string? Description,
    decimal Latitude,
    decimal Longitude,
    string? ImageUrl,
    bool IsActive
);
