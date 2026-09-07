using SmartTourism.Api.Models.Common;
using SmartTourism.Api.Models.Geography;

namespace SmartTourism.Api.Models.Trekking;

/// <summary>
/// Middle tier of Province -> Trekking Region -> Trekking Route, e.g.
/// "Khumbu" or "Annapurna" within Koshi / Gandaki province.
/// </summary>
public class TrekkingRegion : IAuditableEntity, IActivatable
{
    public int Id { get; set; }

    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public int ProvinceId { get; set; }
    public Province Province { get; set; } = null!;

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<TrekkingRoute> TrekkingRoutes { get; set; } = new List<TrekkingRoute>();
}
