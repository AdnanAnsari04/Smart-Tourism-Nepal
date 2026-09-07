namespace SmartTourism.Api.DTOs.Auth;

public record RegisterRequestDto(
    string FullName,
    string Email,
    string Password,
    string ConfirmPassword,
    string PhoneNumber,
    string Country
);

public record LoginRequestDto(
    string Email,
    string Password
);

public record RefreshTokenRequestDto(
    string RefreshToken
);

/// <summary>The raw Google ID token (a JWT) returned by Google Identity
/// Services in the browser, sent here for server-side verification. Never
/// trust a role/email claimed by the client directly — only what this
/// token's cryptographic signature, verified against Google's own public
/// keys, actually says.</summary>
public record GoogleLoginRequestDto(
    string IdToken
);

public record ChangePasswordRequestDto(
    string CurrentPassword,
    string NewPassword
);

// Intentionally excludes Email, PasswordHash, RoleId, and IsActive: those can
// never be changed through the self-service profile endpoint, no matter what
// a client sends in the request body (mass-assignment guard).
public record UpdateProfileRequestDto(
    string FullName,
    string? PhoneNumber,
    string? Country
);

// RefreshToken is optional: a client may call logout with only its access
// token (e.g. it already discarded the refresh token), in which case only
// the access token is blacklisted.
public record LogoutRequestDto(
    string? RefreshToken
);

public record UserDto(
    Guid Id,
    string FullName,
    string Email,
    string? PhoneNumber,
    string? Country,
    string Role,
    bool IsEmailVerified,
    DateTime CreatedAt
);

public record AuthResponseDto(
    UserDto User,
    string AccessToken,
    DateTime AccessTokenExpiresAt,
    string RefreshToken,
    DateTime RefreshTokenExpiresAt
);
