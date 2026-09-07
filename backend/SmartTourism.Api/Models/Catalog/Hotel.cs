using SmartTourism.Api.Models.Common;
using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Models.Geography;

namespace SmartTourism.Api.Models.Catalog;

public class Hotel : IAuditableEntity, IActivatable
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    /// <summary>e.g. "Hotel", "Resort", "Homestay", "Lodge", "Guesthouse".</summary>
    public string? HotelType { get; set; }

    /// <summary>Free-text street address / area, independent of the
    /// structured Province/City relations below.</summary>
    public string? Address { get; set; }

    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }

    public string? ContactPhone { get; set; }
    public string? Website { get; set; }

    public decimal PricePerNightNpr { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public int AvailableRooms { get; set; }

    public string? PhotoClass { get; set; }
    public string? ImageUrl { get; set; }

    /// <summary>Optional: which destination this hotel is nearest to /
    /// associated with. Not every hotel maps neatly to one destination, so
    /// this is nullable — City/Province are the fields callers should filter
    /// and search on.</summary>
    public int? DestinationId { get; set; }
    public Destination? Destination { get; set; }

    public int? CityId { get; set; }
    public City? City { get; set; }

    public int ProvinceId { get; set; }
    public Province Province { get; set; } = null!;

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<HotelAmenity> HotelAmenities { get; set; } = new List<HotelAmenity>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}
