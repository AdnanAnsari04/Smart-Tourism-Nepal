namespace SmartTourism.Api.Authentication;

/// <summary>
/// Bound from the "Jwt" config section, which in turn is populated from
/// JWT_SECRET / JWT_ISSUER / JWT_AUDIENCE environment variables in
/// production (see Program.cs). Never hardcode real values here.
/// </summary>
public class JwtSettings
{
    public const string SectionName = "Jwt";

    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int AccessTokenExpiryMinutes { get; set; } = 15;
    public int RefreshTokenExpiryDays { get; set; } = 7;
}

/// <summary>
/// Derives a stable 256-bit signing key from the configured JWT secret.
/// Both token generation (TokenService) and token validation (Program.cs)
/// must call this same helper, or signatures minted by one will fail
/// validation against the other.
/// </summary>
public static class JwtKeyHelper
{
    public static byte[] DeriveSigningKey(string secret)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        return sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(secret));
    }
}
