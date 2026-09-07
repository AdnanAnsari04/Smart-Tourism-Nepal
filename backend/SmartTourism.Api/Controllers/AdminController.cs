using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTourism.Api.Authorization;
using SmartTourism.Api.DTOs.Admin;
using SmartTourism.Api.DTOs.Common;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Controllers;

/// <summary>Admin-only dashboard and user-management APIs. Every action here
/// requires the Admin role — a regular authenticated user gets 403
/// Forbidden, not 401, since [Authorize(Roles=...)] on an already-authenticated
/// request that lacks the role is a forbidden-not-unauthenticated outcome.</summary>
[ApiController]
[Route("api/admin")]
[Authorize(Roles = Roles.Admin)]
[Produces("application/json")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly ICurrentUserService _currentUserService;

    public AdminController(IAdminService adminService, ICurrentUserService currentUserService)
    {
        _adminService = adminService;
        _currentUserService = currentUserService;
    }

    /// <summary>Platform-wide counts, recent users, and recent activity.</summary>
    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(DashboardStatsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboard(CancellationToken ct)
        => Ok(await _adminService.GetDashboardAsync(ct));

    /// <summary>List/search users with paging, role, and active-status filters.</summary>
    [HttpGet("users")]
    [ProducesResponseType(typeof(PagedResult<AdminUserListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<AdminUserListItemDto>>> GetUsers([FromQuery] AdminUserQuery query, CancellationToken ct)
        => Ok(await _adminService.GetUsersAsync(query, ct));

    /// <summary>Get one user's full admin-facing profile.</summary>
    [HttpGet("users/{id:guid}")]
    [ProducesResponseType(typeof(AdminUserDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdminUserDetailDto>> GetUserById(Guid id, CancellationToken ct)
        => Ok(await _adminService.GetUserByIdAsync(id, ct));

    /// <summary>Activate or deactivate a user's account.</summary>
    [HttpPut("users/{id:guid}/status")]
    [ProducesResponseType(typeof(AdminUserDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AdminUserDetailDto>> UpdateStatus(Guid id, [FromBody] UpdateUserStatusDto dto, CancellationToken ct)
        => Ok(await _adminService.UpdateUserStatusAsync(id, _currentUserService.UserId!.Value, dto, ct));

    /// <summary>Change a user's role. The target role must already exist
    /// (see the Roles table) — no free-text role is ever trusted as-is.</summary>
    [HttpPut("users/{id:guid}/role")]
    [ProducesResponseType(typeof(AdminUserDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdminUserDetailDto>> UpdateRole(Guid id, [FromBody] UpdateUserRoleDto dto, CancellationToken ct)
        => Ok(await _adminService.UpdateUserRoleAsync(id, _currentUserService.UserId!.Value, dto, ct));

    /// <summary>Remove a user. Users with reviews on record are deactivated
    /// instead of hard-deleted, to avoid orphaning that history (the response
    /// explains which happened).</summary>
    [HttpDelete("users/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> DeleteUser(Guid id, CancellationToken ct)
    {
        await _adminService.DeleteUserAsync(id, _currentUserService.UserId!.Value, ct);
        return NoContent();
    }
}

