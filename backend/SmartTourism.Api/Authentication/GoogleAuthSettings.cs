namespace SmartTourism.Api.Authentication;

/// <summary>
/// Bound from the "GoogleAuth" config section, populated from the
/// GOOGLE_CLIENT_ID environment variable (see Program.cs). Only the OAuth
/// Client ID is ever needed server-side — token verification checks the
/// token's "audience" claim against this value, no client secret involved.
/// </summary>
public class GoogleAuthSettings
{
    public const string SectionName = "GoogleAuth";

    public string ClientId { get; set; } = string.Empty;
}
