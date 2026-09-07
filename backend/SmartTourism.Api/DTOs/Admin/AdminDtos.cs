namespace SmartTourism.Api.DTOs.Admin;

public record DashboardStatsDto(
    int TotalUsers,
    int ActiveUsers,
    int InactiveUsers,
    int TotalAdmins,
    int TotalDestinations,
    int TotalHotels,
    int TotalTrekkingRoutes,
    int TotalReviews,
    int TotalProvinces,
    int TotalCategories,
    int NewUsersLast7Days,
    int NewReviewsLast7Days,
    IReadOnlyList<RecentUserDto> RecentUsers,
    IReadOnlyList<RecentActivityDto> RecentActivity
);

public record RecentUserDto(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    bool IsActive,
    DateTime CreatedAt
);

public record RecentActivityDto(
    Guid Id,
    Guid UserId,
    string UserFullName,
    string ActivityType,
    string? Description,
    DateTime CreatedAt
);

public record AdminUserListItemDto(
    Guid Id,
    string FullName,
    string Email,
    string? PhoneNumber,
    string? Country,
    string Role,
    bool IsActive,
    bool IsEmailVerified,
    DateTime CreatedAt,
    DateTime? LastLoginAt
);

public record AdminUserDetailDto(
    Guid Id,
    string FullName,
    string Email,
    string? PhoneNumber,
    string? Country,
    string Role,
    bool IsActive,
    bool IsEmailVerified,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime? LastLoginAt,
    int ReviewCount,
    int FavoriteCount
);

public record UpdateUserStatusDto(bool IsActive);

public record UpdateUserRoleDto(string Role);

/// <summary>Server-side search/filter/sort/paging for GET /api/admin/users.</summary>
public class AdminUserQuery
{
    public string? Search { get; set; } // matches name or email
    public string? Role { get; set; }
    public bool? IsActive { get; set; }
    public string? SortBy { get; set; } // name (default), email, newest, lastLogin
    public string? SortDir { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
