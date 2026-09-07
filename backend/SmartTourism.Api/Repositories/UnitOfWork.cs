using SmartTourism.Api.Data;
using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Models.Geography;
using SmartTourism.Api.Models.Identity;
using SmartTourism.Api.Models.Trekking;
using SmartTourism.Api.Repositories.Interfaces;

namespace SmartTourism.Api.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;

        Roles = new Repository<Role>(_context);
        Users = new Repository<User>(_context);
        RefreshTokens = new Repository<RefreshToken>(_context);
        RevokedAccessTokens = new Repository<RevokedAccessToken>(_context);
        Provinces = new Repository<Province>(_context);
        Cities = new Repository<City>(_context);
        Categories = new Repository<Category>(_context);
        Destinations = new Repository<Destination>(_context);
        Amenities = new Repository<Amenity>(_context);
        Hotels = new Repository<Hotel>(_context);
        HotelAmenities = new Repository<HotelAmenity>(_context);
        TrekkingRegions = new Repository<TrekkingRegion>(_context);
        TrekkingRoutes = new Repository<TrekkingRoute>(_context);
        Reviews = new Repository<Review>(_context);
        Favorites = new Repository<Favorite>(_context);
        UserActivities = new Repository<UserActivity>(_context);
    }

    public IRepository<Role> Roles { get; }
    public IRepository<User> Users { get; }
    public IRepository<RefreshToken> RefreshTokens { get; }
    public IRepository<RevokedAccessToken> RevokedAccessTokens { get; }
    public IRepository<Province> Provinces { get; }
    public IRepository<City> Cities { get; }
    public IRepository<Category> Categories { get; }
    public IRepository<Destination> Destinations { get; }
    public IRepository<Amenity> Amenities { get; }
    public IRepository<Hotel> Hotels { get; }
    public IRepository<HotelAmenity> HotelAmenities { get; }
    public IRepository<TrekkingRegion> TrekkingRegions { get; }
    public IRepository<TrekkingRoute> TrekkingRoutes { get; }
    public IRepository<Review> Reviews { get; }
    public IRepository<Favorite> Favorites { get; }
    public IRepository<UserActivity> UserActivities { get; }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => _context.SaveChangesAsync(cancellationToken);
}
