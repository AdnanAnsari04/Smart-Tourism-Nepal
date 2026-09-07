using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Models.Common;
using SmartTourism.Api.Models.Identity;

namespace SmartTourism.Api.Models.Engagement;

public class Review : IAuditableEntity, IActivatable
{
    public Guid Id { get; set; }

    public int DestinationId { get; set; }
    public Destination Destination { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int Rating { get; set; } // 1-5, enforced by validator + DB CHECK constraint
    public string Comment { get; set; } = string.Empty;

    /// <summary>Soft moderation flag; inactive reviews are hidden but not deleted.</summary>
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
