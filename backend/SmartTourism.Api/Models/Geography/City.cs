using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Models.Common;

namespace SmartTourism.Api.Models.Geography;

/// <summary>
/// A city/town/hub that Destinations and Hotels are grouped under, enabling
/// Province -> City -> Category -> Destination and Province -> City -> Hotel
/// filtering.
/// </summary>
public class City : IAuditableEntity, IActivatable
{
    public int Id { get; set; }

    public string Slug { get; set; } = string.Empty; // e.g. "pokhara"
    public string Name { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string? Description { get; set; }

    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? ImageUrl { get; set; }

    public int ProvinceId { get; set; }
    public Province Province { get; set; } = null!;

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
    public ICollection<Hotel> Hotels { get; set; } = new List<Hotel>();
}
