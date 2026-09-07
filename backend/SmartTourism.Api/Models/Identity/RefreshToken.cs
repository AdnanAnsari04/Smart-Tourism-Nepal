namespace SmartTourism.Api.Models.Identity;

/// <summary>
/// Opaque, random refresh token issued alongside a short-lived JWT access
/// token. Stored hashed-at-rest is overkill for this stage, but rotation
/// (RevokedAt + ReplacedByToken) is implemented so reuse of a stolen/old
/// token can be detected.
/// </summary>
public class RefreshToken
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CreatedByIp { get; set; }

    public DateTime? RevokedAt { get; set; }
    public string? RevokedByIp { get; set; }
    public Guid? ReplacedByTokenId { get; set; }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsRevoked => RevokedAt != null;
    public bool IsActive => !IsRevoked && !IsExpired;
}
