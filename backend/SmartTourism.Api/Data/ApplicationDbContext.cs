using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Models.Common;
using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Models.Geography;
using SmartTourism.Api.Models.Identity;
using SmartTourism.Api.Models.Trekking;

namespace SmartTourism.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // Identity
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<RevokedAccessToken> RevokedAccessTokens => Set<RevokedAccessToken>();

    // Geography
    public DbSet<Province> Provinces => Set<Province>();
    public DbSet<City> Cities => Set<City>();

    // Catalog
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Destination> Destinations => Set<Destination>();
    public DbSet<Amenity> Amenities => Set<Amenity>();
    public DbSet<Hotel> Hotels => Set<Hotel>();
    public DbSet<HotelAmenity> HotelAmenities => Set<HotelAmenity>();

    // Trekking
    public DbSet<TrekkingRegion> TrekkingRegions => Set<TrekkingRegion>();
    public DbSet<TrekkingRoute> TrekkingRoutes => Set<TrekkingRoute>();
    public DbSet<TrekkingRoutePermit> TrekkingRoutePermits => Set<TrekkingRoutePermit>();
    public DbSet<TrekkingRouteEquipment> TrekkingRouteEquipment => Set<TrekkingRouteEquipment>();

    // Engagement
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<UserActivity> UserActivities => Set<UserActivity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Pulls in every IEntityTypeConfiguration<T> in this assembly
        // (see Data/Configurations/*) instead of configuring entities here.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        StampAuditableEntities();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        StampAuditableEntities();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    /// <summary>
    /// Automatically stamps CreatedAt/UpdatedAt for any entity implementing
    /// IAuditableEntity, so services and controllers never set these fields
    /// by hand and can never forget to.
    /// </summary>
    private void StampAuditableEntities()
    {
        var utcNow = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<IAuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = utcNow;
                    entry.Entity.UpdatedAt = null;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = utcNow;
                    break;
            }
        }
    }
}
