using SmartTourism.Api.Models.Common;
using SmartTourism.Api.Models.Engagement;

namespace SmartTourism.Api.Models.Identity;

public class User : IAuditableEntity, IActivatable
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string NormalizedEmail { get; set; } = string.Empty; // uppercase, unique-indexed
    public string PasswordHash { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Country { get; set; }

    /// <summary>Google's "sub" (subject) claim for accounts created or linked
    /// via "Continue with Google". Null for accounts that only ever used
    /// email/password. Unique when present — enforced by a filtered index
    /// (see UserConfiguration) since SQL Server allows many NULLs in a
    /// unique index but only one of any real, non-null value.</summary>
    public string? GoogleId { get; set; }

    public bool IsEmailVerified { get; set; }
    public bool IsActive { get; set; } = true;

    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<UserActivity> Activities { get; set; } = new List<UserActivity>();
}
