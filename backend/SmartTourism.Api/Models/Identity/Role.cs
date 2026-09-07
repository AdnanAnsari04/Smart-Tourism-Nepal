using SmartTourism.Api.Models.Common;

namespace SmartTourism.Api.Models.Identity;

/// <summary>Lookup table: "Admin", "Tourist". Seeded once, rarely changes.</summary>
public class Role : IAuditableEntity
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty; // e.g. "Admin", "Tourist"
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
}
