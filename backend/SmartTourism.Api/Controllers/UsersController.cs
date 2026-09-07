using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTourism.Api.DTOs.Auth;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Controllers;

/// <summary>Self-service profile endpoints for the currently authenticated
/// user. Every action here requires a valid access token; there is no way to
/// view or edit another user's profile through this controller.</summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ICurrentUserService _currentUserService;

    public UsersController(IAuthService authService, ICurrentUserService currentUserService)
    {
        _authService = authService;
        _currentUserService = currentUserService;
    }

    /// <summary>Get the authenticated user's profile.</summary>
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserDto>> GetMe(CancellationToken ct)
    {
        var userId = _currentUserService.UserId!.Value;
        var user = await _authService.GetCurrentUserAsync(userId, ct);
        return Ok(user);
    }

    /// <summary>Update the authenticated user's profile. Only full name, phone
    /// number, and country can be changed here — email, password, and role
    /// all have their own dedicated endpoints and can never be altered
    /// through this one, no matter what the request body contains.</summary>
    [HttpPut("me")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> UpdateMe([FromBody] UpdateProfileRequestDto request, CancellationToken ct)
    {
        var userId = _currentUserService.UserId!.Value;
        var user = await _authService.UpdateProfileAsync(userId, request, ct);
        return Ok(user);
    }
}
