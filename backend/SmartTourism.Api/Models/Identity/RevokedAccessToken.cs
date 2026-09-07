namespace SmartTourism.Api.Models.Identity;

/// <summary>
/// Blacklist entry for an access token that was explicitly logged out
/// before its natural expiry. JWT access tokens are stateless by design, so
/// without this table a still-valid (non-expired) access token would keep
/// working after logout. Checked once per request in the JWT bearer's
/// OnTokenValidated event (see Configuration/AuthenticationExtensions.cs).
///
/// Rows past their ExpiresAt can be purged by a cleanup job at any time —
/// the underlying token would fail lifetime validation on its own by then,
/// so keeping the row around no longer adds any protection.
/// </summary>
public class RevokedAccessToken
{
    public Guid Id { get; set; }

    /// <summary>The "jti" (JWT ID) claim of the revoked access token.</summary>
    public string Jti { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    /// <summary>The access token's original expiry — kept so old blacklist rows can be pruned safely.</summary>
    public DateTime ExpiresAt { get; set; }

    public DateTime RevokedAt { get; set; }
}
