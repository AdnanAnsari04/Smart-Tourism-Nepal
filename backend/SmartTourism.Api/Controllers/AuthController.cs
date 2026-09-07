using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTourism.Api.DTOs.Auth;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ICurrentUserService _currentUserService;

    public AuthController(IAuthService authService, ICurrentUserService currentUserService)
    {
        _authService = authService;
        _currentUserService = currentUserService;
    }

    /// <summary>Create a new Tourist account.</summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto request, CancellationToken ct)
    {
        var result = await _authService.RegisterAsync(request, _currentUserService.IpAddress, ct);
        return Ok(result);
    }

    /// <summary>Authenticate with email and password, returns an access + refresh token pair.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request, _currentUserService.IpAddress, ct);
        return Ok(result);
    }

    /// <summary>Authenticate with a Google ID token from the frontend's "Continue with
    /// Google" button. Verified server-side against Google's public keys; creates a new
    /// account, links to an existing email match, or logs into an existing linked account.</summary>
    [HttpPost("google-login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> GoogleLogin([FromBody] GoogleLoginRequestDto request, CancellationToken ct)
    {
        var result = await _authService.GoogleLoginAsync(request.IdToken, _currentUserService.IpAddress, ct);
        return Ok(result);
    }

    /// <summary>Exchange a valid refresh token for a new access + refresh token pair (rotation).</summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> Refresh([FromBody] RefreshTokenRequestDto request, CancellationToken ct)
    {
        var result = await _authService.RefreshTokenAsync(request.RefreshToken, _currentUserService.IpAddress, ct);
        return Ok(result);
    }

    /// <summary>Revoke a refresh token (logout on this device).</summary>
    [HttpPost("revoke")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Revoke([FromBody] RefreshTokenRequestDto request, CancellationToken ct)
    {
        await _authService.RevokeTokenAsync(request.RefreshToken, _currentUserService.IpAddress, ct);
        return NoContent();
    }

    /// <summary>Log out: blacklists the access token used to authenticate this
    /// request (so it stops working immediately, even though it hasn't
    /// naturally expired yet) and, if provided, revokes the refresh token for
    /// this device too.</summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout([FromBody] LogoutRequestDto? request, CancellationToken ct)
    {
        var userId = _currentUserService.UserId!.Value;

        var jti = User.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
        var expClaim = User.FindFirst(JwtRegisteredClaimNames.Exp)?.Value;

        if (string.IsNullOrEmpty(jti) || !long.TryParse(expClaim, out var expSeconds))
        {
            throw new UnauthorizedAppException("Token is missing required claims.");
        }

        var accessTokenExpiresAt = DateTimeOffset.FromUnixTimeSeconds(expSeconds).UtcDateTime;

        await _authService.LogoutAsync(userId, jti, accessTokenExpiresAt, request?.RefreshToken, _currentUserService.IpAddress, ct);
        return NoContent();
    }

    /// <summary>Get the currently authenticated user's profile.</summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserDto>> Me(CancellationToken ct)
    {
        var userId = _currentUserService.UserId!.Value;
        var user = await _authService.GetCurrentUserAsync(userId, ct);
        return Ok(user);
    }

    /// <summary>Change the authenticated user's password.</summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request, CancellationToken ct)
    {
        var userId = _currentUserService.UserId!.Value;
        await _authService.ChangePasswordAsync(userId, request, ct);
        return NoContent();
    }
}
