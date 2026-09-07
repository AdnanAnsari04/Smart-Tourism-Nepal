using SmartTourism.Api.Models.Common;

namespace SmartTourism.Api.Models.Trekking;

public enum TrekDifficulty
{
    Easy = 0,
    Moderate = 1,
    Hard = 2
}

public class TrekkingRoute : IAuditableEntity, IActivatable
{
    public int Id { get; set; }

    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    /// <summary>Optional free-text district, independent of the region's Province.</summary>
    public string? District { get; set; }

    public TrekDifficulty Difficulty { get; set; }
    public int MinDurationDays { get; set; }
    public int MaxDurationDays { get; set; }
    public string BestSeason { get; set; } = string.Empty;
    public int MaxAltitudeMeters { get; set; }

    public string? StartingPoint { get; set; }
    public string? EndingPoint { get; set; }

    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }

    /// <summary>Admin-entered rating from a real source — there's no review
    /// subsystem for trekking routes (see Review model, which only attaches
    /// to Destination), so this is set directly rather than aggregated.</summary>
    public decimal Rating { get; set; }

    public string? PhotoClass { get; set; }
    public string? ImageUrl { get; set; }

    public int TrekkingRegionId { get; set; }
    public TrekkingRegion TrekkingRegion { get; set; } = null!;

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<TrekkingRoutePermit> RequiredPermits { get; set; } = new List<TrekkingRoutePermit>();
    public ICollection<TrekkingRouteEquipment> Equipment { get; set; } = new List<TrekkingRouteEquipment>();
}
