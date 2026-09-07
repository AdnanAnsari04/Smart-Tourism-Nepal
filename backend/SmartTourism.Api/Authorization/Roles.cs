namespace SmartTourism.Api.Authorization;

/// <summary>Canonical role names, used for [Authorize(Roles = ...)] and seeding.
/// Keeping these as constants avoids typo'd magic strings scattered across controllers.</summary>
public static class Roles
{
    public const string Admin = "Admin";
    public const string Tourist = "Tourist";
}
