using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartTourism.Api.Models.Trekking;

namespace SmartTourism.Api.Data.Configurations;

public class TrekkingRegionConfiguration : IEntityTypeConfiguration<TrekkingRegion>
{
    public void Configure(EntityTypeBuilder<TrekkingRegion> builder)
    {
        builder.ToTable("TrekkingRegions");
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Slug).IsRequired().HasMaxLength(80);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(120);
        builder.Property(r => r.Description).HasMaxLength(1000);

        builder.HasIndex(r => r.Slug).IsUnique();
        builder.HasIndex(r => r.ProvinceId);

        builder.HasOne(r => r.Province)
            .WithMany(p => p.TrekkingRegions)
            .HasForeignKey(r => r.ProvinceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class TrekkingRouteConfiguration : IEntityTypeConfiguration<TrekkingRoute>
{
    public void Configure(EntityTypeBuilder<TrekkingRoute> builder)
    {
        builder.ToTable("TrekkingRoutes");
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Slug).IsRequired().HasMaxLength(150);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(150);
        builder.Property(r => r.Description).IsRequired().HasMaxLength(2000);
        builder.Property(r => r.District).HasMaxLength(120);
        builder.Property(r => r.BestSeason).IsRequired().HasMaxLength(100);
        builder.Property(r => r.StartingPoint).HasMaxLength(150);
        builder.Property(r => r.EndingPoint).HasMaxLength(150);
        builder.Property(r => r.PhotoClass).HasMaxLength(50);
        builder.Property(r => r.ImageUrl).HasMaxLength(1000);
        builder.Property(r => r.Difficulty).HasConversion<string>().HasMaxLength(20);
        builder.Property(r => r.Rating).HasColumnType("decimal(3,2)");
        builder.Property(r => r.Latitude).HasColumnType("decimal(9,6)");
        builder.Property(r => r.Longitude).HasColumnType("decimal(9,6)");

        builder.HasIndex(r => r.Slug).IsUnique();
        builder.HasIndex(r => r.TrekkingRegionId);

        builder.ToTable(t =>
        {
            t.HasCheckConstraint("CK_TrekkingRoute_Duration", "[MaxDurationDays] >= [MinDurationDays]");
            t.HasCheckConstraint("CK_TrekkingRoute_Altitude", "[MaxAltitudeMeters] > 0");
            t.HasCheckConstraint("CK_TrekkingRoute_Rating", "[Rating] >= 0 AND [Rating] <= 5");
        });

        builder.HasOne(r => r.TrekkingRegion)
            .WithMany(reg => reg.TrekkingRoutes)
            .HasForeignKey(r => r.TrekkingRegionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class TrekkingRoutePermitConfiguration : IEntityTypeConfiguration<TrekkingRoutePermit>
{
    public void Configure(EntityTypeBuilder<TrekkingRoutePermit> builder)
    {
        builder.ToTable("TrekkingRoutePermits");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.PermitName).IsRequired().HasMaxLength(150);

        builder.HasOne(p => p.TrekkingRoute)
            .WithMany(r => r.RequiredPermits)
            .HasForeignKey(p => p.TrekkingRouteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class TrekkingRouteEquipmentConfiguration : IEntityTypeConfiguration<TrekkingRouteEquipment>
{
    public void Configure(EntityTypeBuilder<TrekkingRouteEquipment> builder)
    {
        builder.ToTable("TrekkingRouteEquipment");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.ItemName).IsRequired().HasMaxLength(150);

        builder.HasOne(e => e.TrekkingRoute)
            .WithMany(r => r.Equipment)
            .HasForeignKey(e => e.TrekkingRouteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
