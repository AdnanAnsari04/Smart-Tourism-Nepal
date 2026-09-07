using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartTourism.Api.Authentication;
using SmartTourism.Api.Data;

namespace SmartTourism.Api.Configuration;

public static class AuthenticationExtensions
{
    /// <summary>Binds JwtSettings from configuration (populated from JWT_SECRET /
    /// JWT_ISSUER / JWT_AUDIENCE env vars, see Program.cs) and wires up JWT
    /// bearer authentication + role-based authorization.</summary>
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSection = configuration.GetSection(JwtSettings.SectionName);
        services.Configure<JwtSettings>(jwtSection);

        var jwtSettings = jwtSection.Get<JwtSettings>() ?? new JwtSettings();

        if (string.IsNullOrWhiteSpace(jwtSettings.Secret) || jwtSettings.Secret.Length < 16)
        {
            throw new InvalidOperationException(
                "JWT secret is missing or too short. Set the JWT_SECRET environment variable " +
                "(or Jwt:Secret in appsettings.Development.json for local dev) before starting the API.");
        }

        var signingKey = new SymmetricSecurityKey(JwtKeyHelper.DeriveSigningKey(jwtSettings.Secret));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.RequireHttpsMetadata = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")) &&
                                            Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development";
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidateAudience = true,
                ValidAudience = jwtSettings.Audience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromSeconds(30)
            };

            // JWTs are stateless, so signature + expiry checks alone can't
            // catch "this token was logged out five minutes ago" or "this
            // account was just disabled by an admin". Both are checked here,
            // once per request, against the database.
            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = async context =>
                {
                    var principal = context.Principal;
                    var jti = principal?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
                    var userIdValue = principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                    if (string.IsNullOrEmpty(jti) || !Guid.TryParse(userIdValue, out var userId))
                    {
                        context.Fail("Token is missing required claims.");
                        return;
                    }

                    var dbContext = context.HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();

                    var isRevoked = await dbContext.RevokedAccessTokens
                        .AsNoTracking()
                        .AnyAsync(t => t.Jti == jti);

                    if (isRevoked)
                    {
                        context.Fail("This token has been revoked. Please log in again.");
                        return;
                    }

                    var isActive = await dbContext.Users
                        .AsNoTracking()
                        .Where(u => u.Id == userId)
                        .Select(u => (bool?)u.IsActive)
                        .FirstOrDefaultAsync();

                    if (isActive != true)
                    {
                        context.Fail("This account is no longer active.");
                    }
                }
            };
        });

        services.AddAuthorization();

        return services;
    }
}
