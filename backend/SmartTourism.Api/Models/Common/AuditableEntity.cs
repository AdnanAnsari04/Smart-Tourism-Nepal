namespace SmartTourism.Api.Models.Common;

/// <summary>
/// Implemented by any entity that tracks creation/update timestamps.
/// ApplicationDbContext.SaveChangesAsync stamps these automatically —
/// nothing else in the app should set them by hand.
/// </summary>
public interface IAuditableEntity
{
    DateTime CreatedAt { get; set; }
    DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Implemented by entities that support a soft "is this visible/usable"
/// toggle instead of hard deletion (categories, destinations, hotels, etc).
/// </summary>
public interface IActivatable
{
    bool IsActive { get; set; }
}
