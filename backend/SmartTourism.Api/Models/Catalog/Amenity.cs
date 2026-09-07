using SmartTourism.Api.Models.Common;

namespace SmartTourism.Api.Models.Catalog;

/// <summary>Master list of amenities (Free WiFi, Pool, Spa, ...) reused across hotels.</summary>
public class Amenity : IAuditableEntity
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<HotelAmenity> HotelAmenities { get; set; } = new List<HotelAmenity>();
}
