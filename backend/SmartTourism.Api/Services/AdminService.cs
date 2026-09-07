using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.Authorization;
using SmartTourism.Api.DTOs.Admin;
using SmartTourism.Api.DTOs.Common;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Models.Identity;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserActivityService _userActivityService;

    public AdminService(IUnitOfWork unitOfWork, IUserActivityService userActivityService)
    {
        _unitOfWork = unitOfWork;
        _userActivityService = userActivityService;
    }

    public async Task<DashboardStatsDto> GetDashboardAsync(CancellationToken ct = default)
    {
        var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);

        var totalUsers = await _unitOfWork.Users.Query().CountAsync(ct);
        var activeUsers = await _unitOfWork.Users.Query().CountAsync(u => u.IsActive, ct);
        var totalAdmins = await _unitOfWork.Users.Query().CountAsync(u => u.Role.Name == Roles.Admin, ct);
        var totalDestinations = await _unitOfWork.Destinations.Query().CountAsync(ct);
        var totalHotels = await _unitOfWork.Hotels.Query().CountAsync(ct);
        var totalTrekkingRoutes = await _unitOfWork.TrekkingRoutes.Query().CountAsync(ct);
        var totalReviews = await _unitOfWork.Reviews.Query().CountAsync(ct);
        var totalProvinces = await _unitOfWork.Provinces.Query().CountAsync(ct);
        var totalCategories = await _unitOfWork.Categories.Query().CountAsync(ct);
        var newUsersLast7Days = await _unitOfWork.Users.Query().CountAsync(u => u.CreatedAt >= sevenDaysAgo, ct);
        var newReviewsLast7Days = await _unitOfWork.Reviews.Query().CountAsync(r => r.CreatedAt >= sevenDaysAgo, ct);

        var recentUsers = await _unitOfWork.Users.Query()
            .OrderByDescending(u => u.CreatedAt)
            .Take(5)
            .Select(u => new RecentUserDto(u.Id, u.FullName, u.Email, u.Role.Name, u.IsActive, u.CreatedAt))
            .ToListAsync(ct);

        var recentActivity = await _unitOfWork.UserActivities.Query()
            .OrderByDescending(a => a.CreatedAt)
            .Take(10)
            .Select(a => new RecentActivityDto(a.Id, a.UserId, a.User.FullName, a.ActivityType.ToString(), a.Description, a.CreatedAt))
            .ToListAsync(ct);

        return new DashboardStatsDto(
            totalUsers, activeUsers, totalUsers - activeUsers, totalAdmins,
            totalDestinations, totalHotels, totalTrekkingRoutes, totalReviews,
            totalProvinces, totalCategories, newUsersLast7Days, newReviewsLast7Days,
            recentUsers, recentActivity);
    }

    public async Task<PagedResult<AdminUserListItemDto>> GetUsersAsync(AdminUserQuery query, CancellationToken ct = default)
    {
        var users = _unitOfWork.Users.Query();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            users = users.Where(u => EF.Functions.Like(u.FullName, $"%{term}%") || EF.Functions.Like(u.Email, $"%{term}%"));
        }

        if (!string.IsNullOrWhiteSpace(query.Role))
            users = users.Where(u => u.Role.Name == query.Role);

        if (query.IsActive.HasValue)
            users = users.Where(u => u.IsActive == query.IsActive.Value);

        var totalCount = await users.CountAsync(ct);

        var descending = !string.Equals(query.SortDir, "asc", StringComparison.OrdinalIgnoreCase);
        IOrderedQueryable<User> ordered = query.SortBy?.Trim().ToLowerInvariant() switch
        {
            "email" => descending ? users.OrderByDescending(u => u.Email) : users.OrderBy(u => u.Email),
            "newest" => descending ? users.OrderByDescending(u => u.CreatedAt) : users.OrderBy(u => u.CreatedAt),
            "lastlogin" => descending ? users.OrderByDescending(u => u.LastLoginAt) : users.OrderBy(u => u.LastLoginAt),
            _ => descending ? users.OrderByDescending(u => u.FullName) : users.OrderBy(u => u.FullName)
        };
        users = ordered.ThenBy(u => u.Email);

        var items = await users
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(u => new AdminUserListItemDto(
                u.Id, u.FullName, u.Email, u.PhoneNumber, u.Country, u.Role.Name,
                u.IsActive, u.IsEmailVerified, u.CreatedAt, u.LastLoginAt))
            .ToListAsync(ct);

        return PagedResult<AdminUserListItemDto>.Create(items, query.Page, query.PageSize, totalCount);
    }

    public async Task<AdminUserDetailDto> GetUserByIdAsync(Guid id, CancellationToken ct = default)
    {
        var user = await _unitOfWork.Users.Query()
            .Where(u => u.Id == id)
            .Select(u => new AdminUserDetailDto(
                u.Id, u.FullName, u.Email, u.PhoneNumber, u.Country, u.Role.Name,
                u.IsActive, u.IsEmailVerified, u.CreatedAt, u.UpdatedAt, u.LastLoginAt,
                u.Reviews.Count(r => r.IsActive), u.Favorites.Count))
            .FirstOrDefaultAsync(ct);

        return user ?? throw new NotFoundException("User", id);
    }

    public async Task<AdminUserDetailDto> UpdateUserStatusAsync(Guid targetUserId, Guid actingUserId, UpdateUserStatusDto dto, CancellationToken ct = default)
    {
        var user = await _unitOfWork.Users.Query(asNoTracking: false)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == targetUserId, ct)
            ?? throw new NotFoundException("User", targetUserId);

        if (!dto.IsActive)
        {
            if (targetUserId == actingUserId)
                throw new BadRequestException("You cannot deactivate your own account.");

            if (user.Role.Name == Roles.Admin)
            {
                var activeAdminCount = await _unitOfWork.Users.Query()
                    .CountAsync(u => u.Role.Name == Roles.Admin && u.IsActive, ct);

                if (activeAdminCount <= 1)
                    throw new BadRequestException("Cannot deactivate the last remaining active admin.");
            }
        }

        user.IsActive = dto.IsActive;
        await _unitOfWork.SaveChangesAsync(ct);

        await _userActivityService.LogAsync(
            targetUserId,
            UserActivityType.AccountStatusChanged,
            dto.IsActive ? "Account activated by an administrator" : "Account deactivated by an administrator",
            ct: ct);

        return await GetUserByIdAsync(targetUserId, ct);
    }

    public async Task<AdminUserDetailDto> UpdateUserRoleAsync(Guid targetUserId, Guid actingUserId, UpdateUserRoleDto dto, CancellationToken ct = default)
    {
        var user = await _unitOfWork.Users.Query(asNoTracking: false)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == targetUserId, ct)
            ?? throw new NotFoundException("User", targetUserId);

        var newRole = await _unitOfWork.Roles.FirstOrDefaultAsync(r => r.Name == dto.Role, ct)
            ?? throw new NotFoundException("Role", dto.Role);

        if (user.RoleId == newRole.Id)
        {
            return await GetUserByIdAsync(targetUserId, ct);
        }

        if (targetUserId == actingUserId && user.Role.Name == Roles.Admin && newRole.Name != Roles.Admin)
        {
            throw new BadRequestException("You cannot remove your own admin role.");
        }

        if (user.Role.Name == Roles.Admin && newRole.Name != Roles.Admin)
        {
            var activeAdminCount = await _unitOfWork.Users.Query()
                .CountAsync(u => u.Role.Name == Roles.Admin && u.IsActive, ct);

            if (activeAdminCount <= 1)
                throw new BadRequestException("Cannot change the role of the last remaining admin.");
        }

        user.RoleId = newRole.Id;
        await _unitOfWork.SaveChangesAsync(ct);

        await _userActivityService.LogAsync(
            targetUserId,
            UserActivityType.RoleChanged,
            $"Role changed to '{newRole.Name}' by an administrator",
            ct: ct);

        return await GetUserByIdAsync(targetUserId, ct);
    }

    public async Task DeleteUserAsync(Guid targetUserId, Guid actingUserId, CancellationToken ct = default)
    {
        if (targetUserId == actingUserId)
            throw new BadRequestException("You cannot delete your own account.");

        var user = await _unitOfWork.Users.Query(asNoTracking: false)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == targetUserId, ct)
            ?? throw new NotFoundException("User", targetUserId);

        if (user.Role.Name == Roles.Admin)
        {
            var adminCount = await _unitOfWork.Users.Query().CountAsync(u => u.Role.Name == Roles.Admin, ct);
            if (adminCount <= 1)
                throw new BadRequestException("Cannot delete the last remaining admin.");
        }

        // Reviews.UserId is a Restrict FK (see EngagementConfigurations): a
        // user who has left reviews can't be hard-deleted without orphaning
        // them. Deactivating instead preserves that history — this is the
        // common, safe outcome for "remove" on a user with real activity.
        var hasReviews = await _unitOfWork.Reviews.AnyAsync(r => r.UserId == targetUserId, ct);
        if (hasReviews)
        {
            user.IsActive = false;
            await _unitOfWork.SaveChangesAsync(ct);
            throw new ConflictException("This user has reviews on record, so they can't be permanently deleted. The account has been deactivated instead.");
        }

        _unitOfWork.Users.Remove(user);
        await _unitOfWork.SaveChangesAsync(ct);
    }
}
