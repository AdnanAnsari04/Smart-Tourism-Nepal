using SmartTourism.Api.DTOs.Admin;
using SmartTourism.Api.DTOs.Auth;
using SmartTourism.Api.DTOs.Catalog;
using SmartTourism.Api.DTOs.Common;
using SmartTourism.Api.DTOs.Engagement;
using SmartTourism.Api.DTOs.Geography;
using SmartTourism.Api.DTOs.Trekking;
using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Models.Identity;

namespace SmartTourism.Api.Services.Interfaces;

public interface IAdminService
{
    Task<DashboardStatsDto> GetDashboardAsync(CancellationToken ct = default);
    Task<PagedResult<AdminUserListItemDto>> GetUsersAsync(AdminUserQuery query, CancellationToken ct = default);
    Task<AdminUserDetailDto> GetUserByIdAsync(Guid id, CancellationToken ct = default);
    Task<AdminUserDetailDto> UpdateUserStatusAsync(Guid targetUserId, Guid actingUserId, UpdateUserStatusDto dto, CancellationToken ct = default);
    Task<AdminUserDetailDto> UpdateUserRoleAsync(Guid targetUserId, Guid actingUserId, UpdateUserRoleDto dto, CancellationToken ct = default);
    Task DeleteUserAsync(Guid targetUserId, Guid actingUserId, CancellationToken ct = default);
}

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, string? ipAddress, CancellationToken ct = default);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string? ipAddress, CancellationToken ct = default);

    /// <summary>Verifies a Google ID token server-side (signature, audience,
    /// expiry — all checked against Google's own public keys), then either
    /// logs in the linked account, links Google to an existing
    /// email-matched account, or creates a brand-new Tourist account.
    /// Returns the same token pair shape as a normal login.</summary>
    Task<AuthResponseDto> GoogleLoginAsync(string idToken, string? ipAddress, CancellationToken ct = default);

    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default);
    Task RevokeTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default);

    /// <summary>Full logout: blacklists the access token identified by
    /// <paramref name="accessTokenJti"/> (so it can't be reused even though it
    /// hasn't naturally expired yet) and, if provided, revokes
    /// <paramref name="refreshToken"/> for this session.</summary>
    Task LogoutAsync(Guid userId, string accessTokenJti, DateTime accessTokenExpiresAt, string? refreshToken, string? ipAddress, CancellationToken ct = default);

    Task ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request, CancellationToken ct = default);
    Task<UserDto> GetCurrentUserAsync(Guid userId, CancellationToken ct = default);
    Task<UserDto> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto request, CancellationToken ct = default);
}

public interface ITokenService
{
    (string token, DateTime expiresAt) GenerateAccessToken(User user);
    (string token, DateTime expiresAt) GenerateRefreshToken();
}

/// <summary>Reads the authenticated user's identity out of the current HTTP context.</summary>
public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Email { get; }
    string? Role { get; }
    bool IsAuthenticated { get; }
    string? IpAddress { get; }
}

public interface IProvinceService
{
    Task<IReadOnlyList<ProvinceDto>> GetAllAsync(CancellationToken ct = default);
    Task<ProvinceDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ProvinceDto> CreateAsync(ProvinceCreateDto dto, CancellationToken ct = default);
    Task<ProvinceDto> UpdateAsync(int id, ProvinceUpdateDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}

public interface ICityService
{
    Task<IReadOnlyList<CityDto>> GetAllAsync(int? provinceId, CancellationToken ct = default);
    Task<CityDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<CityDto> CreateAsync(CityCreateDto dto, CancellationToken ct = default);
    Task<CityDto> UpdateAsync(int id, CityUpdateDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}

public interface ICategoryService
{
    Task<IReadOnlyList<CategoryDto>> GetAllAsync(CancellationToken ct = default);
    Task<CategoryDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<CategoryDto> CreateAsync(CategoryCreateDto dto, CancellationToken ct = default);
    Task<CategoryDto> UpdateAsync(int id, CategoryUpdateDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}

public interface IDestinationService
{
    Task<PagedResult<DestinationListItemDto>> GetAllAsync(DestinationQuery query, CancellationToken ct = default);
    Task<DestinationDetailDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<DestinationDetailDto> CreateAsync(DestinationCreateDto dto, CancellationToken ct = default);
    Task<DestinationDetailDto> UpdateAsync(int id, DestinationUpdateDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}

public interface IHotelService
{
    Task<PagedResult<HotelListItemDto>> GetAllAsync(HotelQuery query, CancellationToken ct = default);
    Task<HotelDetailDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<HotelDetailDto> CreateAsync(HotelCreateDto dto, CancellationToken ct = default);
    Task<HotelDetailDto> UpdateAsync(int id, HotelUpdateDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}

public interface ITrekkingService
{
    Task<IReadOnlyList<TrekkingRegionDto>> GetRegionsAsync(int? provinceId, CancellationToken ct = default);
    Task<TrekkingRegionDto> CreateRegionAsync(TrekkingRegionCreateDto dto, CancellationToken ct = default);

    Task<PagedResult<TrekkingRouteListItemDto>> GetRoutesAsync(TrekkingRouteQuery query, CancellationToken ct = default);
    Task<TrekkingRouteDetailDto> GetRouteByIdAsync(int id, CancellationToken ct = default);
    Task<TrekkingRouteDetailDto> CreateRouteAsync(TrekkingRouteCreateDto dto, CancellationToken ct = default);
    Task<TrekkingRouteDetailDto> UpdateRouteAsync(int id, TrekkingRouteUpdateDto dto, CancellationToken ct = default);
    Task DeleteRouteAsync(int id, CancellationToken ct = default);
}

public interface IReviewService
{
    Task<IReadOnlyList<ReviewDto>> GetByDestinationAsync(int destinationId, CancellationToken ct = default);
    Task<ReviewDto> CreateAsync(Guid userId, ReviewCreateDto dto, CancellationToken ct = default);
    Task<ReviewDto> UpdateAsync(Guid userId, Guid reviewId, ReviewUpdateDto dto, CancellationToken ct = default);
    Task DeleteAsync(Guid userId, Guid reviewId, bool isAdmin, CancellationToken ct = default);
}

public interface IFavoriteService
{
    Task<IReadOnlyList<FavoriteDto>> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<FavoriteDto> AddAsync(Guid userId, FavoriteCreateDto dto, CancellationToken ct = default);
    Task RemoveAsync(Guid userId, Guid favoriteId, CancellationToken ct = default);
}

public interface IUserActivityService
{
    Task LogAsync(Guid userId, UserActivityType type, string? description = null, string? metadataJson = null, CancellationToken ct = default);
}
