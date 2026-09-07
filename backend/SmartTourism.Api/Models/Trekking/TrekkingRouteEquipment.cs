namespace SmartTourism.Api.Models.Trekking;

/// <summary>A single recommended equipment line item for a trekking route (e.g. "Trekking poles").</summary>
public class TrekkingRouteEquipment
{
    public int Id { get; set; }

    public int TrekkingRouteId { get; set; }
    public TrekkingRoute TrekkingRoute { get; set; } = null!;

    public string ItemName { get; set; } = string.Empty;
}
