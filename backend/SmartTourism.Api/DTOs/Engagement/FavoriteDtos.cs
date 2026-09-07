namespace SmartTourism.Api.DTOs.Engagement;

public record FavoriteDto(
    Guid Id,
    string ItemType, // "Destination" | "Hotel" | "TrekkingRoute"
    int ItemId,
    string ItemName,
    string? ImageUrl,
    DateTime CreatedAt
);

public record FavoriteCreateDto(
    string ItemType,
    int ItemId
);
