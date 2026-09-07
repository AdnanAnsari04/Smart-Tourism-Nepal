using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartTourism.Api.Models.Catalog;

namespace SmartTourism.Api.Data.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Slug).IsRequired().HasMaxLength(50);
        builder.Property(c => c.Label).IsRequired().HasMaxLength(80);
        builder.Property(c => c.Icon).HasMaxLength(20);

        builder.HasIndex(c => c.Slug).IsUnique();
    }
}

public class DestinationConfiguration : IEntityTypeConfiguration<Destination>
{
    public void Configure(EntityTypeBuilder<Destination> builder)
    {
        builder.ToTable("Destinations");
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Slug).IsRequired().HasMaxLength(150);
        builder.Property(d => d.Name).IsRequired().HasMaxLength(150);
        builder.Property(d => d.Description).IsRequired().HasMaxLength(2000);
        builder.Property(d => d.District).HasMaxLength(120);
        builder.Property(d => d.BestSeason).HasMaxLength(150);
        builder.Property(d => d.EntryInformation).HasMaxLength(1000);
        builder.Property(d => d.PhotoClass).HasMaxLength(50);
        builder.Property(d => d.ImageUrl).HasMaxLength(1000);

        builder.Property(d => d.Rating).HasColumnType("decimal(3,2)");
        builder.Property(d => d.DistanceFromKathmanduKm).HasColumnType("decimal(7,2)");
        builder.Property(d => d.Latitude).HasColumnType("decimal(9,6)");
        builder.Property(d => d.Longitude).HasColumnType("decimal(9,6)");

        builder.HasIndex(d => d.Slug).IsUnique();
        builder.HasIndex(d => new { d.ProvinceId, d.CategoryId });
        builder.HasIndex(d => d.CityId);

        builder.ToTable(t => t.HasCheckConstraint("CK_Destination_Rating", "[Rating] >= 0 AND [Rating] <= 5"));

        builder.HasOne(d => d.Province)
            .WithMany(p => p.Destinations)
            .HasForeignKey(d => d.ProvinceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(d => d.City)
            .WithMany(c => c.Destinations)
            .HasForeignKey(d => d.CityId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(d => d.Category)
            .WithMany(c => c.Destinations)
            .HasForeignKey(d => d.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class AmenityConfiguration : IEntityTypeConfiguration<Amenity>
{
    public void Configure(EntityTypeBuilder<Amenity> builder)
    {
        builder.ToTable("Amenities");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Name).IsRequired().HasMaxLength(80);
        builder.HasIndex(a => a.Name).IsUnique();
    }
}

public class HotelConfiguration : IEntityTypeConfiguration<Hotel>
{
    public void Configure(EntityTypeBuilder<Hotel> builder)
    {
        builder.ToTable("Hotels");
        builder.HasKey(h => h.Id);

        builder.Property(h => h.Name).IsRequired().HasMaxLength(150);
        builder.Property(h => h.Description).HasMaxLength(2000);
        builder.Property(h => h.HotelType).HasMaxLength(50);
        builder.Property(h => h.Address).HasMaxLength(300);
        builder.Property(h => h.ContactPhone).HasMaxLength(30);
        builder.Property(h => h.Website).HasMaxLength(300);
        builder.Property(h => h.PhotoClass).HasMaxLength(50);
        builder.Property(h => h.ImageUrl).HasMaxLength(1000);

        builder.Property(h => h.PricePerNightNpr).HasColumnType("decimal(10,2)");
        builder.Property(h => h.Rating).HasColumnType("decimal(3,2)");
        builder.Property(h => h.Latitude).HasColumnType("decimal(9,6)");
        builder.Property(h => h.Longitude).HasColumnType("decimal(9,6)");

        builder.HasIndex(h => new { h.ProvinceId, h.CityId });
        builder.HasIndex(h => h.DestinationId);

        builder.ToTable(t =>
        {
            t.HasCheckConstraint("CK_Hotel_Rating", "[Rating] >= 0 AND [Rating] <= 5");
            t.HasCheckConstraint("CK_Hotel_Price", "[PricePerNightNpr] >= 0");
            t.HasCheckConstraint("CK_Hotel_AvailableRooms", "[AvailableRooms] >= 0");
        });

        builder.HasOne(h => h.Destination)
            .WithMany(d => d.Hotels)
            .HasForeignKey(h => h.DestinationId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        builder.HasOne(h => h.City)
            .WithMany(c => c.Hotels)
            .HasForeignKey(h => h.CityId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(h => h.Province)
            .WithMany()
            .HasForeignKey(h => h.ProvinceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class HotelAmenityConfiguration : IEntityTypeConfiguration<HotelAmenity>
{
    public void Configure(EntityTypeBuilder<HotelAmenity> builder)
    {
        builder.ToTable("HotelAmenities");
        builder.HasKey(ha => new { ha.HotelId, ha.AmenityId });

        builder.HasOne(ha => ha.Hotel)
            .WithMany(h => h.HotelAmenities)
            .HasForeignKey(ha => ha.HotelId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ha => ha.Amenity)
            .WithMany(a => a.HotelAmenities)
            .HasForeignKey(ha => ha.AmenityId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
