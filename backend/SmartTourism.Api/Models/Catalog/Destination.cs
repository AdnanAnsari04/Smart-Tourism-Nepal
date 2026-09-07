using SmartTourism.Api.Models.Common;
using SmartTourism.Api.Models.Engagement;
using SmartTourism.Api.Models.Geography;

namespace SmartTourism.Api.Models.Catalog;

public class Destination : IAuditableEntity, IActivatable
{
    public int Id { get; set; }

    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    /// <summary>Free-text district name. Usually implied by City.District, but
    /// kept here too since not every destination has a City assigned, and the
    /// task spec calls it out as its own field.</summary>
    public string? District { get; set; }

    /// <summary>e.g. "October to December, March to May". Optional — filled in
    /// by an admin from a real source, never guessed.</summary>
    public string? BestSeason { get; set; }

    /// <summary>Entry fee / permit / opening-hours notes shown to visitors.</summary>
    public string? EntryInformation { get; set; }

    public decimal Rating { get; set; } // denormalized average, recalculated from Reviews
    public int ReviewCount { get; set; }
    public decimal DistanceFromKathmanduKm { get; set; }

    public string? PhotoClass { get; set; } // CSS gradient placeholder key
    public string? ImageUrl { get; set; }

    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }

    public int ProvinceId { get; set; }
    public Province Province { get; set; } = null!;

    public int? CityId { get; set; }
    public City? City { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<Hotel> Hotels { get; set; } = new List<Hotel>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}
