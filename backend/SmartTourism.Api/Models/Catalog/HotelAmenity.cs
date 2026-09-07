namespace SmartTourism.Api.Models.Catalog;

/// <summary>Join entity for the Hotel <-> Amenity many-to-many relationship.</summary>
public class HotelAmenity
{
    public int HotelId { get; set; }
    public Hotel Hotel { get; set; } = null!;

    public int AmenityId { get; set; }
    public Amenity Amenity { get; set; } = null!;
}
