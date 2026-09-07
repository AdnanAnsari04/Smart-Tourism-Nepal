using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartTourism.Api.Models.Geography;

namespace SmartTourism.Api.Data.Configurations;

public class ProvinceConfiguration : IEntityTypeConfiguration<Province>
{
    public void Configure(EntityTypeBuilder<Province> builder)
    {
        builder.ToTable("Provinces");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Slug).IsRequired().HasMaxLength(50);
        builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Capital).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Description).IsRequired().HasMaxLength(1000);

        builder.HasIndex(p => p.Slug).IsUnique();
    }
}

public class CityConfiguration : IEntityTypeConfiguration<City>
{
    public void Configure(EntityTypeBuilder<City> builder)
    {
        builder.ToTable("Cities");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Slug).IsRequired().HasMaxLength(80);
        builder.Property(c => c.Name).IsRequired().HasMaxLength(120);
        builder.Property(c => c.District).IsRequired().HasMaxLength(120);
        builder.Property(c => c.Description).HasMaxLength(1000);
        builder.Property(c => c.ImageUrl).HasMaxLength(1000);

        builder.Property(c => c.Latitude).HasColumnType("decimal(9,6)");
        builder.Property(c => c.Longitude).HasColumnType("decimal(9,6)");

        builder.HasIndex(c => c.Slug).IsUnique();
        builder.HasIndex(c => c.ProvinceId);

        builder.HasOne(c => c.Province)
            .WithMany(p => p.Cities)
            .HasForeignKey(c => c.ProvinceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
