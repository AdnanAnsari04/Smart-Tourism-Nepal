using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Models.Identity;

namespace SmartTourism.Api.Models.Engagement;

public enum FavoriteItemType
{
    Destination = 0,
    Hotel = 1,
    TrekkingRoute = 2
}

/// <summary>
/// A saved item for a user. Deliberately generic (ItemType + ItemId) rather
/// than three nullable FKs, so adding a fourth favoritable entity later
/// doesn't require a schema change. FKs to Destination/Hotel are kept for
/// the common Destination case (query convenience + referential integrity);
/// TrekkingRoute favorites are validated at the service layer instead.
/// </summary>
public class Favorite
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public FavoriteItemType ItemType { get; set; }
    public int ItemId { get; set; }

    public int? DestinationId { get; set; }
    public Destination? Destination { get; set; }

    public int? HotelId { get; set; }
    public Hotel? Hotel { get; set; }

    public DateTime CreatedAt { get; set; }
}
