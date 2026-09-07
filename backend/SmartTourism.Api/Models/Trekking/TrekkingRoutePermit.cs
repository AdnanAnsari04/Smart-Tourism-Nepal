namespace SmartTourism.Api.Models.Trekking;

/// <summary>A single required permit line item for a trekking route (e.g. "TIMS Card").</summary>
public class TrekkingRoutePermit
{
    public int Id { get; set; }

    public int TrekkingRouteId { get; set; }
    public TrekkingRoute TrekkingRoute { get; set; } = null!;

    public string PermitName { get; set; } = string.Empty;
}
