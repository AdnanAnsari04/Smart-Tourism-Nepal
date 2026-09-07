using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Models.Common;
using SmartTourism.Api.Models.Trekking;

namespace SmartTourism.Api.Models.Geography;

/// <summary>
/// Top of the Province -> City -> Category -> Destination hierarchy (and
/// the parallel Province -> City -> Hotel and Province -> Region -> Route
/// hierarchies). Nepal has exactly seven of these, seeded once.
/// </summary>
public class Province : IAuditableEntity, IActivatable
{
    public int Id { get; set; }

    public string Slug { get; set; } = string.Empty; // e.g. "bagmati"
    public string Name { get; set; } = string.Empty; // e.g. "Bagmati"
    public string Capital { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<City> Cities { get; set; } = new List<City>();
    public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
    public ICollection<TrekkingRegion> TrekkingRegions { get; set; } = new List<TrekkingRegion>();
}
