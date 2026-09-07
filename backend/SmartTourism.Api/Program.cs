using Microsoft.EntityFrameworkCore;
using Serilog;
using SmartTourism.Api.Configuration;
using SmartTourism.Api.Data;
using SmartTourism.Api.Data.Seed;
using SmartTourism.Api.Middleware;
using SmartTourism.Api.Validators;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------
// Environment variables override appsettings for anything secret.
// These are the exact names called out in the project requirements:
// SQL_CONNECTION_STRING, JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE, CORS_ORIGINS.
// Reading them explicitly (rather than relying on ASP.NET Core's default
// "__" double-underscore env var convention) keeps the required variable
// names simple and documented in one place.
// ---------------------------------------------------------------------
var envOverrides = new Dictionary<string, string?>();

var sqlConnectionString = Environment.GetEnvironmentVariable("SQL_CONNECTION_STRING");
if (!string.IsNullOrWhiteSpace(sqlConnectionString))
    envOverrides["ConnectionStrings:DefaultConnection"] = sqlConnectionString;

var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET");
if (!string.IsNullOrWhiteSpace(jwtSecret))
    envOverrides["Jwt:Secret"] = jwtSecret;

var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
if (!string.IsNullOrWhiteSpace(jwtIssuer))
    envOverrides["Jwt:Issuer"] = jwtIssuer;

var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
if (!string.IsNullOrWhiteSpace(jwtAudience))
    envOverrides["Jwt:Audience"] = jwtAudience;

var googleClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
if (!string.IsNullOrWhiteSpace(googleClientId))
    envOverrides["GoogleAuth:ClientId"] = googleClientId;

if (envOverrides.Count > 0)
{
    builder.Configuration.AddInMemoryCollection(envOverrides);
}
// CORS_ORIGINS is read directly by AddConfiguredCors below (comma-separated,
// doesn't map cleanly to a single config key).

// ---------------------------------------------------------------------
// Logging (Serilog): console always, rolling file in all environments.
// ---------------------------------------------------------------------
builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(
        path: Path.Combine(AppContext.BaseDirectory, "logs", "smarttourism-.log"),
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 14));

// ---------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationActionFilter>();
});

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddSwaggerDocumentation();
builder.Services.AddConfiguredCors(builder.Configuration);

builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>();

var app = builder.Build();

// ---------------------------------------------------------------------
// Migrate + seed the database on startup.
// Wrapped so a database that isn't reachable yet (e.g. container still
// starting) produces one clear log line instead of an opaque crash loop.
// ---------------------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        logger.LogInformation("Applying database migrations...");
        await context.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully.");

        logger.LogInformation("Seeding database...");
        await DbSeeder.SeedAsync(context, app.Configuration, logger);
        logger.LogInformation("Database seed complete.");
    }
    catch (Exception ex)
    {
        logger.LogCritical(ex, "Database migration/seed failed on startup. " +
            "Check SQL_CONNECTION_STRING and confirm SQL Server is reachable.");
        throw;
    }
}

// ---------------------------------------------------------------------
// Middleware pipeline
// ---------------------------------------------------------------------
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Smart Tourism Nepal API v1");
        options.RoutePrefix = "swagger";
    });
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseCors(CorsExtensions.PolicyName);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

// Exposed for WebApplicationFactory-based integration tests.
public partial class Program { }
