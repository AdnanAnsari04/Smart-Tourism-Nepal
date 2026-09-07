using Microsoft.OpenApi.Models;

namespace SmartTourism.Api.Configuration;

public static class SwaggerExtensions
{
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Smart Tourism Nepal API",
                Version = "v1",
                Description = "Backend foundation for the Nepal Tourism platform: provinces, cities, categories, " +
                              "destinations, hotels, trekking routes, reviews, favorites, and JWT authentication."
            });

            var jwtScheme = new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description = "Enter a JWT access token. Example: Bearer {your token}",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            };

            options.AddSecurityDefinition("Bearer", jwtScheme);
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                { jwtScheme, Array.Empty<string>() }
            });

            var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath))
            {
                options.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
            }
        });

        return services;
    }
}

public static class CorsExtensions
{
    public const string PolicyName = "SmartTourismCorsPolicy";

    /// <summary>Reads allowed origins from CORS_ORIGINS (comma-separated) or the
    /// Cors:AllowedOrigins config array. No origins configured = no cross-origin
    /// requests allowed, which is the safe default for production.</summary>
    public static IServiceCollection AddConfiguredCors(this IServiceCollection services, IConfiguration configuration)
    {
        var envOrigins = Environment.GetEnvironmentVariable("CORS_ORIGINS");
        var origins = !string.IsNullOrWhiteSpace(envOrigins)
            ? envOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            : configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                if (origins.Length > 0)
                {
                    policy.WithOrigins(origins)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                }
                else
                {
                    // No origins configured: deny all cross-origin requests rather
                    // than silently falling back to a permissive wildcard policy.
                    policy.WithOrigins(Array.Empty<string>());
                }
            });
        });

        return services;
    }
}
