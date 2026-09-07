using System.Reflection;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.Authentication;
using SmartTourism.Api.Data;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Repositories.Interfaces;
using SmartTourism.Api.Services;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Configuration;

public static class ServiceCollectionExtensions
{
    /// <summary>Registers EF Core, repositories, application services, and
    /// FluentValidation validators. Kept as one extension method so
    /// Program.cs stays a thin composition root.</summary>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "No database connection string configured. Set the SQL_CONNECTION_STRING environment " +
                "variable, or ConnectionStrings:DefaultConnection in appsettings.Development.json for local dev.");
        }

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString, sql =>
            {
                sql.EnableRetryOnFailure(maxRetryCount: 3);
                sql.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
            }));

        services.AddHttpContextAccessor();

        services.Configure<GoogleAuthSettings>(configuration.GetSection(GoogleAuthSettings.SectionName));

        // Repositories
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Services
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProvinceService, ProvinceService>();
        services.AddScoped<ICityService, CityService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IDestinationService, DestinationService>();
        services.AddScoped<IHotelService, HotelService>();
        services.AddScoped<ITrekkingService, TrekkingService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IFavoriteService, FavoriteService>();
        services.AddScoped<IUserActivityService, UserActivityService>();
        services.AddScoped<IAdminService, AdminService>();

        // FluentValidation validators (all IValidator<T> implementations in this assembly)
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}
