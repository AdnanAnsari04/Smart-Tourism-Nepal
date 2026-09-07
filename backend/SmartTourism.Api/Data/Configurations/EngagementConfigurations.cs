using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartTourism.Api.Models.Engagement;

namespace SmartTourism.Api.Data.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("Reviews");
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Comment).IsRequired().HasMaxLength(2000);

        builder.HasIndex(r => r.DestinationId);
        builder.HasIndex(r => r.UserId);
        // One review per user per destination.
        builder.HasIndex(r => new { r.DestinationId, r.UserId }).IsUnique();

        builder.ToTable(t => t.HasCheckConstraint("CK_Review_Rating", "[Rating] >= 1 AND [Rating] <= 5"));

        builder.HasOne(r => r.Destination)
            .WithMany(d => d.Reviews)
            .HasForeignKey(r => r.DestinationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class FavoriteConfiguration : IEntityTypeConfiguration<Favorite>
{
    public void Configure(EntityTypeBuilder<Favorite> builder)
    {
        builder.ToTable("Favorites");
        builder.HasKey(f => f.Id);

        builder.Property(f => f.ItemType).HasConversion<string>().HasMaxLength(20);

        builder.HasIndex(f => new { f.UserId, f.ItemType, f.ItemId }).IsUnique();

        builder.HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(f => f.Destination)
            .WithMany(d => d.Favorites)
            .HasForeignKey(f => f.DestinationId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired(false);

        builder.HasOne(f => f.Hotel)
            .WithMany(h => h.Favorites)
            .HasForeignKey(f => f.HotelId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired(false);
    }
}

public class UserActivityConfiguration : IEntityTypeConfiguration<UserActivity>
{
    public void Configure(EntityTypeBuilder<UserActivity> builder)
    {
        builder.ToTable("UserActivities");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.ActivityType).HasConversion<string>().HasMaxLength(30);
        builder.Property(a => a.Description).HasMaxLength(500);
        builder.Property(a => a.IpAddress).HasMaxLength(45);

        builder.HasIndex(a => new { a.UserId, a.CreatedAt });

        builder.HasOne(a => a.User)
            .WithMany(u => u.Activities)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
