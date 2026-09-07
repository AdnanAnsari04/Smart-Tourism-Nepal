using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Models.Geography;
using SmartTourism.Api.Models.Identity;
using SmartTourism.Api.Models.Trekking;
using SmartTourism.Api.Repositories.Interfaces;

namespace SmartTourism.Api.Repositories;

/// <summary>
/// Groups all repositories behind one DI-friendly surface and exposes a
/// single SaveChangesAsync so a service can touch several repositories and
/// commit them as one transaction.
/// </summary>
public interface IUnitOfWork
{
    IRepository<Role> Roles { get; }
    IRepository<User> Users { get; }
    IRepository<RefreshToken> RefreshTokens { get; }
    IRepository<RevokedAccessToken> RevokedAccessTokens { get; }
    IRepository<Province> Provinces { get; }
    IRepository<City> Cities { get; }
    IRepository<Category> Categories { get; }
    IRepository<Destination> Destinations { get; }
    IRepository<Amenity> Amenities { get; }
    IRepository<Hotel> Hotels { get; }
    IRepository<HotelAmenity> HotelAmenities { get; }
    IRepository<TrekkingRegion> TrekkingRegions { get; }
    IRepository<TrekkingRoute> TrekkingRoutes { get; }
    IRepository<Review> Reviews { get; }
    IRepository<Favorite> Favorites { get; }
    IRepository<UserActivity> UserActivities { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
