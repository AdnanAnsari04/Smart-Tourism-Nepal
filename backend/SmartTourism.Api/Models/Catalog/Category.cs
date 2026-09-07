using SmartTourism.Api.Models.Common;

namespace SmartTourism.Api.Models.Catalog;

/// <summary>Lookup table for destination categories: Nature, Trekking, Heritage, etc.</summary>
public class Category : IAuditableEntity, IActivatable
{
    public int Id { get; set; }

    public string Slug { get; set; } = string.Empty; // e.g. "Trekking" (matches frontend category id)
    public string Label { get; set; } = string.Empty;
    public string? Icon { get; set; } // emoji or icon key

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
}
