namespace SmartTourism.Api.DTOs.Engagement;

public record ReviewDto(
    Guid Id,
    int DestinationId,
    Guid UserId,
    string AuthorName,
    int Rating,
    string Comment,
    DateTime CreatedAt
);

public record ReviewCreateDto(
    int DestinationId,
    int Rating,
    string Comment
);

public record ReviewUpdateDto(
    int Rating,
    string Comment
);
