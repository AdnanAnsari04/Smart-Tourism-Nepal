using SmartTourism.Api.Models.Identity;

namespace SmartTourism.Api.Models.Engagement;

public enum UserActivityType
{
    Login = 0,
    Logout = 1,
    Register = 2,
    ViewDestination = 3,
    ViewHotel = 4,
    ViewTrekkingRoute = 5,
    SearchPerformed = 6,
    ReviewSubmitted = 7,
    FavoriteAdded = 8,
    FavoriteRemoved = 9,
    ProfileUpdated = 10,
    AccountStatusChanged = 11,
    RoleChanged = 12
}

/// <summary>
/// Lightweight audit/analytics trail: what a user did and when. Not a
/// replacement for structured application logs (see Serilog), which cover
/// system-level events; this table is for user-facing/product analytics.
/// </summary>
public class UserActivity
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public UserActivityType ActivityType { get; set; }
    public string? Description { get; set; }
    public string? MetadataJson { get; set; }
    public string? IpAddress { get; set; }

    public DateTime CreatedAt { get; set; }
}
