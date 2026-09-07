using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SmartTourism.Api.Authentication;
using SmartTourism.Api.Authorization;
using SmartTourism.Api.DTOs.Auth;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Models.Identity;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly IUserActivityService _userActivityService;
    private readonly GoogleAuthSettings _googleAuthSettings;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        IUserActivityService userActivityService,
        IOptions<GoogleAuthSettings> googleAuthSettings,
        ILogger<AuthService> logger)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _userActivityService = userActivityService;
        _googleAuthSettings = googleAuthSettings.Value;
        _logger = logger;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, string? ipAddress, CancellationToken ct = default)
    {
        var normalizedEmail = request.Email.Trim().ToUpperInvariant();

        var exists = await _unitOfWork.Users.AnyAsync(u => u.NormalizedEmail == normalizedEmail, ct);
        if (exists)
        {
            throw new ConflictException("An account with this email already exists.");
        }

        var touristRole = await _unitOfWork.Roles.FirstOrDefaultAsync(r => r.Name == Roles.Tourist, ct)
            ?? throw new InvalidOperationException("Tourist role is not seeded. Run database seeding before accepting registrations.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            NormalizedEmail = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            PhoneNumber = request.PhoneNumber.Trim(),
            Country = request.Country.Trim(),
            RoleId = touristRole.Id,
            IsEmailVerified = false,
            IsActive = true
        };

        await _unitOfWork.Users.AddAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        // Reload with Role populated for token/claims generation.
        user.Role = touristRole;

        _logger.LogInformation("New user registered: {UserId} ({Email})", user.Id, user.Email);
        await _userActivityService.LogAsync(user.Id, UserActivityType.Register, "Account registered", ct: ct);

        return await IssueTokensAsync(user, ipAddress, ct);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string? ipAddress, CancellationToken ct = default)
    {
        var normalizedEmail = request.Email.Trim().ToUpperInvariant();

        var user = await _unitOfWork.Users.Query(asNoTracking: false)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail, ct);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAppException("Invalid email or password.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAppException("This account has been deactivated. Contact support for help.");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _unitOfWork.SaveChangesAsync(ct);

        await _userActivityService.LogAsync(user.Id, UserActivityType.Login, "User logged in", ct: ct);

        return await IssueTokensAsync(user, ipAddress, ct);
    }

    public async Task<AuthResponseDto> GoogleLoginAsync(string idToken, string? ipAddress, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(_googleAuthSettings.ClientId))
        {
            throw new InvalidOperationException(
                "Google sign-in is not configured. Set the GOOGLE_CLIENT_ID environment variable to your " +
                "Google OAuth Client ID before enabling the 'Continue with Google' button.");
        }

        GoogleJsonWebSignature.Payload payload;
        try
        {
            // Verifies the token's signature against Google's public keys,
            // that it hasn't expired, and that it was issued for OUR app
            // specifically (the Audience check) — not some other app's
            // Google sign-in flow. This is the entire security boundary:
            // everything else (email, name, sub) is only trustworthy
            // because this validation succeeded.
            payload = await GoogleJsonWebSignature.ValidateAsync(idToken, new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _googleAuthSettings.ClientId }
            });
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning(ex, "Rejected an invalid Google ID token.");
            throw new UnauthorizedAppException("Google sign-in failed: the token could not be verified.");
        }

        var normalizedEmail = payload.Email.Trim().ToUpperInvariant();

        var user = await _unitOfWork.Users.Query(asNoTracking: false)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.GoogleId == payload.Subject || u.NormalizedEmail == normalizedEmail, ct);

        if (user == null)
        {
            // Brand-new account. Google has already verified this email
            // address belongs to this person, so IsEmailVerified starts
            // true — unlike a normal password registration.
            var touristRole = await _unitOfWork.Roles.FirstOrDefaultAsync(r => r.Name == Roles.Tourist, ct)
                ?? throw new InvalidOperationException("Tourist role is not seeded. Run database seeding first.");

            user = new User
            {
                Id = Guid.NewGuid(),
                FullName = string.IsNullOrWhiteSpace(payload.Name) ? payload.Email.Split('@')[0] : payload.Name,
                Email = payload.Email,
                NormalizedEmail = normalizedEmail,
                // Google-only accounts never use a password, but PasswordHash
                // is a required column — fill it with a hash of a random,
                // never-shared value so no password could ever match it.
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString("N")),
                GoogleId = payload.Subject,
                RoleId = touristRole.Id,
                IsEmailVerified = payload.EmailVerified,
                IsActive = true
            };

            await _unitOfWork.Users.AddAsync(user, ct);
            await _unitOfWork.SaveChangesAsync(ct);
            user.Role = touristRole;

            _logger.LogInformation("New user registered via Google: {UserId} ({Email})", user.Id, user.Email);
            await _userActivityService.LogAsync(user.Id, UserActivityType.Register, "Account created via Google sign-in", ct: ct);
        }
        else if (user.GoogleId == null)
        {
            // Existing password account, same email, signing in with Google
            // for the first time — link the two instead of creating a
            // duplicate account. Safe specifically because Google has
            // already verified this person controls that email address.
            if (!payload.EmailVerified)
            {
                throw new UnauthorizedAppException(
                    "Google reports this email address is not verified, and an account with this email " +
                    "already exists. Please sign in with your password instead.");
            }

            user.GoogleId = payload.Subject;
            await _unitOfWork.SaveChangesAsync(ct);
            _logger.LogInformation("Linked Google account to existing user: {UserId} ({Email})", user.Id, user.Email);
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAppException("This account has been deactivated. Contact support for help.");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _unitOfWork.SaveChangesAsync(ct);

        await _userActivityService.LogAsync(user.Id, UserActivityType.Login, "User logged in via Google", ct: ct);

        return await IssueTokensAsync(user, ipAddress, ct);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default)
    {
        var existingToken = await _unitOfWork.RefreshTokens.Query(asNoTracking: false)
            .Include(rt => rt.User).ThenInclude(u => u.Role)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken, ct);

        if (existingToken == null)
        {
            throw new UnauthorizedAppException("Invalid refresh token.");
        }

        if (!existingToken.IsActive)
        {
            throw new UnauthorizedAppException("Refresh token is expired or has been revoked.");
        }

        // Rotate: revoke the old token and issue a brand new pair.
        var (newRefreshTokenValue, newRefreshExpiresAt) = _tokenService.GenerateRefreshToken();
        var newRefreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = existingToken.UserId,
            Token = newRefreshTokenValue,
            ExpiresAt = newRefreshExpiresAt,
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = ipAddress
        };

        existingToken.RevokedAt = DateTime.UtcNow;
        existingToken.RevokedByIp = ipAddress;
        existingToken.ReplacedByTokenId = newRefreshToken.Id;

        await _unitOfWork.RefreshTokens.AddAsync(newRefreshToken, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var (accessToken, accessExpiresAt) = _tokenService.GenerateAccessToken(existingToken.User);

        return new AuthResponseDto(
            MapToUserDto(existingToken.User),
            accessToken,
            accessExpiresAt,
            newRefreshTokenValue,
            newRefreshExpiresAt
        );
    }

    public async Task RevokeTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default)
    {
        var token = await _unitOfWork.RefreshTokens.Query(asNoTracking: false)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken, ct);

        if (token == null || !token.IsActive)
        {
            // Idempotent: revoking an already-invalid token is not an error.
            return;
        }

        token.RevokedAt = DateTime.UtcNow;
        token.RevokedByIp = ipAddress;
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task LogoutAsync(Guid userId, string accessTokenJti, DateTime accessTokenExpiresAt, string? refreshToken, string? ipAddress, CancellationToken ct = default)
    {
        // Blacklist the access token that authenticated this very request, so
        // it can't be replayed even though it's still within its lifetime.
        var alreadyBlacklisted = await _unitOfWork.RevokedAccessTokens.AnyAsync(t => t.Jti == accessTokenJti, ct);
        if (!alreadyBlacklisted)
        {
            await _unitOfWork.RevokedAccessTokens.AddAsync(new RevokedAccessToken
            {
                Id = Guid.NewGuid(),
                Jti = accessTokenJti,
                UserId = userId,
                ExpiresAt = accessTokenExpiresAt,
                RevokedAt = DateTime.UtcNow
            }, ct);
        }

        // Also end this device's refresh session, if the client sent one.
        // Scoped to the calling user so one session can never revoke another's.
        if (!string.IsNullOrWhiteSpace(refreshToken))
        {
            var token = await _unitOfWork.RefreshTokens.Query(asNoTracking: false)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken && rt.UserId == userId, ct);

            if (token is { IsActive: true })
            {
                token.RevokedAt = DateTime.UtcNow;
                token.RevokedByIp = ipAddress;
            }
        }

        await _unitOfWork.SaveChangesAsync(ct);
        await _userActivityService.LogAsync(userId, UserActivityType.Logout, "User logged out", ct: ct);
    }

    public async Task<UserDto> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto request, CancellationToken ct = default)
    {
        var user = await _unitOfWork.Users.Query(asNoTracking: false)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == userId, ct)
            ?? throw new NotFoundException("User", userId);

        // Only these three fields are ever touched here. Email, password,
        // role, and active status all have their own dedicated (and
        // separately protected) paths, so a client can't smuggle a role or
        // status change in through this endpoint.
        user.FullName = request.FullName.Trim();
        user.PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim();
        user.Country = string.IsNullOrWhiteSpace(request.Country) ? null : request.Country.Trim();

        await _unitOfWork.SaveChangesAsync(ct);
        await _userActivityService.LogAsync(userId, UserActivityType.ProfileUpdated, "Profile updated", ct: ct);

        return MapToUserDto(user);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request, CancellationToken ct = default)
    {
        var user = await _unitOfWork.Users.Query(asNoTracking: false).FirstOrDefaultAsync(u => u.Id == userId, ct)
            ?? throw new NotFoundException("User", userId);

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
        {
            throw new BadRequestException("Current password is incorrect.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task<UserDto> GetCurrentUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _unitOfWork.Users.Query()
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == userId, ct)
            ?? throw new NotFoundException("User", userId);

        return MapToUserDto(user);
    }

    private async Task<AuthResponseDto> IssueTokensAsync(User user, string? ipAddress, CancellationToken ct)
    {
        var (accessToken, accessExpiresAt) = _tokenService.GenerateAccessToken(user);
        var (refreshTokenValue, refreshExpiresAt) = _tokenService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = refreshExpiresAt,
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = ipAddress
        };

        await _unitOfWork.RefreshTokens.AddAsync(refreshToken, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return new AuthResponseDto(
            MapToUserDto(user),
            accessToken,
            accessExpiresAt,
            refreshTokenValue,
            refreshExpiresAt
        );
    }

    private static UserDto MapToUserDto(User user) => new(
        user.Id,
        user.FullName,
        user.Email,
        user.PhoneNumber,
        user.Country,
        user.Role.Name,
        user.IsEmailVerified,
        user.CreatedAt
    );
}
